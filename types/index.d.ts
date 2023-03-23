import { IBuzzer } from "./types";
declare const buzzer: (
  singleMode: boolean,
  reduceSetLeds: boolean
) => IBuzzer | IBuzzer[];
export default buzzer;
