import {
  evalMarkdownFile,
  evalMarkdownFromFolder
} from "./evalMarkdown";
import * as fs from "fs";
import {
  writeFile,
  readFile,
  deleteFolderRecursive
} from "./util";

const dir = "./tmp-evals";
beforeAll(() => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
});

afterAll(() => {
  deleteFolderRecursive(dir);
});

const ORIGINAL = "./src/samples/errorTypescript.md";
const RESULT = "./src/samples/errorTypescript.eval.md";
describe("extractFromFolder", () => {
  test("it works on a single level", () => {
    const fileNameBefore = dir + "/_f1.md";
    const fileNameAfter = dir + "/f1.md";
    const subDir = dir + "/f1";
    fs.mkdirSync(subDir);
    const fileNameBefore2Level = subDir + "/_f1.md";
    const fileNameAfter2Level = subDir + "/f1.md";

    writeFile(fileNameBefore, readFile(ORIGINAL));
    writeFile(fileNameBefore2Level, readFile(ORIGINAL));
    evalMarkdownFromFolder(dir, { recurse: false });

    expect(readFile(fileNameAfter)).toBe(readFile(RESULT));

    expect(() => readFile(fileNameAfter2Level)).toThrow();
  });

  test("it works on multiple levels", () => {
    const fileNameBefore = dir + "/_f3.md";
    const fileNameAfter = dir + "/f3.md";
    const subDir = dir + "/f4";
    fs.mkdirSync(subDir);
    const fileNameBefore2Level = subDir + "/_f3.md";
    const fileNameAfter2Level = subDir + "/f3.md";

    writeFile(fileNameBefore, readFile(ORIGINAL));
    writeFile(fileNameBefore2Level, readFile(ORIGINAL));
    evalMarkdownFromFolder(dir, { recurse: true });

    expect(readFile(fileNameAfter)).toBe(readFile(RESULT));
    expect(readFile(fileNameAfter2Level)).toBe(
      readFile(RESULT)
    );
  });

  test("it works on multiple levels with all files", () => {
    const fileNameBefore = dir + "/f5.md";
    const fileNameAfter = dir + "/f5.eval.md";
    const subDir = dir + "/f6";
    fs.mkdirSync(subDir);
    const fileNameBefore2Level = subDir + "/f5.md";
    const fileNameAfter2Level = subDir + "/f5.eval.md";

    writeFile(fileNameBefore, readFile(ORIGINAL));
    writeFile(fileNameBefore2Level, readFile(ORIGINAL));
    evalMarkdownFromFolder(dir, {
      recurse: true,
      allFiles: true
    });

    expect(readFile(fileNameAfter)).toBe(readFile(RESULT));
    expect(readFile(fileNameAfter2Level)).toBe(
      readFile(RESULT)
    );
  });
});

describe("evalMarkdownFile", () => {
  test("it works with md files", () => {
    const fileNameBefore = dir + "/_s1.md";
    const fileNameAfter = dir + "/s1.md";
    writeFile(fileNameBefore, readFile(ORIGINAL));
    evalMarkdownFile(fileNameBefore);
    expect(readFile(fileNameAfter)).toBe(readFile(RESULT));
  });

  test("it works with custom directory files", () => {
    const newFolder = "/_customdir_";
    const fileNameBefore = dir + "/_s3.md";
    const fileNameAfter = dir + newFolder + "/s3.md";
    writeFile(fileNameBefore, readFile(ORIGINAL));
    fs.mkdirSync(dir + newFolder);
    evalMarkdownFile(fileNameBefore, {
      destination: dir + newFolder
    });
    expect(readFile(fileNameAfter)).toBe(readFile(RESULT));
  });
});
