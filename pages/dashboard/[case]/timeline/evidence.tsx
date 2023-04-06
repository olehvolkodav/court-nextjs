import type { NextPageWithLayout } from "@/interfaces/page.type";
import React, { useEffect, useState } from "react";

import { MultiSelectType } from "@/components/ui/multi-select/MultiSelectType";
import { TimelineFilter } from "@/components/timeline/TimelineFilter";
import { VerticalIcon } from "@/components/icons/VerticalIcon";
import { HorizontalIcon } from "@/components/icons/HorizontalIcon";

import { $gql } from "@/plugins/http";
import { withDashboardLayout } from "@/hoc/layout";
import { MY_TIMELINE_QUERY } from "@/graphql/query/timeline";
import { classNames } from "@/utils/classname";
import {
  CALENDAR_DASHBOARD_OPTIONS,
  CALENDAR_EXTENSION_OPTIONS,
  CALENDAR_TYPE_OPTIONS,
} from "@/constants/calendar";

import { TimelineScheduler } from "@/components/Scheduler";
import { Select } from "@/components/ui/form";
import { $date } from "@/plugins/date";
import { useAllEvidenceQuery } from "@/graphql/execution/evidence";
import { useRouter } from "next/router";

import { DEFAULT_FILE_QUERY } from "@/graphql/query/file";
import {
  PAGINATION_FIELD,
  PAGINATION_PARAMS,
  PAGINATION_VARS,
  parsePage,
} from "@/graphql/query/util";
import { useAllCalenderQuery } from "@/graphql/execution/journals";
import { useVoiceMemoQuery } from "@/graphql/execution/voice";
import { useAllVisitationsQuery } from "@/graphql/execution/visitations";
import { useAllTasksQuery } from "@/graphql/execution/tasks";
interface IDirectionButton {
  className?: string;
  Icon: any;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const DirectionButton: React.FC<IDirectionButton> = ({
  className = "",
  Icon,
  label,
  isActive,
  onClick,
}) => {
  return (
    <button
      className={classNames(
        "flex items-center p-[11px]",
        className,
        isActive ? "border-b border-[#6200EE]" : ""
      )}
      onClick={onClick}
    >
      <Icon />
      <p className="text-natural-13 text-base ml-[10px]">{label}</p>
    </button>
  );
};
const COURT_DOCUMENTS_QUERY = `
  query(${PAGINATION_PARAMS}) {
    court_documents: my_court_documents(${PAGINATION_VARS}) {
      ${PAGINATION_FIELD}
      data {
        ${DEFAULT_FILE_QUERY}
        meta {
          category
        }
        parent {
          id
        }
        fileable {
          ... on CourtDocument {
            id
            title
            date
            tags {
              id
              name
            }
          }
        }
      }
    }
  }
`;
const EvidenceTimelinePage: NextPageWithLayout = () => {
  const [activities, setActivities] = useState<any>([]);
  const [evidence, setEvidence] = useState([{ name: "evidence" }]);
  const [hearings, setHearings] = useState([{ name: "hearing" }]);
  const [journals, setJournals] = useState<any>([{ name: "journal" }]);
  const [visitations, setVisitations] = useState<any>([{ name: "visitation" }]);
  const [todo, setTodo] = useState<any>([{ name: "todo" }]);
  const [courtDocuments, setCourtDocuments] = useState([
    { name: "court document" },
  ]);
  const [dashboardView, setDashboardView] = useState("");
  const [orientation, setOrientation] = React.useState<
    "horizontal" | "vertical"
  >("horizontal");
  const [timelineFilter, setTimelineFilter] = useState<any>({
    types: [],
    extension: [],
    eventType: "",
  });

  const { all_evidence } = useAllEvidenceQuery();
  const { all_calenders } = useAllCalenderQuery();
  const { all_voiceMemos } = useVoiceMemoQuery();
  const { all_visitations } = useAllVisitationsQuery();
  const { all_tasks } = useAllTasksQuery();

  const router = useRouter();

  const handleTimelineFilter = (key: string, payload: Record<string, any>) => {
    setTimelineFilter((prev: any) => ({
      ...prev,
      [key]: payload,
    }));
  };

  useEffect(() => {
    if (!!all_tasks?.length) {
      let copiedData = [...all_tasks];
      copiedData = copiedData
        .filter((item) => item.status === "open")
        .map((item) => {
          return {
            ...item,
            component: "ToDo",
            Id: item.id,
            Subject: item.name,
            Type: { __typename: item.__typename },
            StartTime: new Date(item.due_date),
            EndTime: new Date(
              $date(item.due_date).add(30, "minutes").format("YYYY-MM-DD HH:mm")
            ),
          };
        });
      !!copiedData?.length ? setTodo(copiedData) : setTodo([{}]);
    }
  }, [all_tasks]);

  useEffect(() => {
    if (
      !!all_calenders?.journals?.data.length &&
      !!all_voiceMemos?.my_transcripts?.length
    ) {
      let copiedJournals = [...all_calenders?.journals?.data];
      copiedJournals = all_calenders?.journals?.data?.map((item: any) => {
        return {
          ...item,
          component: "Journals",
          Id: item.id,
          Subject: item.title,
          Type: { __typename: item.__typename },
          StartTime: new Date(item.created_at),
          EndTime: new Date(
            $date(item.created_at).add(30, "minutes").format("YYYY-MM-DD HH:mm")
          ),
        };
      });
      let copiedVoiceMemos = [...all_voiceMemos?.my_transcripts];
      copiedVoiceMemos = all_voiceMemos?.my_transcripts?.map((item) => {
        return {
          ...item,
          component: "Voice_Memo",
          Id: item.voice.id,
          Subject: item.voice.name,
          Type: { __typename: item.voice.__typename },
          StartTime: new Date(item.voice.created_at),
          EndTime: new Date(
            $date(item.voice.created_at)
              .add(30, "minutes")
              .format("YYYY-MM-DD HH:mm")
          ),
        };
      });
      setJournals(copiedJournals.concat(copiedVoiceMemos));
    }
    if (
      !!all_calenders?.journals?.data.length &&
      !all_voiceMemos?.my_transcripts?.length
    ) {
      let copiedJournals = [...all_calenders?.journals?.data];
      copiedJournals = all_calenders?.journals?.data?.map((item: any) => {
        return {
          ...item,
          component: "Journals",
          Id: item.id,
          Subject: item.title,
          Type: { __typename: item.__typename },
          StartTime: new Date(item.created_at),
          EndTime: new Date(
            $date(item.created_at).add(30, "minutes").format("YYYY-MM-DD HH:mm")
          ),
        };
      });
      setJournals(copiedJournals);
    }
    if (
      !!all_voiceMemos?.my_transcripts?.length &&
      !all_calenders?.journals?.data.length
    ) {
      let copiedVoiceMemos = [...all_voiceMemos?.my_transcripts];
      copiedVoiceMemos = all_voiceMemos?.my_transcripts?.map((item) => {
        return {
          ...item,
          component: "Voice_Memo",
          Id: item.voice.id,
          Subject: item.voice.name,
          Type: { __typename: item.voice.__typename },
          StartTime: new Date(item.voice.created_at),
          EndTime: new Date(
            $date(item.voice.created_at)
              .add(30, "minutes")
              .format("YYYY-MM-DD HH:mm")
          ),
        };
      });
      setJournals(copiedVoiceMemos);
    }
  }, [all_calenders, all_voiceMemos?.my_transcripts]);

  useEffect(() => {
    if (!!all_calenders?.hearings?.data?.length) {
      let copiedData = [...all_calenders?.hearings?.data];
      copiedData = copiedData.map((item) => {
        return {
          ...item,
          component: "Hearings",
          isRichText: true,
          Id: item.id,
          Subject: item.title,
          Type: { __typename: item.__typename },
          StartTime: new Date(item.date),
          EndTime: new Date(
            $date(item.date).add(30, "minutes").format("YYYY-MM-DD HH:mm")
          ),
        };
      });
      setHearings(copiedData);
    }
  }, [all_calenders?.hearings]);

  useEffect(() => {
    if (!!all_visitations.length) {
      let copiedData = [...all_visitations];
      copiedData = copiedData.map((item) => {
        return {
          ...item,
          component: "Visitations",
          Id: item.visitation.id,
          Subject: item.visitation.title,
          Type: { __typename: item.visitation.__typename },
          StartTime: new Date(item.visitation.start_at),
          EndTime: new Date(
            $date(item.visitation.start_at)
              .add(30, "minutes")
              .format("YYYY-MM-DD HH:mm")
          ),
        };
      });
      setVisitations(copiedData);
    }
  }, [all_visitations]);

  useEffect(() => {
    const getTimelines = async () => {
      try {
        setActivities([]);
        const data = await $gql({
          query: MY_TIMELINE_QUERY,
          variables: {
            types: timelineFilter.types.map(
              (item: { value: any }) => item.value
            ),
            extension: timelineFilter.extension.length
              ? timelineFilter.extension[0].value
              : "",
            tags: timelineFilter.tags,
          },
        });
        let copiedData = [...data.activities.data];
        copiedData = copiedData.map((item) => {
          return {
            ...item,
            Id: item.id,
            Subject: item.description,
            Type: item.subject,
            StartTime: new Date(item.created_at),
            EndTime: new Date(
              $date(item.created_at)
                .add(30, "minutes")
                .format("YYYY-MM-DD HH:mm")
            ),
          };
        });
        setActivities(copiedData);
      } catch (error) {}
    };
    getTimelines();
  }, [timelineFilter]);

  useEffect(() => {
    if (!!all_evidence.length) {
      let copiedData = [...all_evidence];
      copiedData = copiedData.map((item) => {
        return {
          ...item,
          component: "Evidence",
          Id: item.id,
          Subject: item.title,
          Type: { __typename: item.__typename },
          StartTime: new Date(item.created_at),
          EndTime: new Date(
            $date(item.created_at).add(30, "minutes").format("YYYY-MM-DD HH:mm")
          ),
        };
      });
      setEvidence(copiedData);
    }
  }, [all_evidence]);

  useEffect(() => {
    const page = parsePage(router.query.page);
    const getCourtDocuments = async () => {
      try {
        const data = await $gql({
          query: COURT_DOCUMENTS_QUERY,
          variables: { page },
        });
        let copiedData = [...data.court_documents.data];
        copiedData = copiedData.map((item) => {
          return {
            ...item,
            component: "Court_Document",
            Id: item.id,
            Subject: item.name,
            Type: { __typename: item.type },
            StartTime: new Date(item.created_at),
            EndTime: new Date(
              $date(item.created_at)
                .add(30, "minutes")
                .format("YYYY-MM-DD HH:mm")
            ),
          };
        });
        setCourtDocuments(copiedData);
      } catch (error) {}
    };

    getCourtDocuments();
  }, [router.query.page]);

  const data = {
    evidence: evidence,
    caseProcedure: hearings,
    courtDocuments: courtDocuments,
    journals: journals,
    visitations: visitations,
    todo: todo,
  };

  const getDashboardData = () => {
    return data[dashboardView];
  };
  const handleDashboardView = (value: React.SetStateAction<string>) => {
    setDashboardView(value);
  };

  return (
    <div className="bg-white pb-16">
      <div className="mb-10">
        <div className="mx-auto max-w-6xl flex justify-between pt-4 items-center bg-white border-b border-[#DAD9E2]">
          <h3 className="text-2xl font-semibold leading-7 sm:truncate pb-3.5 text-natural-13">
            Timeline
          </h3>
          <div className="flex items-center">
            <DirectionButton
              Icon={VerticalIcon}
              label="Vertical"
              isActive={orientation == "vertical"}
              onClick={() => setOrientation("vertical")}
            />
            <DirectionButton
              Icon={HorizontalIcon}
              label="Horizontal"
              isActive={orientation == "horizontal"}
              onClick={() => setOrientation("horizontal")}
            />
          </div>
        </div>
        <TimelineFilter>
          <div>
            <Select defaultValue="default" onChangeValue={handleDashboardView}>
              <option disabled value="default">
                Dashboards
              </option>
              {CALENDAR_DASHBOARD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
            </Select>
          </div>
          <MultiSelectType
            keyBy="value"
            labelBy="name"
            className="w-[450px]"
            label="Category"
            options={CALENDAR_TYPE_OPTIONS}
            onValueChange={(value) => handleTimelineFilter("types", value)}
            value={timelineFilter.types}
          />
          <MultiSelectType
            keyBy="value"
            labelBy="name"
            className="w-[400px]"
            label="File Type"
            isSingleChoice={true}
            options={CALENDAR_EXTENSION_OPTIONS}
            onValueChange={(value) => handleTimelineFilter("extension", value)}
            value={timelineFilter.extension}
          />
        </TimelineFilter>
      </div>
      <div className="container mx-auto relative">
        <TimelineScheduler
          orientation={orientation}
          data={getDashboardData() ? getDashboardData() : activities}
        />
      </div>
    </div>
  );
};

export default withDashboardLayout(EvidenceTimelinePage, "Court - Timeline");
