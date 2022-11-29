import {
  Firestore,
  enableIndexedDbPersistence,
  initializeFirestore,
  enableNetwork,
  disableNetwork,
  // CACHE_SIZE_UNLIMITED,
} from "@firebase/firestore";
import { fbApp } from "../app";

export const iostore = initializeFirestore(fbApp, {
  // cacheSizeBytes: CACHE_SIZE_UNLIMITED,
});
//  TODO: move to io-front
// https://firebase.google.com/docs/firestore/manage-data/enable-offline
// enableIndexedDbPersistence(iostore).catch((err) => {
//   if (err.code == "failed-precondition") {
//     console.info(
//       "Multiple tabs open, persistence can only be enabled in one tab at a a time"
//     );
//   } else if (err.code == "unimplemented") {
//     console.info(
//       "The current browser does not support all of the features required to enable persistence"
//     );
//   }
// });
export const enableStoreNet = async () => enableNetwork(iostore);
export const disableStoreNet = async () => disableNetwork(iostore);
export const getIoStore = (): Firestore => iostore;
