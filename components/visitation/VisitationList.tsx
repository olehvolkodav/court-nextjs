import { $date } from "@/plugins/date";
import { $http } from "@/plugins/http";
import { $fileActions } from "@/store/file.store";
import { classNames } from "@/utils/classname";
import {
  CheckIcon,
  DocumentTextIcon,
  PencilIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useMemo, useState } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/button";

interface Props {
  schedule: any;
  isInsideModal?: boolean;
  onButtonClick?: (schedule: any, apiUpdated?: boolean) => any;
  onEditClick?: (schedule: any) => any;
}

export const VisitationList: React.FC<Props> = ({
  schedule,
  onButtonClick,
  onEditClick,
  isInsideModal,
}) => {
  const [loading, setLoading] = useState(false);

  const submitAttended = async () => {
    setLoading(true);

    try {
      const { data } = await $http.patch(
        `/visitation-schedules/${schedule.id}`,
        {
          attended: true,
        }
      );

      if (onButtonClick) {
        onButtonClick(data, true);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const submitNotAttended = () => {
    if (onButtonClick) {
      onButtonClick(schedule);
    }
  };

  const setFile = (file: any) => () => $fileActions.setSlideFile(file);

  const handleEditClick = () => {
    if (isTodayOrGreater && schedule?.status === "pending") {
      return onEditClick && onEditClick(schedule);
    }
  };

  const isTodayOrGreater = useMemo(() => {
    return $date(schedule?.date).isAfter(new Date());
  }, [schedule?.date]);

  return (
    <div
      className={`${
        !isInsideModal ?? "bg-white shadow-sm rounded-lg px-4 lg:px-6"
      } py-6 `}
    >
      <div
        className={`${
          isInsideModal
            ? "flex-col space-y-5"
            : "flex-row justify-between items-center "
        } flex `}
      >
        <div className="flex flex-col">
          <div className="flex items-center mb-2">
            <h3
              className={classNames(
                "text-lg font-medium leading-6 text-gray-700",
                isTodayOrGreater &&
                  schedule.status === "pending" &&
                  "cursor-pointer"
              )}
              onClick={handleEditClick}
            >
              {schedule?.visitation?.title}
            </h3>

            {isTodayOrGreater && schedule.status === "pending" && (
              <button
                type="button"
                className="h-6 w-6 text-gray-600 ml-2"
                onClick={handleEditClick}
              >
                <PencilIcon />
              </button>
            )}
          </div>

          <span className="text-natural-13 font-medium text-xl">
            {$date(schedule.date).format("MMM DD, YYYY")}{" "}
            {$date(schedule.time, "HH:mm").format("h:mm A")}
          </span>
        </div>

        {schedule.status === "pending" ? (
          <div className="flex items-center space-x-2">
            <Button color="default" onClick={submitNotAttended}>
              <XIcon className="mr-2 h-5 w-5" />
              Not Attended
            </Button>

            <Button isLoading={loading} onClick={submitAttended}>
              <CheckIcon className="mr-2 h-5 w-5" />
              Attended
            </Button>
          </div>
        ) : (
          <Badge
            className="capitalize"
            color={schedule.status === "not_attended" ? "red" : "primary"}
          >
            {schedule.status.replace("_", " ")}
          </Badge>
        )}
      </div>

      {!!schedule.files.length && (
        <div className="mt-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="block text-sm font-medium text-gray-700 mb-2">
              Attachments
            </span>
          </div>

          <nav role="list" className="space-y-2 flex flex-col overflow-hidden">
            {schedule.files.map((file: any) => (
              <button
                type="button"
                onClick={setFile(file)}
                className="border border-natural-3 rounded-md relative inline-flex pl-3 pr-4 py-3 flex items-center justify-between text-left text-sm bg-natural-3"
                key={file.id}
              >
                <DocumentTextIcon className="h-6 w-6 text-natural-13" />

                <div className="flex-1 ml-2">
                  <span className="block truncate text-natural-13">
                    {file.name}
                  </span>
                  <span className="text-gray-600">
                    Added {$date(file.created_at).format("DD MMM hh:mm A")}
                  </span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};
