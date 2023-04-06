import type { NextPageWithLayout } from "@/interfaces/page.type";
import React, { useEffect, useState, Fragment, useCallback } from "react";
import DocumentIcon from "@/components/icons/DocumentIcon";
import { DotsVerticalIcon, FilterIcon } from "@heroicons/react/outline";
import SortingIcon from "@/components/icons/SortingIcon";
import { classNames } from "@/utils/classname";
import { $gql } from "@/plugins/http";
import { $date } from "@/plugins/date";
import { withDashboardLayout } from "@/hoc/layout";
import { FileSlider } from "@/components/file/FileSlider";
import { $fileActions } from "@/store/file.store";
import { getFileSizeMB, isImage } from "@/utils/file";
import SortIcon from "@/components/icons/SortIcon";
import { Menu, Transition } from "@headlessui/react";
import ImageIcon from "@/components/icons/ImageIcon";
import PdfIcon from "@/components/icons/PdfIcon";
import MP3Icon from "@/components/icons/MP3Icon";
import MP4Icon from "@/components/icons/MP4Icon";
import DOCIcon from "@/components/icons/DOCIcon";
import { MY_TIMELINE_QUERY } from "@/graphql/query/timeline";
import { Badge } from "@/components/ui/Badge";
import { EvidenceWitnessActivity } from "@/components/activity/EvidenceWitnessActivity";
import { $collect } from "@/utils/collection";
import { $string } from "@/utils/string";
import { TimelineFilter } from "@/components/timeline/TimelineFilter";
import { TimelineFile } from "@/components/timeline/TimelineFile";

const FullPicturePage: NextPageWithLayout = () => {
  const [extension, setExtension] = useState<string>();
  const [selectedOption, setSelectedOption] = useState<any>([]);

  const [isAscending, setIsAscending] = useState<Boolean>(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [ext, setExt] = useState<string>("");
  const [activityId, setActivityId] = useState<string>("");

  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [tags, setTags] = useState<any[]>([]);

  const setFile = (file: any) => () => {
    $fileActions.setSlideFile(file);
  }

  const uniqueExts = (files: any[]) => {
    return $collect(
      files.map(file => $string(file.name).afterLast("."))
    ).unique((a: any, b: any) => a == b)
  }

  const getTitle = useCallback((activity: any) => {
    if (activity.subject?.__typename === "CourtCase") {
      return activity.subject?.caseName;
    }

    if (activity.subject?.__typename === "Evidence") {
      return activity.subject?.title;
    }

    if (activity.subject?.__typename === "File") {
      return activity.subject?.name;
    }

    return activity.description;
  }, []);

  useEffect(() => {
    const getTimelines = async () => {
      const _orderBy = isAscending == false ? "DESC" : "ASC";

      try {
        const data = await $gql({
          query: MY_TIMELINE_QUERY,
          variables: {
            orderBy: [{ column: "CREATED_AT", order: _orderBy }],
            types: selectedOption,
            extension,
            tags
          },
        });

        setActivities(data.activities.data);
      } catch (error) {}
    };

    getTimelines();
  }, [isAscending, selectedOption, extension, tags]);

  return (
    <>
      <div className="py-4">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold leading-7 text-gray-900 sm:truncate pb-3.5 my-1.5 text-[#0A0140]">
              Timeline
            </h3>

            <div className="flex items-center space-x-2">
              <div>
                <button
                  type="button"
                  onClick={() => setIsAscending(!isAscending)}
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs
                  font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2
                  focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <SortingIcon />
                  <span className="ml-1 text-sm text-[#290064]">Sort</span>
                </button>
              </div>

              <div>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setFilterOpen(true)}
                >
                  <FilterIcon className="h-5 w-5 -mx-px mr-2" />
                  Filter
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-lg">
            <div className="p-2.5">
              <ol className="relative border-l border-dashed border-indigo-600 ... border-[#DAD9E2]">
                {activities &&
                  activities.map((activity) => (
                    <li className="mb-10 ml-4" key={`activity-${activity.id}`}>
                      <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700" />
                      <div className="bg-white sm:rounded-lg relative border ">
                        <div className="px-4 py-5 sm:px-6">
                          <h3 className="text-lg leading-6 font-medium text-gray-900 text-[#0A0140]">
                            {getTitle(activity)}
                          </h3>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <dt className="text-sm font-medium text-gray-500">
                                Type
                              </dt>
                            </div>

                            <div className="sm:col-span-2">
                              <Badge>
                                {activity.subject.__typename.replace("Court", "")}
                              </Badge>
                            </div>

                            <div>
                              <dt className="text-sm font-medium text-gray-500">
                                Date
                              </dt>
                            </div>

                            <div className="sm:col-span-2">
                              <Badge>
                                {$date(activity.created_at).format("MMMM D, YYYY")}
                              </Badge>
                            </div>

                            {activity.subject.__typename === "Evidence" && (
                              <>
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">
                                    Date Occured
                                  </dt>
                                </div>

                                <div className="sm:col-span-2">
                                  <Badge>
                                    {$date(activity.subject.date_occurred).format("MMMM D, YYYY")}
                                  </Badge>
                                </div>
                              </>
                            )}

                            <div>
                              <dt className="text-sm font-medium text-gray-500">
                                Description
                              </dt>
                            </div>

                            <div className="sm:col-span-2">
                              <dd className="mt-1 text-sm text-gray-900">
                                {activity.description}
                              </dd>
                            </div>

                            {activity.subject?.__typename == "Evidence" && (
                              <EvidenceWitnessActivity activity={activity} />
                            )}

                            {activity.subject?.prove_explanation && (
                              <>
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">
                                    Points to Prove
                                  </dt>
                                </div>

                                <div className="sm:col-span-2">
                                  <dd
                                    className="mt-1 text-sm text-gray-900"
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        activity.subject?.prove_explanation,
                                    }}
                                  />
                                </div>
                              </>
                            )}

                            {activity.subject?.__typename == "File" && (
                              <>
                                <div>
                                  <div className="flex justify-between">
                                    <dt className="text-sm font-medium text-gray-500">
                                      Attachments
                                    </dt>
                                  </div>
                                  <dd className="mt-1 text-sm text-gray-900">
                                    <ul role="list">
                                      <li
                                        onClick={setFile(activity.subject)}
                                        className="pl-3 pr-4 py-3 rounded-md my-2 flex items-center justify-between text-sm cursor-pointer bg-[#F5F5F7]"
                                      >
                                        <div className="w-0 flex-1 flex items-center">
                                          <div className="h-6 w-6">
                                            <DocumentIcon />
                                          </div>
                                          <span className="ml-2 flex-1 w-0 truncate">
                                            {activity.subject?.name} <br />
                                            {getFileSizeMB(
                                              activity.subject?.size
                                            )}{" "}
                                            MB
                                          </span>
                                        </div>
                                        <div className="ml-4 flex-shrink-0">
                                          <div>
                                            <DotsVerticalIcon
                                              className="h-5 w-5 text-gray-400"
                                              aria-hidden="true"
                                            />
                                          </div>
                                        </div>
                                      </li>
                                    </ul>
                                  </dd>
                                </div>
                              </>
                            )}

                            {activity.subject?.__typename == "Evidence" && (
                              <>
                                <div className="sm:col-span-3">
                                  <div className="flex justify-between">
                                    <dt className="text-sm font-medium text-gray-500">
                                      Attachments
                                    </dt>
                                    {activity.subject?.files?.length > 0 && (
                                      <>
                                        <Menu
                                          as="div"
                                          className="relative inline-block text-left"
                                        >
                                          <div>
                                            <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                                              <SortIcon />
                                            </Menu.Button>
                                          </div>

                                          <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                          >
                                            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                              <div className="py-1">
                                                <span className="text-xs px-4">
                                                  Filter by file Type
                                                </span>
                                                {uniqueExts(
                                                  activity.subject?.files
                                                ).map((singleFile, key) => (
                                                  <Menu.Item key={key}>
                                                    {({ active }) => (
                                                      <div
                                                        className="flex align-item-center block px-4 py-2 items-center gap-3"
                                                        onClick={(
                                                          event: React.MouseEvent<HTMLElement>
                                                        ) => {
                                                          setActivityId(
                                                            activity.id
                                                          );
                                                          setExt(singleFile);
                                                        }}
                                                      >
                                                        {isImage(singleFile) && (
                                                          <ImageIcon />
                                                        )}
                                                        {singleFile == "pdf" && (
                                                          <PdfIcon />
                                                        )}
                                                        {singleFile == "mp3" && (
                                                          <MP3Icon />
                                                        )}
                                                        {singleFile == "mp4" && (
                                                          <MP4Icon />
                                                        )}
                                                        {(singleFile == "doc" ||
                                                          singleFile ==
                                                          "docx") && (
                                                            <DOCIcon />
                                                          )}
                                                        <a
                                                          href="#"
                                                          className={classNames(
                                                            active
                                                              ? "bg-gray-100 text-gray-900"
                                                              : "text-gray-700",
                                                            "text-sm uppercase"
                                                          )}
                                                        >
                                                          {singleFile}
                                                        </a>
                                                      </div>
                                                    )}
                                                  </Menu.Item>
                                                ))}
                                              </div>
                                            </Menu.Items>
                                          </Transition>
                                        </Menu>
                                      </>
                                    )}
                                  </div>
                                  <dd className="mt-1 text-sm text-gray-900">
                                    <ul role="list">
                                      {activity.subject?.files.map(
                                        (singleFile: any, key: any) =>
                                          activityId && activityId == activity.id
                                            ? ext &&
                                              ext ==
                                              $string(singleFile?.name).afterLast(".")
                                              ? <TimelineFile key={key} file={singleFile} />
                                              : !ext &&
                                              <TimelineFile key={key} file={singleFile} />
                                            : <TimelineFile key={key} file={singleFile} />
                                      )}
                                      {activity.subject?.witnesses.map(
                                        (witness: any) =>
                                          witness?.files?.map(
                                            (singleFile: any, key: any) => (
                                              <li
                                                onClick={setFile(singleFile)}
                                                className="pl-3 pr-4 py-3 rounded-md my-2 flex items-center justify-between text-sm cursor-pointer bg-[#F5F5F7]"
                                                key={key}
                                              >
                                                <div className="w-0 flex-1 flex items-center">
                                                  <div className="h-6 w-6">
                                                    <DocumentIcon />
                                                  </div>
                                                  <span className="ml-2 flex-1 w-0 truncate">
                                                    {singleFile?.name}
                                                    <br />
                                                    {getFileSizeMB(
                                                      singleFile?.size
                                                    )}{" "}
                                                    MB
                                                  </span>
                                                </div>
                                                <div className="ml-4 flex-shrink-0">
                                                  <div>
                                                    <DotsVerticalIcon
                                                      className="h-5 w-5 text-gray-400"
                                                      aria-hidden="true"
                                                    />
                                                  </div>
                                                </div>
                                              </li>
                                            )
                                          )
                                      )}
                                    </ul>
                                  </dd>
                                </div>
                              </>
                            )}
                          </dl>
                        </div>
                      </div>
                    </li>
                  ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      <FileSlider allowDelete={false} />
    </>
  );
};

export default withDashboardLayout(FullPicturePage, "Court - Timeline");
