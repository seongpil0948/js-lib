import {
  doc,
  DocumentSnapshot,
  getDoc,
  onSnapshot,
  setDoc,
  Firestore,
} from "@firebase/firestore";
import { getIoCollection, IoCollection } from "../../firebase";
import { PaymentDB } from "../domain";
import { initPay, IoPay, payFireConverter } from "../util";

export const IopayFB: PaymentDB = {
  getIoPayByUserListen: function (
    store: Firestore,
    uid: string,
    onSnap: (data: IoPay) => void
  ) {
    // const userPay = ref<IoPay | null>(null);
    const docRef = getDocRef(store, uid);
    onSnapshot(docRef, async (docData) => {
      onSnap(await getPayFromDoc(store, docData, uid));
    });
  },
  getIoPaysListen: function (
    store: Firestore,
    onSnap: (data: IoPay[]) => void
  ) {
    onSnapshot(getPayCollection(store), async (snapshot) => {
      const usersPay: IoPay[] = [];
      snapshot.forEach((s) => {
        const data = s.data();
        if (data) {
          usersPay.push(data);
        }
      });
      onSnap(usersPay);
    });
  },
  getIoPayByUser: async function (store: Firestore, uid: string) {
    const docRef = getDocRef(store, uid);
    const docData = await getDoc(docRef);
    return await getPayFromDoc(store, docData, uid);
  },
};

function getDocRef(store: Firestore, uid: string) {
  return doc(getPayCollection(store), uid);
}

async function getPayFromDoc(
  store: Firestore,
  d: DocumentSnapshot<IoPay | null>,
  uid: string
) {
  if (!d.exists() || !d.data()) {
    const docRef = getDocRef(store, uid);
    const pay = initPay(uid);
    await setDoc(docRef, pay);
    return pay;
  }
  return d.data()!;
}

function getPayCollection(store: Firestore) {
  return getIoCollection(store, { c: IoCollection.IO_PAY }).withConverter(
    payFireConverter
  );
}
