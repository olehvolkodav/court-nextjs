import React, {Fragment, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {ModalProps} from "@/interfaces/modal.props";
import {XIcon} from "@heroicons/react/outline";
import {PauseIcon, PlayIcon, StopIcon} from "@heroicons/react/solid";
import {$http} from "@/plugins/http";
import RecordingIcon from "@/components/icons/RecordingIcon";
import {FieldError, Input, Label} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import { classNames } from "@/utils/classname";
import { useTagsButton } from "@/hooks/tags-button.hook";
import { useCaseDashboard } from "@/hooks/case.hook";

interface Props extends ModalProps {
  onDurationChange?: (value: any) => any
}

const tagOptions = ["court", "journal", "notes", "task", "checklist"];

export const RecordingModal: React.FC<Props> = ({onDurationChange, isOpen, onClose}) => {
  const [courtCase] = useCaseDashboard();
  const { isTagSelected, handleTagChange } = useTagsButton();

  const [isRecording, setIsRecording] = useState(false);
  const [counter, setCounter] = useState<number>(0);
  const [displayTime, setDisplayTime] = useState<string>("00:00:00");
  const [enabled, setEnabled] = useState(false)
  const [recorder, setRecorder] = useState<any>(null);
  const [audioURL, setAudioURL] = useState("");
  const [saveModalContent, setSaveModalContent] = useState(false);
  const [pauseRecording, setPauseRecoding] = useState<boolean>(false);
  const [resumeRecording, setResumeRecording] = useState<boolean>(false);

  const [name, setName] = useState(`Recording-${Date.now()}`);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [loading, setLoading] = useState(false);

  const storeFile = async () => {
    setLoading(true);

    if (audioURL) {
      const blob = await fetch(audioURL).then(r => r.blob());
      const audioFile = new File([blob], name + ".webm", {type: "audio/webm"});

      try {
        const formData = new FormData();
        formData.append("voice", audioFile);
        formData.append("name", name)
        formData.append("date", date)
        formData.append("time", time)
        formData.append("court_case_id", courtCase.id)

        await $http.post("/transcripts", formData);

        closeModal();
      } catch (error) {

      } finally {
        setLoading(false);
      }    
    }
  };

  useEffect(() => {
    if (enabled) {
      const interval = setInterval(() => {
        let hours: any = Math.floor(counter / 3600); // get hours
        let minutes: any = Math.floor((counter - (hours * 3600)) / 60); // get minutes
        let seconds: any = counter - (hours * 3600) - (minutes * 60); //  get seconds

        if (hours < 10) {
          hours = "0" + hours;
        }
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        const sinceTime = hours + ":" + minutes + ":" + seconds;
        setDisplayTime(sinceTime);
        setCounter(prevCounter => prevCounter + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [enabled, counter]);

  useEffect(() => {
    if (recorder === null) {
      if (isRecording) {
        requestRecorder().then(setRecorder, console.error);
      }
      return;
    }

    if (pauseRecording) {
      recorder?.pause();
    }

    if (resumeRecording) {
      recorder?.resume();
    }

    // Manage recorder state.
    if (!pauseRecording && !resumeRecording) {
      if (isRecording) {
        recorder?.start();
      } else {
        recorder?.stop();
      }
    }
    // Obtain the audio when ready.
    const handleData = (e: any) => {
      setAudioURL(URL.createObjectURL(e.data));
    };

    recorder.addEventListener("dataavailable", handleData);
  }, [recorder, isRecording, pauseRecording, resumeRecording]);

  const closeModal = () => {
    if (onClose) {
      setCounter(0);
      setDisplayTime("00:00:00");
      setSaveModalContent(false);
      setEnabled(false);
      onClose(false)
    }
  }

  const requestRecorder = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    return new MediaRecorder(stream);
  }

  const PlayResumeHandle = () => {
    if (!pauseRecording) {
      setIsRecording(true);
    } else {
      setResumeRecording(true);
    }
    setEnabled(prev => !prev);
  };

  const handlePauseRecording = () => {
    setPauseRecoding(true);
    setEnabled(prev => !prev);
  };

  const stopRecording = () => {
    if (counter > 0) {
      setPauseRecoding(false);
      setResumeRecording(false);
      setIsRecording(false);
      setSaveModalContent(true);
      if (onDurationChange) {
        onDurationChange(counter);
      }
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
                <div className="flex justify-end">
                  <button type="button" className="h-6 w-6 text-gray-700 hover:text-gray-800" onClick={closeModal}>
                    <XIcon/>
                  </button>
                </div>
                {saveModalContent ?
                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input value={name} onChangeText={setName} />

                      <FieldError name="name" />
                    </div>

                    <div>
                      <Label>Date</Label>
                      <Input value={date} type="date" onChangeText={setDate} />
                      <FieldError name="date" />
                    </div>

                    <div>
                      <Label>Time</Label>
                      <Input value={time} type="time" onChangeText={setTime} />
                      <FieldError name="time" />
                    </div>

                    <div>
                      <Label>Tags</Label>

                      <div className="space-x-2">
                        {tagOptions.map(option => (
                          <button
                            type="button"
                            key={option}
                            className={
                              classNames(
                                "capitalize rounded-full px-6 py-1.5 text-sm border border-natural-10",
                                isTagSelected(option) ? "bg-natural-10 text-white" : ""
                              )
                            }
                            onClick={handleTagChange(option)}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex">
                      <Button onClick={storeFile} className="min-w-[120px]" isLoading={loading}>
                        Save
                      </Button>
                    </div>
                  </div>

                  : <div>
                    <div className="pb-5">
                      <h5 id="message-heading" className="text-4xl font-medium text-gray-900 flex justify-center">
                        {displayTime}
                      </h5>

                      <p className="mt-1 text-sm text-gray-500 truncate flex justify-center">Recording</p>
                    </div>

                    <div className="flex justify-center mt-4">
                      <RecordingIcon/>
                    </div>

                    <div className="flex justify-center mt-16 space-x-2">
                      <StopIcon
                        className="h-10 w-10 cursor-pointer" color="#6200EE"
                        aria-hidden="true"
                        onClick={stopRecording}
                      />

                      {enabled ?
                        <PauseIcon
                          onClick={handlePauseRecording}
                          className="h-10 w-10 cursor-pointer"
                          color="gray"
                          aria-hidden="true"
                        />
                        :
                        <PlayIcon
                          onClick={PlayResumeHandle}
                          className="h-10 w-10 cursor-pointer"
                          color="gray"
                          aria-hidden="true"
                        />
                      }
                    </div>
                  </div>
                }
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
