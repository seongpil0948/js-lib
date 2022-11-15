import { UserCredential } from "@firebase/auth";
import { getMessaging, getToken } from "@firebase/messaging";
import {
  DocumentData,
  DocumentSnapshot,
  FirestoreDataConverter,
} from "@firebase/firestore";
import { loadDate } from "../../util";
import {
  FcmToken,
  IoUser,
  IoUserInfo,
  USER_PROVIDER,
  USER_ROLE,
} from "../domain";

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
  const messaging = getMessaging();
  return getToken(messaging, {
    vapidKey:
      "BDATZH9Zt9gMTBQqOUpt2VMWb7wX2V8t0PeyO_UVCUf46kNkJ_smqT2nx31StrXKHVD_BRq5Bqhr2wsCCXQhLPw",
  })
    .then((token) => {
      if (token) {
        return { createdAt: new Date(), token };
      } else {
        const msg = "FCM 토큰흭득 실패. Request permission to generate one.";
        // FIXME: logger.warn(null, msg);
        console.info(msg);
        return null;
      }
    })
    .catch((err) => {
      if (err.code === "messaging/permission-blocked") return null;
      const msg =
        "An error occurred while retrieving msg token. " +
        (err instanceof Error ? err.message : JSON.stringify(err));
      console.error(msg);
      // FIXME: logger.error(null, msg);
      return null;
    });
}

export function userFromJson(data: { [x: string]: any }): IoUser | null {
  const userInfo: IoUserInfo = data.userInfo;
  userInfo.createdAt = loadDate(userInfo.createdAt);
  userInfo.updatedAt = loadDate(userInfo.updatedAt);

  return data
    ? {
        userInfo,
        companyInfo: data.companyInfo,
        operInfo: data.operInfo,
        preferDark: data.preferDark ?? false,
        uncleInfo: data.uncleInfo,
        workerInfo: data.workerInfo,
        shopInfo: data.shopInfo,
        workState: data.workState,
        connectState: data.connectState,
      }
    : null;
}

export const userFireConverter: FirestoreDataConverter<IoUser | null> = {
  toFirestore: (u: IoUser) => {
    return JSON.parse(JSON.stringify(u));
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
  return { userInfo };
}
