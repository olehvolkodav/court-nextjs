import { useEditor, EditorContent, JSONContent, Content } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Remix } from "../remix/Remix";
import Placeholder from "@tiptap/extension-placeholder";
import React from "react";
import CharacterCount from "@tiptap/extension-character-count";

interface CharacterCount {
  characters: number;
  words: number;
}

export interface EditorUpdateParamEvent {
  json: JSONContent | undefined,
  html: string | undefined;
  characters?: number;
  words?: number;
}

type EditorChildren = ((options: CharacterCount) => React.ReactElement<CharacterCount>) | React.ReactNode;

interface Props {
  onUpdate?: (event: EditorUpdateParamEvent) => any;
  limit?: number | null;
  onHTMLChange?: (html: string) => any;
  content?: Content;
  children?: EditorChildren,
  allowEmptyParagraph?: boolean;
}

export const Editor: React.FC<Props> = ({onUpdate, limit, onHTMLChange, content, allowEmptyParagraph, children}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Enter Description"
      }),
      CharacterCount.configure({limit})
    ],
    content,
  });

  const toggle = (command: string) => (e: any) => {
    editor?.chain().focus()[`toggle${command}`]().run()
  }

  const activeClassOf = React.useCallback((command: string) => {
    return editor?.isActive(command) ? "bg-gray-300 rounded" : "";
  }, [editor]);

  const renderChildren = React.useCallback((options: CharacterCount) => {
    if (!children) {
      return null;
    }

    return typeof children === "function" ? children(options) : children;
  }, [children])

  React.useEffect(() => {
    const onEditorUpdate = () => {
      const limitProps: Pick<EditorUpdateParamEvent, "words" | "characters"> = {
        words: undefined,
        characters: undefined
      }

      if (!!limit) {
        limitProps.words = editor?.storage.characterCount.words(),
        limitProps.characters = editor?.storage.characterCount.characters();
      }

      if (onHTMLChange) {
        onHTMLChange(
          allowEmptyParagraph ? editor?.getHTML() as string :
          !editor?.storage.characterCount.characters() ? "" : editor?.getHTML() as string
        )
      }

      if (onUpdate) {
        // Need fixed this if found problem when content is empty
        const json = editor?.getJSON();

        if (json?.content?.length === 1 && json.content[0].type === "paragraph" && !json.content[0].content) {
          onUpdate({
            json: undefined,
            html: undefined,
            ...limitProps,
          })
        } else {
          onUpdate({
            json: editor?.getJSON(),
            html: editor?.getHTML(),
            ...limitProps,
          })
        }
      }
    }

    editor?.on("update", onEditorUpdate);

    return () => {
      editor?.off("update", onEditorUpdate);
    }
  }, [editor, onUpdate, limit, onHTMLChange, allowEmptyParagraph]);

  return (
    <>
      <div className="border rounded-md border-gray-300">
        <EditorContent className="fixed-editor px-4 py-2" editor={editor} />

        <div className="flex items-center border-t border-gray-300 px-2 py-1 space-x-4">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className={activeClassOf("bold")}
              onClick={toggle("Bold")}
            >
              <Remix name="bold" className="text-gray-500"/>
            </button>

            <button
              type="button"
              className={activeClassOf("italic")}
              onClick={toggle("Italic")}
            >
              <Remix name="italic" className="text-gray-500"/>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              className={activeClassOf("orderedList")}
              onClick={toggle("OrderedList")}
            >
              <Remix name="order-list" className="text-gray-500" />
            </button>

            <button
              type="button"
              className={activeClassOf("bulletList")}
              onClick={toggle("BulletList")}
            >
              <Remix name="unorder-list" className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {renderChildren({
        characters: editor?.storage.characterCount.characters(),
        words: editor?.storage.characterCount.words()
      })}
    </>
  )
}

Editor.defaultProps = {
  limit: null,
  allowEmptyParagraph: false,
}
