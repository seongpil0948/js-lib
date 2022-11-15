import { Timestamp } from "@firebase/firestore";
import { format, subDays, parseISO } from "date-fns";
import { ko } from "date-fns/locale";

type TIME_FORMATS = "DAY" | "MIN";
const TIME_FORMATS = Object.freeze({
  DAY: "yyyy-MM-dd",
  MIN: "yyyy-MM-dd HH:mm",
});
Date.prototype.toJSON = function () {
  return this.toISOString();
};

export const formatDate = (t: Date, f: TIME_FORMATS = "DAY") =>
  format(t, TIME_FORMATS[f], { locale: ko });
export const getCurrDate = (f: TIME_FORMATS = "DAY") =>
  formatDate(new Date(), f);
export const timeToDate = (t: any, f: TIME_FORMATS = "DAY") =>
  formatDate(new Date(t), f);

export function dateToJson(data: string | Date | undefined): string {
  if (!data) return getCurrDate();
  else if (typeof data === "string") {
    return data;
  } else if (data instanceof Date) {
    return data.toJSON();
  } else {
    throw new Error("not Matched condition in dateToJson of commonField  ");
  }
}

export function dateToTimeStamp(d: Date | undefined): Timestamp {
  if (!d) {
    d = new Date();
  } else if (!(d instanceof Date)) {
    d = new Date(d);
  }
  return Timestamp.fromDate(d);
}
export function loadDate(
  d: Date | { [x: string]: number } | string | undefined
): Date {
  if (!d) return new Date();
  else if (d instanceof Date) return d;
  else if (typeof d === "string") return parseISO(d);
  // else if (d.seconds && d.constructor.name === "ut")
  // return new Date(d.seconds * 1000 + 60 * 60 * 9);
  // else if (d.seconds) return new Date(d.seconds * 1000);
  else if (d.seconds && d.constructor.name === "ut")
    return new Timestamp(d.seconds + 60 * 60 * 15, d.nanoseconds).toDate();
  else if (d.seconds) return new Timestamp(d.seconds, d.nanoseconds).toDate();
  else throw Error("Fail to load Date");
}
