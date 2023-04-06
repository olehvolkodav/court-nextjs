import { useFileUpload } from "@/context/file-upload.context";
import { ModalProps } from "@/interfaces/modal.props";
import { $http } from "@/plugins/http";
import { Transition, Dialog } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import React, { Fragment, useEffect, useState } from "react";
import { Button } from "../button";
import { FieldError, Input, Label } from "../form";
import { Switch } from "../switch/Switch";
import { TagInput } from "@/components/ui/multi-select/TagInput";

interface Props extends ModalProps {}

export const FileEdit: React.FC<Props> = ({isOpen}) => {
  const [state, dispatch] = useFileUpload();

  const [name, setName] = useState("");
  const [is_private, setIsPrivate] = useState(false);
  const [tags, setTags] = useState<any[]>([])

  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    dispatch({editModalOpen: false});
  }

  const updateFile = async() => {
    setLoading(true);

    try {
      const {data} = await $http.patch(`/files/${state.editedFile.id}`, {
        is_private,
        tags,
        name: `${name}.${state.editedFile.ext}`,
        type: "update",
      });

      dispatch({
        editModalOpen: false,
        files: state.files.map(file => {
          if (file.id == data.id) {
            return {
              ...file,
              ...data,
            }
          }

          return file;
        })
      })
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!!state.editedFile) {
      setName(
        state.editedFile.name.replace(`.${state.editedFile.ext}`, "")
      );

      setIsPrivate(
        state.editedFile.is_private ?? false
      )

      if (state.editedFile.tags) {
        setTags(state.editedFile.tags.map((tag: any) => tag.name))
      }
    }
  }, [state.editedFile]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-800 bg-opacity-60 transition-opacity opacity-100" />
        </Transition.Child>

        <div className="relative w-full max-w-screen-lg transform px-4 transition-all opacity-100 scale-100">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            {!!state.editedFile && (
              <Dialog.Panel className="overflow-hidden rounded-lg bg-white shadow-md">
                <div className="relative flex items-center justify-between shadow-sm px-4 py-2">
                  <h3 className="text-xl font-bold text-gray-700">Update File</h3>

                  <button type="button" className="h-5 w-5" onClick={closeModal}>
                    <XIcon />
                  </button>
                </div>

                <div className="max-h-[18.375rem] px-4 py-2 divide-gray-200 overflow-y-auto rounded-b-lg border-t border-gray-200 text-sm font-medium">
                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>

                      <div className="flex rounded-md shadow-sm">
                        <Input
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
                          value={name}
                          onChangeText={setName}
                          placeholder="File Name"
                        />

                        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                          .{state.editedFile.ext}
                        </span>
                      </div>

                      <FieldError name="name" />
                    </div>

                    <div>
                      <Switch checked={is_private} onChange={setIsPrivate}>
                        <span className="ml-2">Is Private</span>
                      </Switch>

                      <p className="text-xs text-gray-500 mt-1">
                        If checked, file will be move to Private folder and cannot be shared
                      </p>
                    </div>

                    <div>
                      <Label>Tags</Label>

                      <TagInput maxTag={5} onChange={setTags} value={tags} />
                    </div>
                  </div>
                </div>

                <div className="border-t px-4 py-2">
                  <Button onClick={updateFile} isLoading={loading}>Update File</Button>
                </div>
              </Dialog.Panel>
            )}
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

FileEdit.defaultProps = {
  isOpen: false,
  onClose: () => {}
}
