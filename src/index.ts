import nodeHid from "node-hid";

import { IBuzzer } from "../types/types";
import buzzer from "./buzzer";
import connectDevice from "./connectDevice";
import device from "./device";
import hw from "./hardware";
import getMapper from "./parser/mapDeviceDataToPressedButtons";

const mapperFn = getMapper();

module.exports = (singleMode = true): IBuzzer | IBuzzer[] => {
  if (singleMode) {
    return buzzer(device(connectDevice, mapperFn));
  }
  const buzzers: IBuzzer[] = [];
  const devices = nodeHid.devices();
  const buzzDongles = devices.filter(
    (d) => d.vendorId === hw.VENDOR_ID && d.productId === hw.PRODUCT_ID
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
