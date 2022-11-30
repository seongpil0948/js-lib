// https://ko.javascript.info/custom-errors
export class IoBoxError extends Error {
  constructor(message: string) {
    super(message);
    // IoBoxDefaultError
    this.name = this.constructor.name;
  }
}

export class IoNotSupportedEnv extends IoBoxError {}
export class EnvNotMatchedWithInstance extends IoBoxError {}
export class NotInitializedIoFireApp extends IoBoxError {
  constructor() {
    super("must use IoFireApp after initialized, and add env param for init");
  }
}
