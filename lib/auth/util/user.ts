import { UserCredential } from "@firebase/auth";
import { getMessaging, getToken } from "@firebase/messaging";
import {
  DocumentData,
  DocumentSnapshot,
  FirestoreDataConverter,
} from "@firebase/firestore";
import { commonFromJson, commonToJson } from "../../util";
import {
  IoUser,
  IoUserInfo,
  UncleInfo,
  USER_PROVIDER,
  USER_ROLE,
} from "../domain";
import { IoFireApp } from "../../firebase";

export const getUserLocate = (u: IoUser) => {
  if (!u.companyInfo || u.companyInfo.locations.length < 1) return null;
  return u.companyInfo.shipLocate ?? u.companyInfo.locations[0];
};

export function isMe(me: IoUser, other: IoUser) {
  return me.userInfo.userId === other.userInfo.userId;
}

export function inWork(u: IoUser) {
  return u.workState != null && u.workState == "active";
}

export function getUserName(u: IoUser) {
  return u.userInfo.displayName ?? u.userInfo.userName;
}
export function showId(u: IoUser) {
  return u.userInfo.email?.split("@")[0] ?? getUserName(u);
}
export function availUncleAdvertise(u: IoUser) {
  const i = u.uncleInfo;
  return (
    i &&
    i.pickupLocates.length > 0 &&
    i.shipLocates.length > 0 &&
    Object.keys(i.amountBySize).length > 0 &&
    Object.keys(i.amountByWeight).length > 0
  );
}

export async function getFcmToken() {
  const messaging = getMessaging(IoFireApp.getInst().app);
  return getToken(messaging, {
    vapidKey:
      "BDATZH9Zt9gMTBQqOUpt2VMWb7wX2V8t0PeyO_UVCUf46kNkJ_smqT2nx31StrXKHVD_BRq5Bqhr2wsCCXQhLPw",
  })
    .then((token) => {
      return token ? { createdAt: new Date(), token } : null;
    })
    .catch((err) => {
      if (err.code === "messaging/permission-blocked") return null;
      const msg =
        "An error occurred while retrieving msg token. " +
        (err instanceof Error ? err.message : JSON.stringify(err));
      return null;
    });
}

export function userFromJson(data: { [x: string]: any }): IoUser | null {
  if (
    data.userInfo &&
    (data.userInfo.role as USER_ROLE) === "UNCLE" &&
    !data.uncleInfo
  ) {
    data.uncleInfo = uncleInfoEmpty();
  }
  return commonFromJson(data) as IoUser;
}

export const userFireConverter: FirestoreDataConverter<IoUser | null> = {
  toFirestore: (u: IoUser) => {
    return commonToJson(u);
  },
  fromFirestore: (
    snapshot: DocumentSnapshot<DocumentData>,
    options: any
  ): IoUser | null => {
    const data = snapshot.data(options);
    return data !== undefined ? userFromJson(data) : null;
  },
};

export async function userFromCredential(
  uc: UserCredential,
  name: string,
  role: USER_ROLE,
  providerId: USER_PROVIDER
): Promise<IoUser> {
  const token = await getFcmToken();
  const userInfo: IoUserInfo = {
    userId: uc.user.uid,
    providerId,
    userName: name,
    displayName: uc.user.displayName ?? undefined,
    email: uc.user.email ?? "",
    emailVerified: uc.user.emailVerified,
    role: role,
    fcmTokens: token !== null ? [token] : [],
    passed: false,
  };
  const data: IoUser = { userInfo };
  if (role === "UNCLE") {
    data.uncleInfo = uncleInfoEmpty();
  }
  return data;
}

export const uncleInfoEmpty = (): UncleInfo => ({
  pickupLocates: [],
  shipLocates: [],
  amountBySize: {},
  amountByWeight: {},
});
