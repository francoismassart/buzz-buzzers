import nodeHid from "node-hid";

import hardware from "./hardware";

function findDeviceByName(nodeHidLib: any) {
  const buzzDevice = nodeHidLib
    .devices()
    .find((d: nodeHid.Device) => d?.product?.match(/Buzz/));
  return new nodeHidLib.HID(buzzDevice.vendorId, buzzDevice.productId);
}

export type ConnectDeviceType = (nodeHidLib: any) => nodeHid.HID;

export default function (nodeHidLib: any): nodeHid.HID {
  try {
    return new nodeHidLib.HID(hardware.VENDOR_ID, hardware.PRODUCT_ID);
  } catch (err) {
    return findDeviceByName(nodeHidLib);
  }
}
