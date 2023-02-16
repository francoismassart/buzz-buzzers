import { DataMapper, DataMapperMaker } from "../types";
import { mappings } from "./mappings";

// Generate powers of two array
const powerOfTwo: number[] = [];
for (let i = 0; i < 32; i++) {
  powerOfTwo[i] = Math.pow(2, i);
}

/**
 * Read a single byte value (e.g. 0, 8, 240...)
 * @param byte {number}
 * @returns An array of 8 booleans
 */
function readByte(byte: number): boolean[] {
  const result = [false, false, false, false, false, false, false, false];
  for (let i = 7; i >= 0; i--) {
    if (byte & powerOfTwo[i]) {
      result[7 - i] = true;
    }
  }
  return result;
}

/**
 * Converts a Buffer into an array of array of booleans
 * @param byteArray {Buffer} e.g. <Buffer 00 00 00 00 f0>
 * @returns An array with 5 arrays of 8 booleans (5 x 8 = 40)
 */
function bufferToBooleans(byteArray: Buffer): boolean[][] {
  return Array.from(byteArray).map((byte) => readByte(byte));
}

const mapDeviceDataToPressedButtons: DataMapperMaker = () => {
  /**
   * Helper function to convert Buffer data using buzzer mappings
   * @returns an array of 20 booleans (5 buttons x 4 buzzers)
   */
  const callbackMapper: DataMapper = (pressedBuffer: Buffer): boolean[] => {
    const bytes = bufferToBooleans(pressedBuffer);
    return mappings.map((btn) => Boolean(bytes[btn.bytes[0]][btn.bytes[1]]));
  };
  return callbackMapper;
};

export default mapDeviceDataToPressedButtons;
