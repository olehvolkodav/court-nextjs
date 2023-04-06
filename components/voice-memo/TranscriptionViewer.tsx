import React, { useState, useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import { PrinterIcon, DownloadIcon } from "@heroicons/react/outline";

import { $date } from "@/plugins/date";
import { $http } from "@/plugins/http";
import { useDownload } from "@/hooks/download.hook";

import { ShareIcon } from "@/components/icons/ShareIcon";

interface ITranscriptionViewer {
  transcript: any;
  goBack: () => void;
  isInModal?: boolean;
}

export const TranscriptionViewer: React.FC<ITranscriptionViewer> = ({
  transcript,
  goBack,
  isInModal,
}) => {
  const [timeText, setTimeText] = useState("");
  const [transcriptText, setTranscriptText] = useState("");
  const { windowDownload } = useDownload();

  const getRemovedHTMLTags = (str: string) => {
    return str.replace(/(<([^>]+)>)/ig, "");
  };

  useEffect(() => {
    const splits = transcript?.result?.split("    ");
    if (splits?.length > 2) {
      setTimeText(splits[1]);
      setTranscriptText(getRemovedHTMLTags(splits[2]));
    }
  }, [transcript]);

  const onDownload = async () => {
    const res = await $http.post(
      `/files/${transcript.pdf.id}/download`,
      {},
      {
        responseType: "blob",
      }
    );

    windowDownload(res.data, transcript.pdf.name, "application/octet-stream");
  };

  return (
    <div className="relative">
      <div className="flex items-center mb-9">
        <button type="button" onClick={goBack} className="mr-2">
          <ArrowLeftIcon className="h-5 w-5" />
        </button>

        <h1 className="text-2xl font-medium text-natural-13">Back</h1>
      </div>
      <div
        className={`${
          isInModal ? '' : "p-12"
        } relative container mx-auto bg-white rounded-lg  w-[766px]`}
      >
        <p className="text-natural-7 text-sm mb-3">
          {$date(transcript.voice.created_at).format("MMM DD, YYYY")}
        </p>
        <h2
          className={`${
            isInModal ? "text-xl" : "text-4xl"
          } text-[#05222E]  font-medium mb-3`}
        >
          {transcript.name}
        </h2>
        <p className="text-purple-500 text-sm font-bold mb-6">{timeText}</p>
        <p className="text-natural-8 text-base mb-8">{transcriptText}</p>
        <div className="flex items-center">
          <button className="flex items-center text-white bg-purple-500 text-xs font-semibold mr-[18px] rounded-[6px] p-[10px]">
            <ShareIcon
              className="w-[22px] h-[22px] mr-[6px]"
              stroke="#ffffff"
            />
            Share
          </button>
          <button
            className="flex items-center text-purple-500 bg-white text-xs font-semibold border border-purple-500 rounded-[6px] p-[10px]"
            onClick={onDownload}
          >
            <DownloadIcon className="w-5 h-5 mr-[6px]" />
            Download
          </button>
        </div>
        <button className="flex items-center absolute top-15 right-15 text-[13px] text-purple-500 font-medium">
          <PrinterIcon className="w-5 h-5 mr-[6px]" />
          print
        </button>
      </div>
    </div>
  );
};
