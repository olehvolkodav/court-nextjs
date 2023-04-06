import React, { useCallback, useEffect, useMemo, useRef } from "react";
import FullCalendar, { EventContentArg } from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { classNames } from "@/utils/classname";

interface ICalendarTimeGrid {
  selectedDate: Date;
  activities: Array<any>;
  onEventClick?: (event: any) => any
}

const CalendarTimeGrid: React.FC<ICalendarTimeGrid> = ({ selectedDate, activities, onEventClick }) => {
  const handleEventClick = (event: any) => () => {
    if (onEventClick) {
      onEventClick(event);
    }
  }

  const renderEventContent = (event: EventContentArg) => {
    const timeText = ("0" + event?.timeText).slice(-5) || "";

    let bgColor = "bg-[#1EB8FE]";

    switch (event.event.extendedProps.__typename) {
      case "Journal":
        bgColor = "bg-blue-500"
        break;
      case "Transcript":
        bgColor = "bg-orange-500"
        break;
      case "CourtEvent":
        bgColor = "bg-green-500"
        break;
      default:
        bgColor = "bg-[#1EB8FE]";
        break;
    }

    return (
      <div className={classNames(
        "py-2 px-2.5 rounded w-48 cursor-pointer",
        bgColor
      )}
        onClick={handleEventClick(event.event.extendedProps)}
      >
        <p className="text-xs text-white">
          {timeText}
        </p>
        <p className="text-xs text-white text-ellipsis">
          {event?.event?._def?.title || ""}
        </p>
      </div>
    )
  }

  const calendarRef = useRef<FullCalendar>(null);

  const events = useMemo(() => {
    return activities.map(activity => ({
      ...activity,
      id: `${activity.__typename}-${activity.id}`,
      date: activity.date,
      activity,
    }))
  }, [activities]);

  return (
    <FullCalendar
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView='timeGridDay'
      initialDate={selectedDate}
      headerToolbar={false}
      dayHeaders={false}
      allDaySlot={false}
      slotMinTime={"07:00:00"}
      slotMaxTime={"22:00:00"}
      slotDuration={"01:00:00"}
      slotEventOverlap={false}
      height={960}
      eventContent={renderEventContent}
      events={events}
      ref={calendarRef}
    />
  )
}

export default CalendarTimeGrid;
