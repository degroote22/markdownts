import * as fs from "fs";

export const readFile = (filename: string): string => {
  return fs.readFileSync(filename, "utf-8");
  // return new Promise((rs, rj) => {
  //   fs.readFile(filename, "utf-8", (err, data) => {
  //     if (err) {
  //       rj(err);
  //     } else {
  //       rs(data);
  //     }
  //   });
  // });
};

export const writeFile = (
  filename: string,
  data: string
) => {
  fs.writeFileSync(filename, data, "utf-8");
};

export const safeJoin = (old: string, line: string) =>
  old !== "" ? [old, line].join("\n") : line;
