import { getCollectParam, IoCollection } from "./domain";
import {
  CollectionReference,
  collection,
  collectionGroup,
} from "@firebase/firestore";
import { iostore } from "./store";
export function getIoCollection(p: getCollectParam): CollectionReference {
  let str: string;
  switch (p.c) {
    case IoCollection.USER:
      str = "user";
      break;
    case IoCollection.MAPPER:
      str = `mapper`;
      break;
    case IoCollection.VENDOR_PROD:
      str = "vendorProduct";
      break;
    case IoCollection.SHOP_PROD:
      str = "shopProduct";
      break;
    case IoCollection.IO_PAY:
      str = "ioPay";
      break;
    case IoCollection.PICKUP_LOCATES:
      str = "pickupLocates";
      break;
    case IoCollection.ORDER_PROD:
      str = `user/${p.uid}/orderProd`; // /${p.shopProdId}
      break;
    case IoCollection.ORDER_PROD_NUMBER:
      str = `user/${p.uid}/orderNumber`; // orderId
      break;
    case IoCollection.SHIPMENT:
      str = `user/${p.uid}/shipment`; // orderId
      break;
    case IoCollection.USER_LOG:
      str = `user/${p.uid}/logs`; // orderId
      break;
    case IoCollection.TOKENS:
      str = `user/${p.uid}/tokens`; // orderId
      break;
    case IoCollection.CS_POST:
      str = `csPost`;
      break;
    default:
      throw Error(`IoCollection Enum Member ${p.c.toString()} is not Exist`);
  }
  return collection(iostore, str);
}
export function getIoCollectionGroup(c: IoCollection) {
  let str: string;
  switch (c) {
    case IoCollection.ORDER_PROD:
      str = `orderProd`;
      break;
    default:
      throw Error(`IoCollection Enum Member ${c.toString()} is not Exist`);
  }
  return collectionGroup(iostore, str);
}
