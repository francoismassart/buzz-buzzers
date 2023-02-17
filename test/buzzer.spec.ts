import test from "ava";
import { spy, stub } from "sinon";

import createBuzzer from "../src/buzzer";
import { BuzzerEvent } from "../types/types";

const device = {
  onError: stub(),
  onChange: stub(),
  setLeds: stub(),
};

function getBuzzer() {
  return createBuzzer(device);
}

function getButtonStates() {
  return [
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
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
}

test("when setWrite fails during setup it should catch this", (t) => {
  device.setLeds.throws("could not write");
  const buzzer = getBuzzer();
  buzzer.setLeds(true, false, true, false);
  t.true(device.setLeds.calledWith([true, false, true, false]));
});

test("setLeds", (t) => {
  const buzzer = getBuzzer();
  buzzer.setLeds(true, false, true, false);
  t.true(device.setLeds.calledWith([true, false, true, false]));
});

test("when device.setLeds throws onError should be called", (t) => {
  device.setLeds.throws("could not write");
  const buzzer = getBuzzer();
  const callback = spy();
  buzzer.onError(callback);
  buzzer.setLeds(true, false, true, false);
  t.true(
    callback.calledWith(
      "Could not set led status. Older versions of the buzz buzzers do not support this."
    )
  );
});

test("onChange should register an onChange listener", (t) => {
  const buzzer = getBuzzer();
  const callback = spy();
  const buttonStates = getButtonStates();
  buzzer.onChange(callback);

  device.onChange.yield(buttonStates);
  const wasCalled = device.onChange.calledWith(buttonStates);
  t.pass(wasCalled.toString());
});

test("onError should register an error callback", (t) => {
  const buzzer = getBuzzer();
  const callback = spy();
  buzzer.onError(callback);

  device.onError.yield("my error");

  t.true(callback.calledWith("my error"));
});

test("onPress should fire when button is pressed", (t) => {
  const buzzer = getBuzzer();
  const callback = spy();
  buzzer.onPress(callback);
  const buttonStates = getButtonStates();
  buttonStates[4] = true;

  device.onChange.yield(buttonStates);
  t.true(
    callback.calledWith({
      controller: 1,
      button: 4,
    })
  );
});

test("onRelease should fire when button is released", (t) => {
  const buzzer = getBuzzer();
  const callback = spy();
  buzzer.onRelease(callback);
  const buttonStates = getButtonStates();
  buttonStates[4] = true;

  device.onChange.yield(buttonStates);
  const newButtonStates = getButtonStates();
  newButtonStates[4] = false;
  device.onChange.yield(newButtonStates);
  t.true(
    callback.calledWith({
      controller: 1,
      button: 4,
    })
  );
});

test("removeEventListener should remove added event listeners", (t) => {
  const buzzer = getBuzzer();
  const callback = spy();
  buzzer.onChange(callback);
  buzzer.removeEventListener(BuzzerEvent.CHANGE, callback);
  const buttonStates = getButtonStates();
  buttonStates[4] = true;

  device.onChange.yield(buttonStates);

  t.is(callback.callCount, 0);
});
