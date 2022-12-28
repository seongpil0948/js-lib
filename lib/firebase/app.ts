import { initializeApp, FirebaseApp } from "firebase/app";
import {
  EnvNotMatchedWithInstance,
  IoNotSupportedEnv,
  NotInitializedIoFireApp,
} from "../exception";

const firebaseProdConfig = {
  apiKey: "AIzaSyCZZWgDchBhOt_FegFemyofULLHzTLVjA4",
  authDomain: "io-box.firebaseapp.com",
  databaseURL: "https://io-box-default-rtdb.firebaseio.com",
  projectId: "io-box",
  storageBucket: "io-box.appspot.com",
  messagingSenderId: "812477328372",
  appId: "1:812477328372:web:48d71b6a8390480d6827a1",
  measurementId: "G-JYYCY3TTPS",
};
const firebaseDevConfig = {
  apiKey: "AIzaSyDDBPpQ9Z8ciqpdIfcqLoP2zaYwPCsZN4A",
  authDomain: "io-box-develop.firebaseapp.com",
  projectId: "io-box-develop",
  storageBucket: "io-box-develop.appspot.com",
  messagingSenderId: "906159770710",
  appId: "1:906159770710:web:f09dcf880010f703c8fff7",
};
export type IO_ENV = "io-dev" | "io-prod";

export class IoFireApp {
  private static instance: IoFireApp;
  public env: IO_ENV;
  public app: FirebaseApp;

  // new 클래스 구문 사용 제한을 목적으로 constructor() 함수 앞에 private 접근 제어자 추가
  private constructor(env: IO_ENV) {
    this.env = env;
    this.app = this.getIoFirebaseApp();
    // this.store = initializeFirestore(this.app, {});
    // enableIndexedDbPersistence(this.store, { forceOwnership: false });
  }
  private getIoFirebaseApp() {
    if (this.env === "io-dev") {
      return initializeApp(firebaseDevConfig, "io-box-develop-app");
    } else if (this.env === "io-prod") {
      return initializeApp(firebaseProdConfig, "io-box-production-app");
    } else throw new IoNotSupportedEnv(`${this.env} is not supported env`);
  }

  // 오직 getInst() 스태틱 메서드를 통해서만 단 하나의 객체를 생성할 수 있습니다.
  public static getInst(env?: IO_ENV) {
    if (!IoFireApp.instance) {
      if (!env) throw new NotInitializedIoFireApp();
      else IoFireApp.instance = new IoFireApp(env);
    } else if (env && IoFireApp.instance.env !== env) {
      console.log("env: ", env);
      throw new EnvNotMatchedWithInstance(
        `param ${env} is not matched env(${IoFireApp.instance.env})`
      );
    }
    return IoFireApp.instance;
  }
}
