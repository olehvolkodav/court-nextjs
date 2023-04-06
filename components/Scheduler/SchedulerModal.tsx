import React from "react";
import { getTileData } from "./helpers";
import DescriptionIcon from "../icons/DescriptionIcon";
import DocumentIcon from "../icons/DocumentIcon";
import { EvidenceList } from "../evidence/EvidenceList";
import Link from "next/link";
import CourtDocumentPreview from "./SchedulerModalViews/CourtDocumentPreview";
import { VisitationPreview } from "./SchedulerModalViews/VisitationPreview";
import { DefaultPreview } from "./SchedulerModalViews/DefaultPreview";
import { ToDoPreview } from "./SchedulerModalViews/ToDoPreview";
import { VoiceMemoPreview } from "./SchedulerModalViews/VoiceMemoPreview";

export const SchedulerModal: React.FC<{ props: any; scheduleObj: any }> = ({
  props,
  scheduleObj,
}) => {
  const components = {
    Evidence: <EvidenceList key={props.id} isBorderLess evidence={props} />,
    Hearings: <DefaultPreview source={props} />,
    Journals: <DefaultPreview source={props} />,
    Court_Document: (
      <CourtDocumentPreview source={props} scheduleObj={scheduleObj} />
    ),
    Voice_Memo: <VoiceMemoPreview source={props} />,
    Visitations: <VisitationPreview source={props} scheduleObj={scheduleObj} />,
    ToDo: <ToDoPreview source={props} scheduleObj={scheduleObj} />,
  };

  return props?.Id ? (
    <>
      {props?.component ? (
        components[props.component]
      ) : (
        <div className="scheduler-modal">
          <Link href={`${getTileData("url", props.Type?.__typename)}`}>
            <div className="flex items-center mb-6 cursor-pointer">
              <div
                className="w-5 h-5 rounded"
                style={{
                  backgroundColor: getTileData("color", props.Type?.__typename),
                }}
              />
              <h3 className="text-natural-13 font-semibold text-[24px] ml-4">
                {getTileData("title", props.Type.__typename)}
              </h3>
            </div>
          </Link>
          {props?.Subject !== "File" ? (
            <div className="flex items-center">
              <DescriptionIcon />
              <p className="ml-4">{props?.Subject}</p>
            </div>
          ) : (
            <div className="flex items-center">
              <DocumentIcon />
              <p className="ml-4 text-natural-8 text-sm font-normal">
                {props.Type.__typename}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  ) : null;
};
