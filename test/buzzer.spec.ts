import test from "ava";
import { spy, stub } from "sinon";

import createBuzzer from "../src/buzzer";

const getStubbedDevice = () => {
  return {
    onError: stub(),
    onChange: stub(),
    setLeds: stub(),
  };
};

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
  const device = getStubbedDevice();
  device.setLeds.throws("could not write");
  const buzzer = createBuzzer(device);
  buzzer.setLeds(true, false, true, false);
  t.true(device.setLeds.calledWith([true, false, true, false]));
});

test("setLeds", (t) => {
  const device = getStubbedDevice();
  const buzzer = createBuzzer(device);
  buzzer.setLeds(true, false, true, false);
  t.true(device.setLeds.calledWith([true, false, true, false]));
});

test("when reduceSetLeds is enabled useless setLeds calls should be avoided", (t) => {
  const device = getStubbedDevice();
  t.is(device.setLeds.callCount, 0);
  const buzzer = createBuzzer(device, true);
  t.true(device.setLeds.calledOnce); // setLeds turn off all leds at startup
  buzzer.setLeds(false, false, false, false); // useless call
  t.true(device.setLeds.calledOnce); // setLeds should be ignored
  buzzer.setLeds(false, false, false, true); // usefull call
  t.is(device.setLeds.callCount, 2);
});

test("when device.setLeds throws onError should be called", (t) => {
  const device = getStubbedDevice();
  device.setLeds.throws("could not write");
  const buzzer = createBuzzer(device);
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
  const device = getStubbedDevice();
  const buzzer = createBuzzer(device);
  const callback = spy();
  const buttonStates = getButtonStates();
  buzzer.onChange(callback);

  device.onChange.yield(buttonStates);
  const wasCalled = device.onChange.calledWith(buttonStates);
  t.pass(wasCalled.toString());
});

test("onError should register an error callback", (t) => {
  const device = getStubbedDevice();
  const buzzer = createBuzzer(device);
  const callback = spy();
  buzzer.onError(callback);

  device.onError.yield("my error");

  t.true(callback.calledWith("my error"));
});

test("onPress should fire when button is pressed", (t) => {
  const device = getStubbedDevice();
  const buzzer = createBuzzer(device);
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
  const device = getStubbedDevice();
  const buzzer = createBuzzer(device);
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
  const device = getStubbedDevice();
  const buzzer = createBuzzer(device);
  const callback = spy();
  buzzer.onChange(callback);
  buzzer.removeEventListener("change", callback);
  const buttonStates = getButtonStates();
  buttonStates[4] = true;

  device.onChange.yield(buttonStates);

  t.is(callback.callCount, 0);
});
