import { processTsString } from "./processTsString";
import { readFile, writeFile } from "./util";

const SUFFIX = "ts";
export const extractTsFile = (filename: string) => {
  const data = readFile(filename);
  const ts = processTsString(data);
  const newFilename =
    filename.substring(0, filename.length - 2) + SUFFIX;
  writeFile(newFilename, ts);
};
