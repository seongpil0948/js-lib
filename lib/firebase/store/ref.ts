import { getCollectParam, IoCollection } from "./domain";
import {
  CollectionReference,
  collection,
  collectionGroup,
} from "@firebase/firestore";
import { IoFireApp } from "../app";
import { RequiredField } from "../../exception";

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
      if (!p.uid) throw new RequiredField("getIoCollection", "uid");
      str = `user/${p.uid}/orderProd`; // /${p.shopProdId}
      break;
    case IoCollection.ORDER_PROD_NUMBER:
      if (!p.uid) throw new RequiredField("getIoCollection", "uid");
      str = `user/${p.uid}/orderNumber`; // orderId
      break;
    case IoCollection.SHIPMENT:
      if (!p.uid) throw new RequiredField("getIoCollection", "uid");
      str = `user/${p.uid}/shipment`; // orderId
      break;
    case IoCollection.USER_LOG:
      if (!p.uid) throw new RequiredField("getIoCollection", "uid");
      str = `user/${p.uid}/logs`; // orderId
      break;
    case IoCollection.TOKENS:
      if (!p.uid) throw new RequiredField("getIoCollection", "uid");
      str = `user/${p.uid}/tokens`; // orderId
      break;
    case IoCollection.CS_POST:
      str = `csPost`;
      break;
    case IoCollection.TEST:
      str = `test`;
      break;
    case IoCollection.VIRTUAL_VENDOR_PROD:
      if (!p.uid) throw new RequiredField("getIoCollection", "uid");
      str = `user/${p.uid}/virtualVendorProduct`;
      break;
    case IoCollection.VIRTUAL_ORDER_PROD:
      if (!p.uid) throw new RequiredField("getIoCollection", "uid");
      str = `user/${p.uid}/virtualOrderProd`;
      break;
    case IoCollection.VIRTUAL_USER:
      if (!p.uid) throw new RequiredField("getIoCollection", "uid");
      str = `user/${p.uid}/virtualUser`;
      break;
    default:
      throw Error(`IoCollection Enum Member ${p.c.toString()} is not Exist`);
  }

  return collection(IoFireApp.getInst().store, str);
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
  return collectionGroup(IoFireApp.getInst().store, str);
}
