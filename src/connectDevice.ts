import nodeHid from "node-hid";

import hardware from "./hardware";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findDeviceByName(nodeHidLib: any) {
  const buzzDevice = nodeHidLib
    .devices()
    .find((d: nodeHid.Device) => d?.product?.match(/Buzz/));
  return new nodeHidLib.HID(buzzDevice.vendorId, buzzDevice.productId);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ConnectDeviceType = (nodeHidLib: any) => nodeHid.HID;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function (nodeHidLib: any): nodeHid.HID {
  try {
    return new nodeHidLib.HID(hardware.VENDOR_ID, hardware.PRODUCT_ID);
  } catch (err) {
    return findDeviceByName(nodeHidLib);
  }
}
