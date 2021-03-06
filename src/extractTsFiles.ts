import { processTsString } from "./processTsString";
import {
  ExtractOptions,
  DEFAULT_SUFFIX_EXTRACT,
  DEFAULT_PEFIX,
  extract,
  extractFromFolder
} from "./extract";
import * as path from "path";

export const extractTsFile = (
  filename: string,
  options?: ExtractOptions
) => {
  const suffix =
    (options && options.extension) ||
    DEFAULT_SUFFIX_EXTRACT;
  const destination = options && options.destination;
  const prefix =
    (options && options.prefix) || DEFAULT_PEFIX;

  const _baseName = path.basename(filename, ".md");

  const baseName = _baseName.startsWith(prefix)
    ? _baseName.substring(prefix.length)
    : _baseName;

  const newFilename =
    (destination || path.dirname(filename)) +
    "/" +
    baseName +
    "." +
    suffix;

  extract(filename, processTsString, newFilename);
};

export const extractTsFromFolder = (
  folderPath: string,
  options?: ExtractOptions
) => {
  extractFromFolder(folderPath, extractTsFile, options);
};
