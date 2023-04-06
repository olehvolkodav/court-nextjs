import React, {useEffect, useState} from "react";
import {
  MicrophoneIcon, StopIcon
} from "@heroicons/react/solid"
import {$http} from "@/plugins/http";

interface Props {
  onDurationChange?: (value: any) => any
}

export const RecordAudioButton: React.FC<Props> = ({onDurationChange}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [counter, setCounter] = useState(0);
  const [enabled, setEnabled] = useState(false)
  const [recorder, setRecorder] = useState<any>(null);
  const [audioURL, setAudioURL] = useState("");

  useEffect(() => {
    const storeFile = async () => {
      if (audioURL) {
        const blob = await fetch(audioURL).then(r => r.blob());
        const audioFile = new File([blob], "audioFile.webm", {type: "audio/webm"});

        try {
          const formData = new FormData();
          formData.append("file", audioFile);
          formData.append("type", "file");

          await $http.post("/files", formData);
          setCounter(0);

        } catch (error) {
        }
      }
    };
    storeFile();
  }, [audioURL]);


  useEffect(() => {
    if (enabled) {
      const interval = setInterval(() => {
        setCounter(prevCounter => prevCounter + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [enabled]);

  useEffect(() => {
    if (recorder === null) {
      if (isRecording) {
        requestRecorder().then(setRecorder, console.error);
      }
      return;
    }
    // Manage recorder state.
    if (isRecording) {
      recorder.start();
    } else {
      recorder.stop();
    }
    // Obtain the audio when ready.
    const handleData = e => {
      setAudioURL(URL.createObjectURL(e.data));
    };

    recorder.addEventListener("dataavailable", handleData);
    return () => recorder.removeEventListener("dataavailable", handleData);
  }, [recorder, isRecording]);


  const requestRecorder = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    return new MediaRecorder(stream);
  }

  const handleChange = () => {
    if (enabled) {
      setIsRecording(false);
      if (onDurationChange) {
        onDurationChange(counter);
      }
    } else {
      setIsRecording(true);
    }

    setEnabled(!enabled);
  };

  return (
    <div>
      <button
        onClick={handleChange}
        type="button"
        className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {enabled ?
          <span className="flex justify-center">
            <StopIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true"/> Stop Recording
          </span>
          :
          <span className="flex justify-center">
            <MicrophoneIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true"/> Start Recording
          </span>
        }
      </button>
    </div>
  )
}