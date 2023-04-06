import React, {Fragment, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {Button} from "@/components/ui/button";
import {ModalProps} from "@/interfaces/modal.props";
import {FieldError, Input, Label, Textarea} from "../ui/form";
import {FileUpload} from "@/components/ui/file-upload/FileUpload";
import {XIcon} from "@heroicons/react/outline";
import {$http} from "@/plugins/http";
import {useToast} from "@/hooks/toast.hook";
import {$date} from "@/plugins/date";
import {TagInput} from "@/components/ui/multi-select/TagInput";
import { useCaseDashboard } from "@/hooks/case.hook";
import { useUpload } from "@/hooks/upload.hook";

interface Props extends ModalProps {
  onSaved?: () => void,
}

export const AddDailyJournalModal: React.FC<Props> = ({isOpen, onClose, onSaved}) => {
  const [courtCase] = useCaseDashboard();
  const { files, initFile, appendFile, removeFile } = useUpload();

  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState($date().format("YYYY-MM-DD"));
  const [time, setTime] = useState("");
  const [tags, setTags] = useState<any[]>([]);

  const closeModal = () => {
    if (onClose) {
      setTitle("");
      setDescription("");
      setDate($date().format("YYYY-MM-DD"));
      initFile();
      setTags([]);
      onClose(false)
    }
  }

  const addDailyJournal = async () => {
    setLoading(true);

    try {
      await $http.post("/journals", {
        title,
        description,
        date,
        tags,
        time,
        type: "journal",
        files: files.map(file => file.id),
        court_case_id: courtCase.id,
      });

      if (onSaved) {
        onSaved();
      }

      toast.show({message: "Journal added!"});

      closeModal();
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-800 bg-opacity-60 transition-opacity opacity-100"/>
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-800 mb-4"
                  >
                    Add To Journal
                  </Dialog.Title>

                  <button type="button" className="h-6 w-6 text-gray-700 hover:text-gray-800" onClick={closeModal}>
                    <XIcon/>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input type="text" onChangeText={setTitle} value={title} placeholder="Title"/>

                    <FieldError name="title" />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea value={description} onChangeText={setDescription} rows={12} />

                    <FieldError name="description" />
                  </div>

                  <div>
                    <Label>Date</Label>
                    <Input type="date" value={date} onChangeText={setDate} />

                    <FieldError name="date" />
                  </div>

                  <div>
                    <Label>Time</Label>
                    <Input type="time" value={time} onChangeText={setTime} />
                    <FieldError name="time" />
                  </div>

                  <div>
                    <Label>Tags</Label>
                    <TagInput maxTag={6} onChange={setTags}/>
                  </div>

                  <div>
                    <Label>Add Files</Label>
                    <FileUpload onUploaded={appendFile} onFileDeleted={removeFile}/>
                  </div>

                  <div className="flex">
                    <Button onClick={addDailyJournal} isLoading={loading} className="mr-3 min-w-[120px]">
                      Add To Journal
                    </Button>

                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
