import { useEffect, useRef, useState } from "react";
import { DocumentTextIcon } from "@heroicons/react/outline";
import { PauseIcon, PlayIcon } from "@heroicons/react/solid";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { TranscriptionViewer } from "@/components/voice-memo/TranscriptionViewer";
import PlaySoundIcon from "@/components/icons/PlaySoundIcon";
import { withDashboardLayout } from "@/hoc/layout";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { $date } from "@/plugins/date";
import { $gql } from "@/plugins/http";

const TRANSCRIPTS_QUERY = `
  query {
    my_transcripts {
      id
      name
      result
      voice {
        id
        name
        url
        created_at
      }
      pdf {
        id
        name
        url
        created_at
      }
    }
  }
`

const VoiceMemoPage: NextPageWithLayout = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [audioURL, setAudioURL] = useState<string>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTranscript, setSelectedTranscript] = useState<any>();
  const [selectedTranscriptPaper, setSelectedTranscriptPaper] = useState<any>(null);

  const togglePlay = (transcript: any) => () => {
    setSelectedTranscript(transcript)
    setAudioURL(transcript.voice.url);
    setIsPlaying(prev => !prev);
  }

  useEffect(() => {
    const getTranscripts = async () => {
      try {
        const data = await $gql({
          query: TRANSCRIPTS_QUERY
        });

        setTranscripts(data?.my_transcripts);
      } catch (error) {
        //
      }
    }

    getTranscripts()
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      isPlaying ? audio.play() : audio.pause();

      audio.onended = () => {
        setIsPlaying(false);
      }
    }
  }, [selectedTranscript?.id, isPlaying])

  return (
    <>
      <div className="py-4">
        {
          !selectedTranscriptPaper ?
          <div className="container px-4 mx-auto">
            <PageHeader title="Voice Memo" className="mb-4" />

            <div className="bg-white shadow-sm rounded-lg p-4 lg:p-6">
              <div className="grid grid-cols lg:grid-cols-3 gap-4">
                <div className="space-y-4">
                  {transcripts.map(transcript => (
                    <div className="bg-white shadow rounded-lg px-4 py-2" key={transcript.id}>
                      <div className="flex justify-between items-center space-x-2">
                        <button type="button" onClick={togglePlay(transcript)}>
                          {transcript.voice.id == selectedTranscript?.voice?.id ? (
                            <>
                              {isPlaying ? <PauseIcon className="h-12 w-12 text-primary-1" /> : <PlayIcon className="h-12 w-12 text-primary-1" />}
                            </>
                          ) : (
                            <PlayIcon className="h-12 w-12 text-primary-1" />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <p className="text-lg text-natural-13 font-medium">
                            {transcript.voice.name}
                          </p>
                          <span className="text-sm text-gray-500">{$date(transcript.voice.created_at).format("MMMM DD, YYYY hh:mm A")}</span>
                        </div>

                        {/* if has transcriptions */}
                        <DocumentTextIcon
                          className="h-8 w-8 text-primary-1 cursor-pointer"
                          onClick={() => setSelectedTranscriptPaper(transcript)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {!!selectedTranscript && (
                  <div className="lg:col-span-2 flex justify-center items-center flex-col">
                    <div className="flex flex-col text-center">
                      <span className="text-xl text-natural-13 font-medium">{selectedTranscript.name}</span>
                      <span className="text-sm text-gray-500">{$date(selectedTranscript.voice.created_at).format("MMMM DD, YYYY hh:mm A")}</span>
                    </div>

                    <div className="my-24">
                      <PlaySoundIcon />
                    </div>

                    <div dangerouslySetInnerHTML={{ __html: selectedTranscript.result }} />

                    <div className="mt-8">
                      <button type="button" onClick={togglePlay(selectedTranscript)}>
                        {isPlaying ? <PauseIcon className="h-16 w-16 text-primary-1" /> : <PlayIcon className="h-16 w-16 text-primary-1" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
           :
          <div className="container px-4 mx-auto">
            <TranscriptionViewer
              transcript={selectedTranscriptPaper}
              goBack={() => setSelectedTranscriptPaper(null)}
            />
          </div>
        }
      </div>

      {!!audioURL && (
        <audio src={audioURL} ref={audioRef} />
      )}
    </>
  )
}

export default withDashboardLayout(VoiceMemoPage, "Court - Voice Memo");
