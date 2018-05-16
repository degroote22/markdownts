import { readFile, writeFile } from "./util";
import * as path from "path";
import * as fs from "fs";

export const DEFAULT_SUFFIX_EXTRACT = "ts";
export const DEFAULT_PEFIX = "_";
export interface ExtractOptions {
  extension?: string;
  destination?: string;
  recurse?: boolean;
  prefix?: string;
  allFiles?: boolean;
}

export const extract = (
  filename: string,
  process: (data: string) => string,
  newFilename: string
) => {
  const data = readFile(filename);
  const newData = process(data);
  writeFile(newFilename, newData);
};

export const extractFromFolder = (
  folderPath: string,
  extractFile: (p: string, o?: ExtractOptions) => void,
  options?: ExtractOptions
) => {
  const extension =
    (options && options.extension) ||
    DEFAULT_SUFFIX_EXTRACT;
  const prefix =
    (options && options.prefix) || DEFAULT_PEFIX;
  const destination = options && options.destination;

  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach(file => {
      var curPath = folderPath + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        if (options && options.recurse) {
          extractFromFolder(curPath, extractFile, options);
        }
      } else {
        if (
          (options && options.allFiles) ||
          path.basename(curPath, ".md").startsWith(prefix)
        ) {
          extractFile(curPath, {
            extension,
            destination,
            prefix
          });
        }
      }
    });
  }
};
