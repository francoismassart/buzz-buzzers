export type BuzzerButtonType = 0 | 1 | 2 | 3 | 4;
export type BuzzerControllerType = 1 | 2 | 3 | 4;

export type DataMapper = (bytes: Buffer) => boolean[];
export type DataMapperMaker = () => DataMapper;

export interface IBuzzer {
  onChange(eventHandler: (states: boolean[] /* 20 */) => void): void;
  onError(eventHandler: (error: string) => void): void;
  onPress(eventHandler: (payload: BuzzerEventData) => void): void;
  onRelease(eventHandler: (payload: BuzzerEventData) => void): void;
  removeEventListener(type: BuzzerEvent, callback: CallbackType): void;
  setLeds(led1: boolean, led2: boolean, led3: boolean, led4: boolean): void;
}

export enum BuzzerEvent {
  PRESS = "press",
  RELEASE = "release",
  ERROR = "error",
  CHANGE = "change",
}

export interface BuzzerEventData {
  /** The number identifying the controller related to the event */
  readonly controller: BuzzerControllerType;
  /** The number identifying the controller's button related to the event */
  readonly button: BuzzerButtonType;
}

export type PayloadType = boolean[] | BuzzerEventData | string;
export type CallbackType = (payload: PayloadType) => void;
type ChangeCallbackType = (states: boolean[] /* 20 */) => void;
type ErrorCallbackType = (message: string) => void;
type IDeviceLeds = [boolean, boolean, boolean, boolean];

export interface IDevice {
  onChange(callback: ChangeCallbackType): void;
  onError(callback: ErrorCallbackType): void;
  setLeds(ledStates: IDeviceLeds): void;
}

export interface Listeners {
  // [BuzzerEvent.PRESS]: ((payload: BuzzerEventData) => void)[]
  // [BuzzerEvent.RELEASE]: ((payload: BuzzerEventData) => void)[]
  // [BuzzerEvent.CHANGE]: ((states: boolean[]) => void)[]
  // [BuzzerEvent.ERROR]: ((message: string) => void)[]
  press: ((payload: PayloadType) => void)[];
  release: ((payload: PayloadType) => void)[];
  change: ((payload: PayloadType) => void)[];
  error: ((payload: PayloadType) => void)[];
}
