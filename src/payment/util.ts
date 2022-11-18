import {
  DocumentData,
  DocumentSnapshot,
  FirestoreDataConverter,
} from "@firebase/firestore";
import { CommonField } from "../common";
import { commonToJson, loadDate } from "../util";
import { IO_BANKS, PayHistoryCRT } from "./domain";

export interface IoAccount {
  accountName: string;
  accountNumber: string;
  bank: IO_BANKS;
}

export interface IoPay extends CommonField {
  userId: string;
  budget: number;
  pendingBudget: number;
  history: PayHistoryCRT[];
}
export function initPay(userId: string): IoPay {
  return {
    userId,
    budget: 0,
    pendingBudget: 0,
    history: [],
  };
}

export function coinToMoneyStr(
  coin: number,
  COIN_PAY_RATIO: number,
  COIN_FEE: number
) {
  return coinToMoney(coin, COIN_PAY_RATIO, COIN_FEE).toLocaleString() + "원";
}
export function coinToMoney(
  coin: number,
  COIN_PAY_RATIO: number,
  COIN_FEE: number
) {
  const money = coin * COIN_PAY_RATIO;
  return money * (1 + COIN_FEE); // tax
}
export function moneyToCoin(money: number, COIN_PAY_RATIO: number) {
  if (money % COIN_PAY_RATIO !== 0)
    throw new Error(
      `코인으로 변경시 금액은 ${COIN_PAY_RATIO} 으로 나뉘어져야 합니다.`
    );

  return money / COIN_PAY_RATIO;
}

export function payFromJson(data: { [x: string]: any }): IoPay | null {
  return {
    createdAt: loadDate(data.createdAt),
    updatedAt: loadDate(data.updatedAt),
    userId: data.userId,
    budget: data.budget,
    pendingBudget: data.pendingBudget,
    history: data.history,
  };
}
export const payFireConverter: FirestoreDataConverter<IoPay | null> = {
  toFirestore: (pay: IoPay) => {
    return commonToJson(pay);
  },
  fromFirestore: (
    snapshot: DocumentSnapshot<DocumentData>,
    options: any
  ): IoPay | null => {
    const data = snapshot.data(options);
    return data !== undefined ? payFromJson(data) : null;
  },
};
