import React, { useState, useEffect, useRef, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "@heroicons/react/outline";
import { MinusIcon, PlusIcon } from "@heroicons/react/solid";
import { Gantt, Task } from "gantt-task-react";
import { debounce } from "@/utils/debounce";

import { Calendar_View_Direction } from "@/constants/calendar";
import "gantt-task-react/dist/index.css";

interface ICalendarView {
  activities: any[];
  direction: string;
  mode: any;
}

const getCurrentWeek = () => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  var days = Math.floor((currentDate.getTime() - startDate.getTime()) /
      (24 * 60 * 60 * 1000));

  return Math.ceil(days / 7);
}

export const CalendarView: React.FC<ICalendarView> = ({
  activities,
  direction,
  mode
}) => {
  const calendarRef = useRef<any>(null);
  const [selectedYearMonth, setSelectedYearMonth] = useState<any>({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    week: getCurrentWeek()
  });
  const [scale, setScale] = useState<number>(100);
  const [search, setSearch] = useState<string>("");

  const handleChangeInput = (e: any) => {
    const value = e.target.value;
    setSearch(value);
    onSearch(value);
  }

  const onSearch = debounce(function(value: string) {

  });

  const handleChangeScale = (interval) => {
    const min = 10;
    const max = 300;
    const changedValue = scale + interval;
    if(changedValue < min || changedValue > max) return;
    setScale(changedValue);
  }

  useEffect(() => {
    if(!calendarRef.current) return;

    const view =
      mode === "Month"
        ? "dayGridMonth"
        : "dayGridWeek";

    calendarRef.current
      .getApi()
      .changeView(
        view,
        mode === "Month"
          ? new Date(selectedYearMonth.year, selectedYearMonth.month)
          : new Date(selectedYearMonth.year, 0, selectedYearMonth.week * 7)
      );
  }, [mode, selectedYearMonth]);

  const columnWidth = useMemo(() => {
    let columnWidth = 60;
    if (mode === "Year") {
      columnWidth = 400;
    } else if (mode === "Month") {
      columnWidth = 300;
    } else if (mode === "Week") {
      columnWidth = 250;
    }
    return columnWidth;
  }, [mode]);

  const getBgColor = (type: string, isHex: boolean = false) => {
    let bgColor = isHex ? "#a855f7" : "bg-purple-500";
    if(type === "Evidence")
      bgColor = isHex? "#00AA84" : "bg-natural-evidence";
    else if (type === "CourtDocument")
      bgColor = isHex ? "#0089FF" : "bg-natural-document";
    else if (type === "Witness")
      bgColor = isHex ? "#FF7444" : "bg-natural-witness";
    return bgColor;
  }

  const events = useMemo(() => {
    const passedDates: string[] = [];
    const filters = activities.filter(item => {
      const createdDate = new Date(item.created_at);
      const date: string = item.created_at.split(" ")[0];
      if(passedDates.includes(date))
        return false;
      else
        passedDates.push(date);

      return createdDate.getMonth() === selectedYearMonth.month && createdDate.getFullYear() === selectedYearMonth.year && item.subject.__typename === "evidence"
    });
    return filters.map(item => ({
      ...item,
      date: new Date(item.created_at)
    }))
  }, [activities, selectedYearMonth]);

  const tasks: Task[] = useMemo(() => {
    if(activities?.length)
      return activities.map(item => ({
        start: new Date(item.created_at),
        end: new Date(item.created_at),
        name: item.description,
        id: item.id,
        type: "task",
        progress: 100,
        isDisabled: true,
        styles: { progressColor: "#00AA84" }
      }))
    return [];
  }, [activities]);

  const renderEventContent = (event: any) => {
    const id = `event_${event.event._instance.instanceId}`;

    const type = event.event?._def?.extendedProps?.subject?.__typename;
    const bgColor = getBgColor(type);

    return (
      <div className={`rounded-lg ml-4 py-4 pl-5 pr-12 ${bgColor}`} id={id}>
        <p className="text-white text-xl font-medium leading-9">
          {event.event?._def?.extendedProps?.description}
        </p>
      </div>
    )
  }

  const dayHeaderContent = (args: any) => {
    const day = args.text.split(" ")[0];
    let splits = args.text.split(" ");
    let date = "";
    if(splits.length > 1) {
      splits = splits[1].split("/");
      if(splits.length > 1) {
        date = ("0" + splits[1]).slice(-2);
      }
    }

    return (
      <div>
        <p className="text-base font-normal leading-6 text-[#918DA9]">{day}</p>
        <p className="text-base font-medium leading-6 text-black">{date}</p>
      </div>
    )
  }

  const handleChangeWeek = (value: number) => {
    setSelectedYearMonth(prev => ({
      ...prev,
      week: prev.week + value
    }))
  }

  return (
    <div className="bg-white">
      <div className="container bg-white mx-auto max-w-6xl mb-4">
        <div className="pl-6 py-6 flex justify-between items-center border border-[#DAD9E2] rounded-t-md">
          <div className="relative flex items-center pr-4 w-[20vw]">
            <input
              type="text"
              className="border border-[#C2C0CF] rounded-md py-2 pl-2 pr-6 text-base text-gray-600 placeholder-natural-7 w-full sm:text-sm"
              placeholder="Search here..."
              value={search}
              onChange={handleChangeInput}
            />
            <SearchIcon className="absolute top-[20%] right-6 pointer-events-none flex-none text-gray-400 h-5 w-5" />
          </div>
          <div className="flex items-center justify-between border border-[#C2C0CF] rounded-md p-[6px] mr-6 w-[105px]">
            <MinusIcon
              className="w-4 h-4 text-natural-7 cursor-pointer"
              onClick={() => handleChangeScale(-10)}
            />
            <p className="text-natural-13 text-base mx-2">
              {`${scale}%`}
            </p>
            <PlusIcon
              className="w-4 h-4 text-natural-7 cursor-pointer"
              onClick={() => handleChangeScale(10)}
            />
          </div>
        </div>
        <div className={`${direction === Calendar_View_Direction.vertical ? "" : "hidden"}`}>
          <FullCalendar
            locale="en"
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            dayHeaderContent={dayHeaderContent}
            selectable={true}
            headerToolbar={false}
            weekends={true}
            slotEventOverlap={false}
            firstDay={1}
            contentHeight={655}
            eventContent={renderEventContent}
            expandRows={true}
            ref={calendarRef}
          /> :
        </div>
        <div className={`${direction === Calendar_View_Direction.horizontal ? "" : "hidden"}`}>
          {
            !!tasks?.length &&
            <Gantt
              tasks={tasks}
              viewMode={mode}
              columnWidth={columnWidth}
              ganttHeight={300}
              TooltipContent={() => <></>}
              TaskListHeader={
                () => <></>
              }
              TaskListTable={
                () => <></>
              }
            />
          }
        </div>
        <div className={`${(mode !== "Week" || direction === Calendar_View_Direction.horizontal) ? "invisible" : ""}`}>
          <button
            type="button"
            className="flex items-center absolute bottom-20 right-28 z-10 rounded-3xl bg-white px-5 py-2.5 text-sm text-[#6200EE] hover:cursor-pointer"
            onClick={() => handleChangeWeek(1)}
          >
             <div className='hidden sm:block'>Next</div>
            <ChevronRightIcon className="w-3 h-3 ml-2 text-[#6200EE] sm:ml-7" />
          </button>
          <button
            type="button"
            className="flex items-center absolute bottom-20 left-28 z-10 rounded-3xl bg-white px-5 py-2.5 text-sm text-[#6200EE] hover:cursor-pointer"
            onClick={() => handleChangeWeek(-1)}
          >
            <ChevronLeftIcon className="w-3 h-3 mr-2 text-[#6200EE] sm:mr-7" />
            <div className='hidden sm:block'>Back</div>
          </button>
        </div>
      </div>
    </div>
  )
}
