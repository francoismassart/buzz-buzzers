import nodeHid from "node-hid";

import buzzer from "./buzzer";
import connectDevice from "./connectDevice";
import device from "./device";
import hardware from "./hardware";
import getMapper from "./parser/mapDeviceDataToPressedButtons";
import { IBuzzer } from "./types";

const mapperFn = getMapper();

module.exports = (singleMode = true) => {
  if (singleMode) {
    return buzzer(device(connectDevice, mapperFn));
  }
  const buzzers: IBuzzer[] = [];
  const devices = nodeHid.devices();
  const buzzDongles = devices.filter(
    (d) =>
      d.vendorId === hardware.VENDOR_ID && d.productId === hardware.PRODUCT_ID
  );
  buzzDongles.forEach((bd) => {
    if (typeof bd?.path === "string") {
      buzzers.push(
        buzzer(device(() => new nodeHid.HID(`${bd.path}`), mapperFn))
      );
    }
  });
  return buzzers;
};
