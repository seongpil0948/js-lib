import {
  CollectionReference,
  FirestoreDataConverter,
  doc,
  getDoc,
  setDoc,
  QuerySnapshot,
  getDocs,
  query,
  where,
} from "@firebase/firestore";

export async function insertById<T>(
  data: T,
  c: CollectionReference,
  id: string,
  update: boolean,
  converter: FirestoreDataConverter<T | null>
) {
  const document = doc(c, id).withConverter(converter);
  if (!update) {
    const d = await getDoc(document);
    if (!d.exists()) {
      await setDoc(document, data, {
        merge: false,
      });
    }
  }
  await setDoc(document, data, {
    merge: update,
  });
}

export async function batchInQuery<T>(
  ids: string[] | number[],
  c: CollectionReference<any>,
  field: string
) {
  if (!ids || !ids.length) return [];

  const batches: Promise<QuerySnapshot<T>>[] = [];
  while (ids.length) {
    // caution will removed of ids elements
    const batch = ids.splice(0, 10); // batch size 10
    // add the batch request to to a queue
    batches.push(getDocs(query(c, where(field, "in", [...batch]))));
  }
  return Promise.all(batches);
}

export function dataFromSnap<T>(snap: QuerySnapshot<T | null>): T[] {
  const result: T[] = [];

  snap.docs.forEach((d) => {
    const data = d.data();
    if (data) {
      result.push(data);
    }
  });
  return result;
}
