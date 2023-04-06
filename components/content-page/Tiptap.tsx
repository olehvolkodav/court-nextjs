import React, {useCallback, useState} from "react";
import {useEditor, EditorContent, Editor} from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import BoldIcon from "@/components/icons/BoldIcon";
import UnderLineIcon from "@/components/icons/UnderLineIcon";
import ItalicIcon from "@/components/icons/ItalicIcon";
import StrikethroughIcon from "@/components/icons/StrikethroughIcon";
import CodeIcon from "@/components/icons/CodeIcon";
import RotateLeftIcon from "@/components/icons/RotateLeftIcon";
import RotateRightIcon from "@/components/icons/RotateRightIcon";
import Image from "@tiptap/extension-image"
import {classNames} from "@/utils/classname";
import {PhotographIcon} from "@heroicons/react/outline"
import Placeholder from "@tiptap/extension-placeholder";
import {FieldError} from "@/components/ui/form";

interface Props {
  onUpdate: (string) => void
  editData?: any
  canBold?: boolean
  canItalic?: boolean
  canUnderLine?: boolean
  canStrike?: boolean
  canCode?: boolean
  canUploadImage?: boolean
  content?: string
}

const EditTipTap: React.FC<Props> = (props) => {
  const [showToolTip, setShowToolTip] = useState<Boolean>(false);

  const {
    onUpdate,
    canBold,
    canItalic,
    canUnderLine,
    canStrike,
    canCode,
    canUploadImage,
    content,
  } = props;

  const editor = useEditor({
    extensions: [
      Document,
      History,
      Paragraph,
      Text,
      Image,
      Bold,
      Underline,
      Italic,
      Strike,
      Code,
      Placeholder.configure({
        placeholder: "Enter Page Content Here"
      }),
    ],
    onUpdate({editor}) {
      onUpdate(editor.getHTML());
    },
    content
  }) as Editor;

  const toggleBold = useCallback(() => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleCode = useCallback(() => {
    editor.chain().focus().toggleCode().run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt("URL")

    if (url) {
      editor.chain().focus().setImage({src: url}).run()
    }
  }

  return (
    <div>
      <div className="flex-col md:flex-row flex items-center md:justify-center">
        <div className="relative">
          {showToolTip && (
            <div role="tooltip"
                  className="z-20 -mt-20 w-80 transition duration-150 ease-in-out left-0 ml-8 shadow-lg bg-white p-4 rounded flex justify-center">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <button
                    type="button"
                    className="menu-button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                  >
                    <RotateLeftIcon/>
                  </button>
                  <button
                    type="button"
                    className="menu-button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                  >
                    <RotateRightIcon/>
                  </button>
                  {canBold &&
                  <button
                      type="button"
                      className={classNames(
                        editor.isActive("bold") ? "is-active" : "",
                        "menu-button"
                      )}
                      onClick={toggleBold}
                  >
                      <BoldIcon/>
                  </button>
                  }
                  {
                    canUnderLine &&
                    <button
                        type="button"
                        className={classNames(
                          editor.isActive("underline") ? "is-active" : "",
                          "menu-button"
                        )}
                        onClick={toggleUnderline}
                    >
                        <UnderLineIcon/>
                    </button>
                  }
                  {
                    canItalic &&
                    <button
                        type="button"
                        className={classNames(
                          editor.isActive("italic") ? "is-active" : "",
                          "menu-button"
                        )}
                        onClick={toggleItalic}
                    >
                        <ItalicIcon/>
                    </button>
                  }
                  {
                    canStrike &&
                    <button
                        type="button"
                        className={classNames(
                          editor.isActive("strike") ? "is-active" : "",
                          "menu-button"
                        )}
                        onClick={toggleStrike}
                    >
                        <StrikethroughIcon/>
                    </button>
                  }
                  {
                    canCode &&
                    <button
                        type="button"
                        className={classNames(
                          editor.isActive("content-code") ? "is-active" : "",
                          "menu-button"
                        )}
                        onClick={toggleCode}
                    >
                        <CodeIcon/>
                    </button>
                  }
                  {
                    canUploadImage &&
                    <button
                      type="button"
                      onClick={addImage}
                      className={classNames(
                        editor.isActive("content-code") ? "is-active" : "",
                        "menu-button"
                      )}
                    >
                        <PhotographIcon className="h-6 w-6" aria-hidden="true" color={"gray"}/>
                    </button>
                  }
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div aria-expanded="false">
        <EditorContent editor={editor} onDoubleClick={() => setShowToolTip(true)}/>
      </div>
    </div>
  );
}

EditTipTap.defaultProps = {
  canBold: true,
  canItalic: true,
  canUnderLine: true,
  canStrike: true,
  canCode: true,
  canUploadImage: true,
}

export default EditTipTap;