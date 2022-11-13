export type LocateType = "SHOP" | "STORAGE" | "ETC";
export const LocateType: { [key in LocateType]: string } = Object.freeze({
  SHOP: "사무실",
  STORAGE: "매장",
  ETC: "기타",
});
export interface Locate {
  code?: string;
  alias: string;
  latitude?: number; // 위도
  longitude?: number; // 경도
  detailLocate?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  postalCode?: string;
  country: string;
  city?: string;
  county?: string;
  town?: string;
  locateType: LocateType;
}

export function locateStr(l: Locate) {
  return `도시: ${l.city}, 우편번호: ${l.postalCode}, 상세주소: ${
    l.detailLocate
  }, 받는분: ${l.firstName! + l.lastName}, 핸드폰번호: ${l.phone}`;
}
