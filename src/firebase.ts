import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  DocumentData,
  DocumentSnapshot,
  FirestoreDataConverter,
  getFirestore,
} from "@firebase/firestore";
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";

import { uuidv4 } from "@firebase/util";
// import {IoFireApp, getIoCollection, commonToJson, FirestoreDataConverter, commonFromJson} from "@io-boxies/js-lib"
import {
  IoFireApp,
  getIoCollection,
  commonToJson,
  commonFromJson,
  dateToTimeStamp,
} from "../lib";

export function setupFire(el: HTMLButtonElement) {
  el.onclick = (e) => {
    const inst = IoFireApp.getInst("io-dev");
    console.log("click", e);
    console.log("IoFireApp: ", inst);
    const fireZone = document.createElement("div");
    fireZone.innerHTML = `
    <div>
      <h3>Fire Zone</h3>
      <div class="card">
        <button type="button" id="testCallableFunc">testCallableFunc</button>
        <button type="button" id="listenTestCollection">listen test collection</button>
        <button type="button" id="setTestCollection">set test collection</button>
        <button type="button" id="updateTestCollection">update test collection</button>
      </div>
      <div id="test-data-list" class="card">

      </div>
    </div>  
    `;
    document.querySelector<HTMLDivElement>("#app")!.appendChild(fireZone);

    (document.getElementById("testCallableFunc") as HTMLButtonElement).onclick =
      async function () {
        const inst = IoFireApp.getInst("io-dev");
        const functions = getFunctions(inst.app, "asia-northeast3");
        const funcName = "scheduledFirestoreExport";
        connectFunctionsEmulator(functions, "localhost", 5001); // DEBUG
        let func = httpsCallable(functions, funcName);
        let result = await func();
        console.log(`result of ${funcName}: ${result.data}`);
        return result.data;
      };

    // >>> listen test collection >>>
    const testData: any[] = [];
    (
      document.getElementById("listenTestCollection") as HTMLButtonElement
    ).onclick = function () {
      const c = getIoCollection(getFirestore(), { c: "TEST" }).withConverter(
        fireConverter()
      );
      onSnapshot(c, (snapshot) => {
        snapshot.docChanges().forEach((c) => {
          const target = c.doc.data();
          if (target) {
            if (c.type === "added") {
              testData.unshift(target);
            }
            if (c.type === "modified") {
              const idx = testData.findIndex(
                (data: any) => data.id === data.id
              );
              console.assert(idx !== -1);
              testData[idx] = target;
            }
            if (c.type === "removed") {
              const idx = testData.findIndex((data) => data.id === data.id);
              console.assert(idx !== -1);
              testData.splice(idx, 1);
            }
          }
        });
        const el = document.getElementById(
          "test-data-list"
        ) as HTMLButtonElement;
        let html = "";
        for (let i = 0; i < testData.length; i++) {
          const data = testData[i];
          html += `<p>${JSON.stringify(data)}</p>`;
        }
        el.innerHTML = html;
      });
    };
    // >>> set test collection >>>
    (
      document.getElementById("setTestCollection") as HTMLButtonElement
    ).onclick = async function () {
      const c = getIoCollection(getFirestore(), { c: "TEST" });
      const id = uuidv4();
      const j = commonToJson({
        id,
        content: "test data 1",
        createdAt: new Date(),
      });
      console.log("json:", j);
      await setDoc(doc(c, id), j);
    };
    // >>> update test collection >>>
    (
      document.getElementById("updateTestCollection") as HTMLButtonElement
    ).onclick = async function () {
      const c = getIoCollection(getFirestore(), { c: "TEST" });
      const j = { createdAt: dateToTimeStamp(new Date()) };
      console.log("testData:", testData[0]);
      console.log("json:", j);
      await updateDoc(doc(c, testData[0].id), j);
    };
  };
}

const fireConverter = () =>
  ({
    toFirestore: (data: any) => commonToJson(data),
    fromFirestore: (
      snapshot: DocumentSnapshot<DocumentData>,
      options: any
    ): any | null => {
      const data = snapshot.data(options);
      return data !== undefined ? commonFromJson(data) : null;
    },
  } as FirestoreDataConverter<any | null>);
