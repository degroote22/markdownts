import {
  extractTsFile,
  extractTsFromFolder
} from "./extractTsFiles";
import * as fs from "fs";
import {
  writeFile,
  readFile,
  deleteFolderRecursive
} from "./util";

const dir = "./tmp-extracts";
beforeAll(() => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
});

afterAll(() => {
  deleteFolderRecursive(dir);
});

describe("extractFromFolder", () => {
  test("it works on a single level", () => {
    const fileNameBefore = dir + "/_f1.md";
    const fileNameAfter = dir + "/f1.ts";
    const subDir = dir + "/f1";
    fs.mkdirSync(subDir);
    const fileNameBefore2Level = subDir + "/_f1.md";
    const fileNameAfter2Level = subDir + "/f1.ts";

    writeFile(
      fileNameBefore,
      readFile("./src/samples/withManyTypescript.md")
    );
    writeFile(
      fileNameBefore2Level,
      readFile("./src/samples/withManyTypescript.md")
    );
    extractTsFromFolder(dir, { recurse: false });

    expect(readFile(fileNameAfter)).toBe(
      readFile("./src/samples/withManyTypescript.ts")
    );

    expect(() => readFile(fileNameAfter2Level)).toThrow();
  });

  test("it works on multiple levels", () => {
    const fileNameBefore = dir + "/_f3.md";
    const fileNameAfter = dir + "/f3.ts";
    const subDir = dir + "/f4";
    fs.mkdirSync(subDir);
    const fileNameBefore2Level = subDir + "/_f3.md";
    const fileNameAfter2Level = subDir + "/f3.ts";

    writeFile(
      fileNameBefore,
      readFile("./src/samples/withManyTypescript.md")
    );
    writeFile(
      fileNameBefore2Level,
      readFile("./src/samples/withManyTypescript.md")
    );
    extractTsFromFolder(dir, { recurse: true });

    expect(readFile(fileNameAfter)).toBe(
      readFile("./src/samples/withManyTypescript.ts")
    );
    expect(readFile(fileNameAfter2Level)).toBe(
      readFile("./src/samples/withManyTypescript.ts")
    );
  });

  test("it works on multiple levels with allfiles", () => {
    const fileNameBefore = dir + "/f5.md";
    const fileNameAfter = dir + "/f5.ts";
    const subDir = dir + "/f6";
    fs.mkdirSync(subDir);
    const fileNameBefore2Level = subDir + "/f5.md";
    const fileNameAfter2Level = subDir + "/f5.ts";

    writeFile(
      fileNameBefore,
      readFile("./src/samples/withManyTypescript.md")
    );
    writeFile(
      fileNameBefore2Level,
      readFile("./src/samples/withManyTypescript.md")
    );
    extractTsFromFolder(dir, {
      recurse: true,
      allFiles: true
    });

    expect(readFile(fileNameAfter)).toBe(
      readFile("./src/samples/withManyTypescript.ts")
    );
    expect(readFile(fileNameAfter2Level)).toBe(
      readFile("./src/samples/withManyTypescript.ts")
    );
  });
});

describe("extractTsFile", () => {
  test("it works with ts files", () => {
    const fileNameBefore = dir + "/s1.md";
    const fileNameAfter = dir + "/s1.ts";
    writeFile(
      fileNameBefore,
      readFile("./src/samples/withManyTypescript.md")
    );
    extractTsFile(fileNameBefore);
    expect(readFile(fileNameAfter)).toBe(
      readFile("./src/samples/withManyTypescript.ts")
    );
  });

  test("it works with custom suffix", () => {
    const fileNameBefore = dir + "/s2.md";
    const fileNameAfter = dir + "/s2.tsx";
    writeFile(
      fileNameBefore,
      readFile("./src/samples/withManyTypescript.md")
    );
    extractTsFile(fileNameBefore, { extension: "tsx" });
    expect(readFile(fileNameAfter)).toBe(
      readFile("./src/samples/withManyTypescript.ts")
    );
  });

  test("it works with custom directory files", () => {
    const newFolder = "/_customdir_";
    const fileNameBefore = dir + "/s3.md";
    const fileNameAfter = dir + newFolder + "/s3.ts";
    writeFile(
      fileNameBefore,
      readFile("./src/samples/withManyTypescript.md")
    );
    fs.mkdirSync(dir + newFolder);
    extractTsFile(fileNameBefore, {
      destination: dir + newFolder
    });
    expect(readFile(fileNameAfter)).toBe(
      readFile("./src/samples/withManyTypescript.ts")
    );
  });
});
