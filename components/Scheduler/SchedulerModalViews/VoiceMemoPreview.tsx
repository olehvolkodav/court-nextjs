import { useEffect, useRef, useState } from "react";
import { DocumentTextIcon } from "@heroicons/react/outline";
import { PauseIcon, PlayIcon } from "@heroicons/react/solid";

import { TranscriptionViewer } from "@/components/voice-memo/TranscriptionViewer";
import PlaySoundIcon from "@/components/icons/PlaySoundIcon";
import { $date } from "@/plugins/date";

export const VoiceMemoPreview = ({ source }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioURL, setAudioURL] = useState<string>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTranscript, setSelectedTranscript] = useState<any>();
  const [selectedTranscriptPaper, setSelectedTranscriptPaper] =
    useState<any>(null);

  const togglePlay = (transcript: any) => () => {
    setSelectedTranscript(transcript);
    setAudioURL(transcript.voice.url);
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      isPlaying ? audio.play() : audio.pause();

      audio.onended = () => {
        setIsPlaying(false);
      };
    }
  }, [selectedTranscript?.id, isPlaying]);

  return (
    <>
      <div className="py-4">
        {!selectedTranscriptPaper ? (
          <div>
            <div className="bg-white shadow rounded-lg px-4 py-2 my-2">
              <div className="flex justify-between items-center space-x-2">
                <button type="button" onClick={togglePlay(source)}>
                  {source?.id == selectedTranscript?.voice?.id ? (
                    <>
                      {isPlaying ? (
                        <PauseIcon className="h-12 w-12 text-primary-1" />
                      ) : (
                        <PlayIcon className="h-12 w-12 text-primary-1" />
                      )}
                    </>
                  ) : (
                    <PlayIcon className="h-12 w-12 text-primary-1" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <p className="text-lg text-natural-13 font-medium">
                    {source?.name}
                  </p>
                  <span className="text-sm text-gray-500">
                    {$date(source?.created_at).format("MMMM DD, YYYY hh:mm A")}
                  </span>
                </div>

                {/* if has transcriptions */}
                <DocumentTextIcon
                  className="h-8 w-8 text-primary-1 cursor-pointer"
                  onClick={() => setSelectedTranscriptPaper(source)}
                />
              </div>
            </div>

            {!!selectedTranscript && (
              <div className="mt-4 flex justify-center items-center flex-col">
                <div className="flex flex-col text-center">
                  <span className="text-xl text-natural-13 font-medium">
                    {selectedTranscript.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {$date(selectedTranscript.voice.created_at).format(
                      "MMMM DD, YYYY hh:mm A"
                    )}
                  </span>
                </div>

                <div className="my-24">
                  <PlaySoundIcon />
                </div>

                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedTranscript.result,
                  }}
                />

                <div className="mt-8">
                  <button
                    type="button"
                    onClick={togglePlay(selectedTranscript)}
                  >
                    {isPlaying ? (
                      <PauseIcon className="h-16 w-16 text-primary-1" />
                    ) : (
                      <PlayIcon className="h-16 w-16 text-primary-1" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="container px-4 mx-auto">
            <TranscriptionViewer
              transcript={selectedTranscriptPaper}
              goBack={() => setSelectedTranscriptPaper(null)}
              isInModal
            />
          </div>
        )}
      </div>

      {!!audioURL && <audio src={audioURL} ref={audioRef} />}
    </>
  );
};
