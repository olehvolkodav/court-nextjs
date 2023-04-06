import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import calendar from "dayjs/plugin/calendar";
import tz from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import customFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(utc);
dayjs.extend(weekday);
dayjs.extend(calendar);
dayjs.extend(tz);
dayjs.extend(relativeTime);
dayjs.extend(customFormat)

export const $date = dayjs;
