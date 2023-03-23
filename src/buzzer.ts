import {
  BuzzerButtonType,
  BuzzerControllerType,
  BuzzerEventData,
  BuzzerEventType,
  ChangeListeners,
  ErrorListeners,
  IBuzzer,
  IDevice,
  PayloadType,
  PressListeners,
  ReleaseListeners,
} from "../types/types";

export default function Buzzer(
  device: IDevice,
  reduceSetLeds = false
): IBuzzer {
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

  let previousLedStatesStr = "";

  const changeListeners: ChangeListeners = new Set();
  const errorListeners: ErrorListeners = new Set();
  const pressListeners: PressListeners = new Set();
  const releaseListeners: ReleaseListeners = new Set();

  const indexToBuzzerEventData = (index: number): BuzzerEventData => {
    const buttons = 5;
    const controllerIndex = Math.floor(index / buttons);
    return {
      controller: (controllerIndex + 1) as BuzzerControllerType,
      button: (index - controllerIndex * buttons) as BuzzerButtonType,
    };
  };

  const triggerEvent = (eventType: BuzzerEventType, payload: PayloadType) => {
    switch (eventType) {
      case "change":
        changeListeners.forEach((listener) => listener(payload as boolean[]));
        break;
      case "error":
        errorListeners.forEach((listener) => listener(payload as string));
        break;
      case "press":
        pressListeners.forEach((listener) =>
          listener(payload as BuzzerEventData)
        );
        break;
      case "release":
        releaseListeners.forEach((listener) =>
          listener(payload as BuzzerEventData)
        );
    }
  };

  // Turn off all leds by default
  try {
    device.setLeds([false, false, false, false]);
    previousLedStatesStr = "false-false-false-false";
  } catch (err) {
    // older versions don't have an led
  }

  device.onChange((states) => {
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
      const newLedStates = `${led1}-${led2}-${led3}-${led4}`;
      if (reduceSetLeds && newLedStates === previousLedStatesStr) {
        // Prevent useless update of Led to enhance perfs
        return;
      }
      try {
        device.setLeds([led1, led2, led3, led4]);
        previousLedStatesStr = newLedStates;
      } catch (err) {
        const message =
          "Could not set led status. Older versions of the buzz buzzers do not support this.";
        triggerEvent("error", message);
      }
    },
    onChange(cb) {
      changeListeners.add(cb);
    },
    onError(cb) {
      errorListeners.add(cb);
    },
    onPress(cb) {
      pressListeners.add(cb);
    },
    onRelease(cb) {
      releaseListeners.add(cb);
    },
    removeEventListener(type, callback) {
      switch (type) {
        case "change":
          changeListeners.delete(callback);
          break;
        case "error":
          errorListeners.delete(callback);
          break;
        case "press":
          pressListeners.delete(callback);
          break;
        case "release":
          releaseListeners.delete(callback);
          break;
      }
    },
  };
}
