/** Button value: 0 is the big red button, 1 is blue, 2 is orange, 3 is green and 4 is yellow */
export type BuzzerButtonType = 0 | 1 | 2 | 3 | 4;
/** Controller number (1-4) */
export type BuzzerControllerType = 1 | 2 | 3 | 4;

/** DataMapper converts a bytes Buffer into an array of 20 booleans (5 buttons x 4 buzzers) */
export type DataMapper = (bytes: Buffer) => boolean[];
/** DataMapperMaker creates a DataMapper configured with the correct mappings */
export type DataMapperMaker = () => DataMapper;

/** The IBuzzer represents a single USB dongle which can have up to 4 controllers, each controller has 5 buttons */
export interface IBuzzer {
  /**
   * Watch the states of all buttons (5) of all controllers (4), via an array of 20 booleans (5x4)
   * @param eventHandler The listener which receive the array of 20 booleans
   */
  onChange(eventHandler: (states: boolean[] /* 20 */) => void): void;
  /**
   * Handle an error triggered by one USB dongle
   * @param eventHandler The listener which receive the error message string
   */
  onError(eventHandler: (error: string) => void): void;
  /**
   * Handle a button being pressed
   * @param eventHandler The listener which receive the BuzzerEventData
   */
  onPress(eventHandler: (payload: BuzzerEventData) => void): void;
  /**
   * Handle a button being released
   * @param eventHandler The listener which receive the BuzzerEventData
   */
  onRelease(eventHandler: (payload: BuzzerEventData) => void): void;
  /**
   * Removes a specific event listener using its type and callback
   * @param type {BuzzerEventType} Type of event (e.g. "release")
   * @param callback {CallbackType} The function that was being called after the event
   */
  removeEventListener(type: BuzzerEventType, callback: CallbackType): void;
  /**
   * Turns the LED of each controller ON or OFF
   * @param led1 {boolean} On/Off status of LED for controller #1
   * @param led2 {boolean} On/Off status of LED for controller #2
   * @param led3 {boolean} On/Off status of LED for controller #3
   * @param led4 {boolean} On/Off status of LED for controller #4
   */
  setLeds(led1: boolean, led2: boolean, led3: boolean, led4: boolean): void;
}

/** The available types of events for the Buzzers' USB Dongle */
export type BuzzerEventType = "press" | "release" | "error" | "change";

/** An event of type "press" or "release" will provide its `controller` and its `button` */
export interface BuzzerEventData {
  /** The number identifying the controller related to the event */
  readonly controller: BuzzerControllerType;
  /** The number identifying the controller's button related to the event */
  readonly button: BuzzerButtonType;
}

/** The payload is the data related to an event "press" or "release" */
export type PayloadType = boolean[] | BuzzerEventData | string;
/** The callbacks will get a payload to handle */
export type CallbackType = (payload: PayloadType) => void;
/** The specific callback for a "change" event */
type ChangeCallbackType = (states: boolean[] /* 20 */) => void;
/** The specific callback for an "error" event */
type ErrorCallbackType = (message: string) => void;
/** The array of 4 booleans with LED status */
type IDeviceLeds = [boolean, boolean, boolean, boolean];

/** The generic device reached via node HID */
export interface IDevice {
  /**
   * Change handler
   * @param callback
   */
  onChange(callback: ChangeCallbackType): void;
  /**
   * Error handler
   * @param callback
   */
  onError(callback: ErrorCallbackType): void;
  /**
   * Define the states of the LED via an array of 4 booleans
   * @param ledStates
   */
  setLeds(ledStates: IDeviceLeds): void;
}

/** The listeners storage */
export interface Listeners {
  /** The array of press handlers */
  press: ((payload: PayloadType) => void)[];
  /** The array of release handlers */
  release: ((payload: PayloadType) => void)[];
  /** The array of change handlers */
  change: ((payload: PayloadType) => void)[];
  /** The array of error handlers */
  error: ((payload: PayloadType) => void)[];
}
