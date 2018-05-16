import * as fs from "fs";

export const rf = (filename: string): Promise<string> => {
  return new Promise((rs, rj) => {
    fs.readFile(filename, "utf-8", (err, data) => {
      if (err) {
        rj(err);
      } else {
        rs(data);
      }
    });
  });
};

export const safeJoin = (old: string, line: string) =>
  old !== "" ? [old, line].join("\n") : line;
