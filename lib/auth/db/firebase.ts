import { UserCredential } from "@firebase/auth";
import {
  getDocs,
  QuerySnapshot,
  query,
  where,
  doc,
  getDoc,
  Firestore,
} from "@firebase/firestore";
import {
  getIoCollection,
  IoCollection,
  batchInQuery,
  insertById,
} from "../../firebase";
import { IoUser, UserDB, USER_PROVIDER, USER_ROLE } from "../domain";
import { userFireConverter, userFromCredential } from "../util";

export const UserFB: UserDB = {
  getUsersByRole: async function (
    store: Firestore,
    role: USER_ROLE
  ): Promise<IoUser[]> {
    const c = getIoCollection(store, { c: IoCollection.USER }).withConverter(
      userFireConverter
    );
    const snap = await getDocs(query(c, where("userInfo.role", "==", role)));
    return usersFromSnap(snap);
  },
  getUserById: async function (store: Firestore, uid: string) {
    const snapshot = await getDoc(
      doc(getIoCollection(store, { c: IoCollection.USER }), uid).withConverter(
        userFireConverter
      )
    );
    const u = snapshot.data();
    return u;
  },
  getUserByIds: async function (
    store: Firestore,
    uids: string[]
  ): Promise<IoUser[]> {
    if (uids.length < 1) return [];
    const c = getIoCollection(store, { c: IoCollection.USER }).withConverter(
      userFireConverter
    );
    const snapshots = await batchInQuery<IoUser | null>(
      uids,
      c,
      "userInfo.userId"
    );
    return snapshots.flatMap(usersFromSnap);
  },
  ioSignUpCredential: async function (
    uc: UserCredential,
    name: string,
    role: USER_ROLE
  ) {
    const user = await userFromCredential(uc, name, role, USER_PROVIDER.KAKAO);
    return user;
  },
  updateUser: async function (store: Firestore, u: IoUser) {
    await insertById<IoUser>(
      u,
      getIoCollection(store, { c: IoCollection.USER }),
      u.userInfo.userId,
      true,
      userFireConverter
    );
  },
};

export function usersFromSnap(snap: QuerySnapshot<IoUser | null>): IoUser[] {
  const users: IoUser[] = [];
  console.log("users snap from cache " + snap.metadata.fromCache);
  snap.docs.forEach((d) => {
    const data = d.data();
    if (data) {
      users.push(data);
    }
  });
  return users;
}
