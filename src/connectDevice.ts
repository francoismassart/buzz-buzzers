import nodeHid from "node-hid";

import hardware from "./hardware";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findDeviceByName(nodeHidLib: any) {
  const buzzDevice = nodeHidLib
    .devices()
    .find((d: nodeHid.Device) => d?.product?.match(/Buzz/));

  if (!buzzDevice) {
    throw new Error("No device found! Please connect a device first.");
  }

  return new nodeHidLib.HID(buzzDevice.vendorId, buzzDevice.productId);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ConnectDeviceType = (nodeHidLib: any) => nodeHid.HID;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function (nodeHidLib: any): nodeHid.HID {
  const device = nodeHid.devices().filter(
    (d) => d.vendorId === hardware.VENDOR_ID && hardware.PRODUCT_IDS.includes(d.productId)
  )[0];

  if (device) {
    return new nodeHidLib.HID(device.vendorId, device.productId);
  }

  return findDeviceByName(nodeHidLib);
}
