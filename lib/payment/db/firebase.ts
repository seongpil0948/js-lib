import {
  doc,
  DocumentSnapshot,
  getDoc,
  onSnapshot,
  setDoc,
} from "@firebase/firestore";
import { getIoCollection, IoCollection } from "../../firebase";
import { PaymentDB } from "../domain";
import { initPay, IoPay, payFireConverter } from "../util";

export const IopayFB: PaymentDB = {
  getIoPayByUserListen: function (uid: string, onSnap: (data: IoPay) => void) {
    // const userPay = ref<IoPay | null>(null);
    const docRef = getDocRef(uid);
    onSnapshot(docRef, async (docData) => {
      onSnap(await getPayFromDoc(docData, uid));
    });
  },
  getIoPaysListen: function (onSnap: (data: IoPay[]) => void) {
    onSnapshot(getPayCollection(), async (snapshot) => {
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
  getIoPayByUser: async function (uid: string) {
    const docRef = getDocRef(uid);
    const docData = await getDoc(docRef);
    return await getPayFromDoc(docData, uid);
  },
};

function getDocRef(uid: string) {
  return doc(getPayCollection(), uid);
}

async function getPayFromDoc(d: DocumentSnapshot<IoPay | null>, uid: string) {
  if (!d.exists() || !d.data()) {
    const docRef = getDocRef(uid);
    const pay = initPay(uid);
    await setDoc(docRef, pay);
    return pay;
  }
  return d.data()!;
}

function getPayCollection() {
  return getIoCollection({ c: IoCollection.IO_PAY }).withConverter(
    payFireConverter
  );
}
