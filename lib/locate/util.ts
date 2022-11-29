import {
  FirestoreDataConverter,
  DocumentSnapshot,
  DocumentData,
} from "@firebase/firestore";
import { commonToJson } from "../util";
import { Locate } from "./domain";

export function validLocate(p: Locate) {
  if (
    !(
      (p.postalCode && p.detailLocate) ||
      (p.latitude && p.longitude) ||
      (p.code && (p.city || p.county || p.town))
    )
  ) {
    console.error(p);
    throw Error(
      "위도,경도 혹은 우편코드,상세주소가 있어야 합니다. \n city county town 을 사용시 간이주소와 매핑 가능한 code 를 함께 입력 해주십시오."
    );
  }
}

export function locateFromJson(d: { [x: string]: any }): Locate {
  return {
    code: d.code,
    alias: d.alias,
    latitude: d.latitude,
    longitude: d.longitude,
    detailLocate: d.detailLocate,
    firstName: d.firstName,
    lastName: d.lastName,
    phone: d.phone,
    postalCode: d.postalCode,
    country: d.country,
    city: d.city,
    county: d.county,
    town: d.town,
    locateType: d.locateType,
  };
}

export const locateFireConverter: FirestoreDataConverter<Locate | null> = {
  toFirestore: (l: Locate) => {
    return commonToJson(l);
  },
  fromFirestore: (
    snapshot: DocumentSnapshot<DocumentData>,
    options: any
  ): Locate | null => {
    const data = snapshot.data(options);
    return data !== undefined ? locateFromJson(data) : null;
  },
};

export function locateDesc(l: Locate) {
  return `도시: ${l.city}, 우편번호: ${l.postalCode}, 상세주소: ${
    l.detailLocate
  }, 받는분: ${l.firstName! + l.lastName}, 핸드폰번호: ${l.phone}`;
}

export function locateToStr(l: Locate) {
  let str = " ";
  if (l.city) str += l.city + " ";
  if (l.county) str += l.county + " ";
  if (l.town) str += l.town + " ";
  if (l.alias) str += l.alias + " ";
  return str;
}
