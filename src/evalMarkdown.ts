import {
  ExtractOptions,
  DEFAULT_PEFIX,
  extract,
  extractFromFolder
} from "./extract";
import * as path from "path";
import _eval from "./eval";

export const evalMarkdownFile = (
  filename: string,
  options?: ExtractOptions
) => {
  const destination = options && options.destination;
  const prefix =
    (options && options.prefix) || DEFAULT_PEFIX;

  const _baseName = path.basename(filename, ".md");

  const baseName = _baseName.startsWith(prefix)
    ? _baseName.substring(prefix.length)
    : _baseName + ".eval";

  const newFilename =
    (destination || path.dirname(filename)) +
    "/" +
    baseName +
    ".md";

  extract(filename, _eval, newFilename);
};

export const evalMarkdownFromFolder = (
  folderPath: string,
  options?: ExtractOptions
) => {
  extractFromFolder(folderPath, evalMarkdownFile, options);
};
