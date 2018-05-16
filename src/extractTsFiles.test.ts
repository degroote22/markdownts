import { extractTsFile } from "./extractTsFiles";
import * as fs from "fs";
import { writeFile, readFile } from "./util";

const dir = "./tmp-extracts";
beforeAll(() => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
});

afterAll(() => {
  if (fs.existsSync(dir)) {
    fs.rmdirSync(dir);
  }
});

describe("extractTsFile", () => {
  test("it works", () => {
    const fileNameBefore = dir + "/1.md";
    const fileNameAfter = dir + "/1.ts";
    writeFile(
      fileNameBefore,
      readFile("./src/samples/withManyTypescript.md")
    );
    extractTsFile(fileNameBefore);
    expect(readFile(fileNameAfter)).toBe(
      readFile("./src/samples/withManyTypescript.ts")
    );
  });
});
