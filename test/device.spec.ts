import test from "ava";
import nodeHid from "node-hid";
import sinon from "sinon";

const mapDeviceDataToPressedButtons = sinon.stub();
const usbDevice = {
  write: sinon.stub(),
  on: sinon.stub(),
};
const connectDevice = sinon.stub().returns(usbDevice);

import deviceBuilder from "../src/device";

const device = deviceBuilder(connectDevice, mapDeviceDataToPressedButtons);

test("use connectDevice to connect to device", (t) => {
  t.true(connectDevice.calledWith(nodeHid));
});

test("setLeds to switch off all leds", (t) => {
  device.setLeds([false, false, false, false]);
  t.true(usbDevice.write.calledWith([0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));
});

test("setLeds to switch all leds on", (t) => {
  device.setLeds([true, true, true, true]);
  t.true(usbDevice.write.calledWith([0x00, 0x00, 0xff, 0xff, 0xff, 0xff]));
});

test("setLeds to switch some leds on some off", (t) => {
  device.setLeds([false, true, false, true]);
  t.true(usbDevice.write.calledWith([0x00, 0x00, 0x00, 0xff, 0x00, 0xff]));
});

test("onError should register an error callback", (t) => {
  const callback = sinon.spy();
  device.onError(callback);

  t.true(usbDevice.on.calledWith("error", callback));
});

test("onChange should register a data listener", (t) => {
  const callback = sinon.spy();

  device.onChange(callback);

  t.true(usbDevice.on.calledWith("data"));
});

test("onChange should call callback with mapped pressedButtons", (t) => {
  const callback = sinon.spy();
  const buttonStates: boolean[] = [];
  mapDeviceDataToPressedButtons.returns(buttonStates);

  device.onChange(callback);
  usbDevice.on.yield(buttonStates);

  t.true(callback.calledWith(buttonStates));
});
