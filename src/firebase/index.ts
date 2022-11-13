import { FirebaseStorage } from "@firebase/storage";
import { Analytics } from "@firebase/analytics";
import { iostore } from "./store";
import { ioStorage } from "./storage";
import { analytics } from "./app";
import { Firestore } from "@firebase/firestore";

interface IoFire {
  store: Firestore;
  storage: FirebaseStorage;
  analytics: Analytics;
}

export const ioFire: IoFire = {
  store: iostore,
  storage: ioStorage,
  analytics,
};

export * from "./app";
export * from "./storage";
export * from "./store";
