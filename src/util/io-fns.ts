// function enumFromStrs<T extends { [key: any]: string }>(
//   s: string[],
//   obj: T
// ): T[] {
//   s.map((str) => {
//     Object.keys(obj).forEach((k) => {
//       if (obj[k] === str) {
//         return k;
//       }
//     });
//   });
//   Object.keys(obj).map((k) => s.includes(obj[k]));
// }

import { dateToJson } from "./date";

export const uniqueArr = <T>(arr: T[]): T[] => [...new Set(arr)];
export function uniqueFilter<T>(arr: T[]): T[] {
  // used when There are many Duplicate values
  return arr.filter((x, idx) => arr.indexOf(x) === idx);
}
export function range(start: number, end: number) {
  return Array.from(Array(end - start).keys()).map((x) => x + 1);
}
export function choice<T>(choices: T[]): T {
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

export function commonToJson(c: any) {
  const dateKeys: string[] = [];
  Object.entries(c).forEach(([k, v]) => {
    if (Object.prototype.toString.call(v) === "[object Date]") {
      dateKeys.push(k);
    }
  });
  const j = JSON.parse(JSON.stringify(c));
  dateKeys.forEach((dk) => {
    j[dk] = dateToJson(j[dk]);
  });
  return j;
}
