import nodeHid from "node-hid";

import { DataMapper, IDevice } from "../types/types";
import { ConnectDeviceType } from "./connectDevice";

const Device = (connector: ConnectDeviceType, mapper: DataMapper): IDevice => {
  const hidDevice = connector(nodeHid);
  return {
    onChange(callback) {
      hidDevice.on("data", function (data: Buffer) {
        // fma: data <Buffer 00 00 01 00 f0>
        callback(mapper(data));
      });
    },
    onError(callback) {
      hidDevice.on("error", callback);
    },
    setLeds(states) {
      hidDevice.write(
        [0x00, 0x00].concat(
          states.map(function (state) {
            return state ? 0xff : 0x00;
          })
        )
      );
    },
  };
};

export default Device;
