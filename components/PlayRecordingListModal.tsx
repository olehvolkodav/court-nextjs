import React, {Fragment, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {ModalProps} from "@/interfaces/modal.props";
import {XIcon} from "@heroicons/react/outline";
import {PauseIcon, PlayIcon} from "@heroicons/react/solid";
import PlaySoundIcon from "@/components/icons/PlaySoundIcon";

interface Props extends ModalProps {
}

export const PlayRecordingListModal: React.FC<Props> = ({isOpen, onClose}) => {
  const [playedRecording, setPlayedRecording] = useState(0);
  const [playedRecordingDetails, setPlayedRecordingDetails] = useState({
    id: null,
    name: null,
    time: null,
    duration: null,
  });
  const [displayTime, setDisplayTime] = useState<string>("00:00:00");
  const [counter, setCounter] = useState<number>(0);
  const [isStoppedCounter, setIsStoppedCounter] = useState<boolean>(false);

  useEffect(() => {
    if (playedRecordingDetails?.id) {
      const interval = setInterval(() => {
        if (counter > -1 && !isStoppedCounter) {
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
          setCounter(prevCounter => prevCounter - 1);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [playedRecordingDetails?.id, counter, isStoppedCounter]);

  const handlePlayClick = (recording) => {
    setCounter(recording?.duration);
    setIsStoppedCounter(false);
    setPlayedRecordingDetails({
      id: recording,
      name: recording?.name,
      time: recording?.time,
      duration: recording?.duration,
    });
    setPlayedRecording(recording?.id);
  };

  const recordings = [
    {
      id: 1,
      name: "First Name",
      time: "July 1, New York",
      duration: "36",
    },
    {
      id: 2,
      name: "Second Name",
      time: "July 2, New York",
      duration: "37",
    },
    {
      id: 3,
      name: "Third Name",
      time: "July 3, New York",
      duration: "38",
    },
    {
      id: 4,
      name: "Fourth Name",
      time: "July 4, New York",
      duration: "39",
    },
  ]
  const closeModal = () => {
    if (onClose) {
      onClose(false)
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
                <div className="flex justify-center">
                  <div className="w-1/2 overflow-y-scroll max-height-100 h-96">
                    {recordings.map((recording) => (
                      <div
                        onClick={() => handlePlayClick(recording)}
                        key={recording.id}
                        className="pl-2 mt-4 relative rounded-lg border border-t-0 shadow-lg border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 "
                      >
                        <div className="flex-shrink-0">
                          {recording?.id == playedRecording ?
                            <PauseIcon className="h-10 w-10" color="#6200EE" aria-hidden="true"/>
                            :
                            <PlayIcon className="h-10 w-10" color="#6200EE" aria-hidden="true"/>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <a href="#" className="focus:outline-none">
                            <span className="absolute inset-0" aria-hidden="true"/>
                            <p className="text-sm font-medium text-gray-900">{recording.name}</p>
                            <p
                              className="mt-0 text-sm text-gray-500 truncate">{recording.time}{" " + recording.duration}</p>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="w-1/2 mt-8">
                    {playedRecordingDetails?.id &&
                    <>
                      <div>
                        <h1 id="message-heading" className="text-xl font-medium text-gray-900 flex justify-center">
                          {playedRecordingDetails?.name}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 truncate flex justify-center">{playedRecordingDetails?.time}</p>
                      </div>
                      <div className="flex justify-center mt-4 mx-8  mt-16">
                        <PlaySoundIcon/>
                      </div>
                      <h1 id="message-heading"
                          className="text-4xl font-medium text-gray-900 flex justify-center mt-4">
                        {displayTime}
                      </h1>
                      <div className="flex justify-center mt-4 mx-8  mt-8">
                        {isStoppedCounter ?
                          <PlayIcon onClick={() => setIsStoppedCounter(false)} className="-ml-0.5 mr-2 h-10 w-10"
                                    color="gray" aria-hidden="true"/>
                          :
                          <PauseIcon onClick={() => setIsStoppedCounter(true)} className="h-14 w-14" color="#6200EE"
                                     aria-hidden="true"/>
                        }
                      </div>
                    </>
                    }
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