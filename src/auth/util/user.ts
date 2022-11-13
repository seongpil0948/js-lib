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

export const userFireConverter: FirestoreDataConverter<IoUser | null> = {
  toFirestore: (u: IoUser) => {
    return JSON.parse(JSON.stringify(u));
  },
  fromFirestore: (
    snapshot: DocumentSnapshot<DocumentData>,
    options: any
  ): IoUser | null => {
    const data = snapshot.data(options);
    return data !== undefined ? ioFromJson(data) : null;
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

function ioFromJson(data: { [x: string]: any }): IoUser | null {
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
