import {
  BuzzerButtonType,
  BuzzerControllerType,
  BuzzerEventData,
  BuzzerEventType,
  CallbackType,
  IBuzzer,
  IDevice,
  Listeners,
  PayloadType,
} from "../types/types";

export default function Buzzer(device: IDevice): IBuzzer {
  // Array of states
  // `false` means the button is not pressed
  // and `true` when a button is pressed
  let previousStates = [
    false, // Controller 1, button 1
    false, // Controller 1, button 2
    false, // Controller 1, button 3
    false, // Controller 1, button 4
    false, // Controller 1, button 5
    false, // Controller 2, button 1
    false, // ...
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];

  const listeners: Listeners = {
    // ["press"]: [],
    // ["release"]: [],
    // ["change"]: [],
    // ["error"]: []
    press: [],
    release: [],
    change: [],
    error: [],
  };

  const isStates = (states: PayloadType): states is boolean[] => {
    return typeof states !== "string" && "length" in states;
  };

  const indexToBuzzerEventData = (index: number): BuzzerEventData => {
    const buttons = 5;
    const controllerIndex = Math.floor(index / buttons);
    return {
      controller: (controllerIndex + 1) as BuzzerControllerType,
      button: (index - controllerIndex * buttons) as BuzzerButtonType,
    };
  };

  const addEventListener = (
    eventType: BuzzerEventType,
    eventHandler: CallbackType
  ) => {
    listeners[eventType].push(eventHandler);
  };

  const triggerEvent = (eventType: BuzzerEventType, payload: PayloadType) => {
    listeners[eventType].forEach((listener) => listener(payload));
  };

  // Turn off all leds by default
  try {
    device.setLeds([false, false, false, false]);
  } catch (err) {
    // older versions don't have an led
  }

  device.onChange((states) => {
    if (!states) return;
    if (!isStates(states)) return;
    states.forEach((state, index) => {
      const previousState = previousStates[index];
      if (state !== previousState) {
        const eventType = state ? "press" : "release";
        triggerEvent(eventType, indexToBuzzerEventData(index));
      }
    });
    triggerEvent("change", states);
    previousStates = states;
  });

  device.onError(function (err) {
    triggerEvent("error", err);
  });

  return {
    setLeds(led1, led2, led3, led4) {
      try {
        device.setLeds([led1, led2, led3, led4]);
      } catch (err) {
        const message =
          "Could not set led status. Older versions of the buzz buzzers do not support this.";
        triggerEvent("error", message);
      }
    },
    onChange(cb) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      addEventListener("change", cb);
    },
    onPress(cb) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      addEventListener("press", cb);
    },
    onRelease(cb) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      addEventListener("release", cb);
    },
    onError(cb) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      addEventListener("error", cb);
    },
    removeEventListener(type, callback) {
      listeners[type] = listeners[type].filter(
        (listener) => listener !== callback
      );
    },
  };
}
