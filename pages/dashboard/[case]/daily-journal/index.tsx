import React, { useState, useMemo } from "react"
import { ClockIcon } from "@heroicons/react/outline"
import { $gql } from "@/plugins/http";
import ReactCalendar from "react-calendar";
import { $date } from "@/plugins/date";
import { Button } from "@/components/ui/button";
import { RecordingModal } from "@/components/RecordingModal";
import { withDashboardLayout } from "@/hoc/layout";
import { NextPageWithLayout } from "@/interfaces/page.type";
import { AddDailyJournalModal } from "@/components/daily-journal/AddDailyJournalModal";
import { AddJournalModal } from "@/components/daily-journal/AddJournalModal";
import CalendarTimeGrid from "@/components/daily-journal/CalendarTimeGrid";
import { JournalDetailModal } from "@/components/daily-journal/JournalDetailModal";

const CALENDAR_QUERY = `
  query($date: String) {
    journals(date: $date, orderBy: { column: CREATED_AT, order: ASC }) {
      data {
        __typename
        id
        title
        description
        date: full_date
        created_at
      }
    }
    tasks: my_tasks(date: $date, first: 30) {
      data {
        __typename
        id
        title: name
        category
        description
        priority
        date: full_date
        time
      }
    }
    events: my_events(date: $date) {
      data {
        __typename
        id
        title: name
        description: notes
        date: full_date
      }
    }
    hearings(date: $date, first: 30) {
      data {
        __typename
        id
        title: name
        description
        date: full_date
      }
    }
  }
`

const DailyJournalPage: NextPageWithLayout = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [openRecordModal, setOpenRecordModal] = useState(false);
  const [openJournalModal, setOpenJournalModal] = useState(false);
  const [, setDuration] = useState(false);

  const [activities, setActivities] = useState<any[]>([]);

  /** Experimental */
  const [reloadCount, setReloadCount] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<any>();
  const timelinLabels:Array<String> = useMemo(() => {
    const labels:Array<String> = [];
    for(let i = 7; i <= 22; i++) {
      const half = i < 12 ? "AM" : "PM";
      const label = `0${i <= 12 ? i : i - 12}:00 ${half}`;
      labels.push(label.slice(-8));
    }
    return labels;
  }, []);

  const handleJournalModal = (val: boolean) => {
    setOpen(false);
    setOpenJournalModal(val);
  };

  const handleRecordModal = (val: boolean) => {
    setOpen(false);
    setOpenRecordModal(val);
  }

  const handleSavedJournal = () => setReloadCount(prev => prev + 1);

  const openEventDetail = (event: any) => {
    setSelectedJournal(event?.activity);
    setDetailOpen(true);
  }

  React.useEffect(() => {
    const getActivities = async () => {
      try {
        const data = await $gql({
          query: CALENDAR_QUERY,
          variables: {
            date: $date(selectedDate).format("YYYY-MM-DD")
          }
        });

        setActivities(
          [...data.journals.data, ...data.tasks.data, ...data.events.data, ...data.hearings.data]
        );
      } catch (error) {
      }
    }

    getActivities();
  }, [selectedDate, reloadCount]);

  return (
    <>
      <div className="py-4">
        <div className="flex justify-between px-4 py-2 mb-4">
          <h2 className="text-2xl font-medium text-natural-13 px-4">Daily Journal</h2>

          <Button onClick={() => setOpen(true)} className="min-w-[80px]">
            Add +
          </Button>
        </div>

        <div className="flex gap-3 flex-col lg:flex-row">
          <aside className="rounded-lg lg:order-first md:pl-5">
            <div className="relative block w-96 shadow-sm bg-white rounded-lg m-auto">
              <div className="p-6 h-full">
                <div>
                  <ReactCalendar value={selectedDate} onChange={setSelectedDate} />

                  <h3 className="show-selected-date  mt-5 md:mt-5">
                    {$date(selectedDate).format("dddd, DD MMMM YYYY")}
                  </h3>

                  <ol className="mt-4 space-y-1 text-sm leading-6 meeting-list">
                    {activities.map((activity) => (
                      <li
                        key={`${activity.__typename}-${activity.id}`}
                        className="group flex items-center space-x-4 rounded-xl py-4 px-4 blue-dot"
                      >
                        <div className="flex-auto">
                          <h4 className="text-gray-900 capitalize">{activity.title}</h4>

                          <p className="mt-0.5">
                            <ClockIcon className="mr-2" />

                            <time dateTime={activity.date}>
                              {$date(activity.date).format("h:mm A")}
                            </time>
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1 flex">
            <section aria-labelledby="primary-heading" className="min-w-0 flex-1 h-full flex flex-col lg:order-last">
              <div className="bg-white rounded-lg shadow-lg">
                <div className="flex justify-between px-5 py-10">
                  <h3 className="text-xl font-medium text-natural-13">
                    {$date(selectedDate).format("dddd, DD MMMM YYYY")}
                  </h3>
                </div>

                <div className="h-full">
                  <div className="mx-12 pb-6 h-full left-side-padding">
                    <div className="block rounded h-full w-full relative">
                      <div className="absolute top-[-5px] left-[-64px]">
                        {
                          timelinLabels.map((label, index) => (
                            <p
                              key={index}
                              className="text-xs font-semibold text-[#7A86A1] mb-12"
                            >
                              {label}
                            </p>
                          ))
                        }
                      </div>
                      <div className="flex flex-auto">
                        <div className="calendar-time-grid grid flex-auto grid-cols-1 grid-rows-1">
                          <CalendarTimeGrid
                            selectedDate={selectedDate}
                            activities={activities}
                            onEventClick={openEventDetail}
                          />
                        </div>
                      </div>

                      <ul role="list" className="mt-3 list-grid-custom">
                        <li className="col-span-1 flex rounded-md blue-dot">
                          <div className="flex items-center justify-between rounded-r-md">
                            <div className="px-4 py-2 text-sm">
                              Journal
                            </div>
                          </div>
                        </li>
                        <li className="rounded-md green-dot">
                          <div className="flex items-center justify-between rounded-r-md">
                            <div className="px-4 py-2 text-sm">
                              Event
                            </div>
                          </div>
                        </li>
                        <li className="col-span-1 flex rounded-md yellow-dot">
                          <div className="flex items-center justify-between rounded-r-md">
                            <div className="px-4 py-2 text-sm">
                              Voice Memo
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      <RecordingModal
        isOpen={openRecordModal}
        onClose={setOpenRecordModal}
        onDurationChange={setDuration}
      />

      <AddDailyJournalModal
        isOpen={openJournalModal}
        onClose={setOpenJournalModal}
        onSaved={handleSavedJournal}
      />

      <AddJournalModal
        isOpen={open}
        onClose={setOpen}
        setJournalModal={handleJournalModal}
        setRecordModal={handleRecordModal}
      />

      <JournalDetailModal
        journal={selectedJournal}
        isOpen={detailOpen}
        onClose={setDetailOpen}
      />
    </>
  )
}

export default withDashboardLayout(DailyJournalPage, "Court - Daily Journal");
