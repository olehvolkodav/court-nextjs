/**
 * Todo
 * Disable previous date
 * disable selected date
 */

import React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/solid"
import { classNames } from "@/utils/classname";

import { $date } from "@/plugins/date";

interface Props {
  addons?: any[];
  value?: string | Date;
  onChange?: (value?: string) => any
}

interface DayList {
  date: string;
  dayOfMonth: any;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPreviousMonth?: boolean;
  isNextMonth?: boolean;
}

const WEEKDAYS = ["Monday", "Tueday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const Calendar: React.FC<Props> = ({addons, value, onChange}) => {
  const [ days, setDays ] = React.useState<DayList[]>([]);

  const [currentYear, setCurrentYear] = React.useState(() => {
    return parseInt($date(value || undefined).format("YYYY"));
  });

  const [currentMonth, setCurrentMonth] = React.useState(() => {
    return parseInt($date(value || undefined).format("M"));
  });


  const getNumberOfDaysInMonth = (year: number, month: number) => {
    return $date(`${year}-${month}-01`).daysInMonth();
  }

  const getWeekday = (date: any) => $date(date).weekday();

  const isToday = (date: any) => $date(date).isSame($date(), "day");

  const currentMonthText = React.useMemo(() => {
    return $date(String(currentMonth), "M").format("MMMM")
  }, [currentMonth]);

  const createDaysForCurrentMonth = React.useCallback((year, month) => {
    return [...Array(getNumberOfDaysInMonth(year, month))].map((day, index) => {
      const date = $date(`${year}-${month}-${index + 1}`).format("YYYY-MM-DD");
      return {
        date,
        dayOfMonth: index + 1,
        isCurrentMonth: true,
        isToday: isToday(date),
      }
    })
  }, [])

  const createDaysForPreviousMonth = React.useCallback((year: number, month: number) => {
    const currentMonthDays = createDaysForCurrentMonth(year, month);

    const firstDayOfTheMonthWeekday = getWeekday(currentMonthDays[0].date);

    const previousMonth = $date(`${year}-${month}-01`).subtract(1, "month");

    // Cover first day of the month being sunday (firstDayOfTheMonthWeekday === 0)
    const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday
      ? firstDayOfTheMonthWeekday - 1
      : 6;

    const previousMonthLastMondayDayOfMonth = $date(currentMonthDays[0].date)
      .subtract(visibleNumberOfDaysFromPreviousMonth, "day")
      .date();

    return [...Array(visibleNumberOfDaysFromPreviousMonth)].map((day, index) => {
      const date = $date(
        `${previousMonth.year()}-${previousMonth.month() + 1}-${
          previousMonthLastMondayDayOfMonth + index
        }`
      ).format("YYYY-MM-DD");

      return {
        date,
        dayOfMonth: previousMonthLastMondayDayOfMonth + index,
        isCurrentMonth: false,
        isToday: false,
        isPreviousMonth: true,
      };
    });
  }, [createDaysForCurrentMonth])

  const createDaysForNextMonth = React.useCallback((year: number, month: number) => {
    const currentMonthDays = createDaysForCurrentMonth(year, month);

    const lastDayOfTheMonthWeekday = getWeekday(
      `${year}-${month}-${currentMonthDays.length}`
    );

    const nextMonth = $date(`${year}-${month}-01`).add(1, "month");

    const visibleNumberOfDaysFromNextMonth = lastDayOfTheMonthWeekday
      ? 7 - lastDayOfTheMonthWeekday
      : lastDayOfTheMonthWeekday;

    return [...Array(visibleNumberOfDaysFromNextMonth)].map((day, index) => {
      const date = $date(
        `${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`
      ).format("YYYY-MM-DD");

      return {
        date,
        dayOfMonth: index + 1,
        isCurrentMonth: false,
        isToday: false,
        isNextMonth: true,
      };
    });
  }, [createDaysForCurrentMonth]);

  const subMonth = React.useCallback(() => {
    if (currentMonth == 1) {
      setCurrentMonth(12)
      setCurrentYear(prev => prev - 1)
    } else {
      setCurrentMonth(prev => prev -1)
    }
  }, [currentMonth]);

  const addMonth = React.useCallback(() => {
    if (currentMonth == 12) {
      setCurrentMonth(1);
      setCurrentYear(prev => prev + 1)
    } else {
      setCurrentMonth(prev => prev + 1)
    }
  }, [currentMonth]);

  const selectDay = (day: DayList) => () => {
    if (day.isPreviousMonth) {
      subMonth()
    }

    if (day.isNextMonth) {
      addMonth();
    }

    if (onChange) {
      onChange(value === day.date ? undefined : day.date)
    }
  }

  React.useEffect(() => {
    const currentMonthDays = createDaysForCurrentMonth(currentYear, currentMonth);
    const previousMonthDays = createDaysForPreviousMonth(currentYear, currentMonth);
    const nextMonthDays = createDaysForNextMonth(currentYear, currentMonth);

    setDays([...previousMonthDays, ...currentMonthDays, ...nextMonthDays]);
  }, [
    currentMonth,
    createDaysForCurrentMonth,
    createDaysForPreviousMonth,
    createDaysForNextMonth,
    currentYear
  ]);

  return (
    <div>
      <div className="flex justify-between items-center text-gray-900">
        <button
          type="button"
          className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          onClick={subMonth}
        >
          <span className="sr-only">Previous month</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="font-semibold">{currentMonthText}, {currentYear}</div>
        <button
          type="button"
          onClick={addMonth}
          className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Next month</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-6 grid grid-cols-7 text-xs text-center leading-6 text-gray-500">
        {WEEKDAYS.map(wd => (
          <div key={wd}>{wd.substring(0, 3)}</div>
        ))}
      </div>

      <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
        {days.map((day, dayIdx) => (
          <button
            key={day.date}
            type="button"
            onClick={selectDay(day)}
            className={classNames(
              "py-1.5 hover:bg-gray-100 focus:z-10",
              day.isCurrentMonth ? "bg-white" : "bg-gray-50",
              ((day.date == value) || day.isToday) && "font-semibold",
              (day.date == value) && "text-white",
              !(day.date == value) && day.isCurrentMonth && !day.isToday && "text-gray-900",
              !(day.date == value) && !day.isCurrentMonth && !day.isToday && "text-gray-400",
              day.isToday && !(day.date == value) && "text-indigo-600",
              dayIdx === 0 && "rounded-tl-lg",
              dayIdx === 6 && "rounded-tr-lg",
              dayIdx === days.length - 7 && "rounded-bl-lg",
              dayIdx === days.length - 1 && "rounded-br-lg"
            )}
          >
            <time
              dateTime={day.date}
              className={classNames(
                "mx-auto flex h-7 w-7 items-center justify-center rounded-full",
                (day.date == value) && day.isToday && "bg-indigo-600",
                (day.date == value) && !day.isToday && "bg-gray-900"
              )}
            >
              {day.date.split("-").pop()?.replace(/^0/, "")}
            </time>

            {/* <span className="text-xs text-gray-500">120</span> */}
          </button>
        ))}
      </div>
    </div>
  )
}
