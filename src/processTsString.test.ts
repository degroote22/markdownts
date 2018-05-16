import { processTsString } from "./processTsString";
import { readFile } from "./util";

describe("processTsString", () => {
  test("works when there is typescript", () => {
    const source = readFile(
      "./src/samples/withTypescript.md"
    );
    expect(processTsString(source)).toBe(
      'const hello = "world";\n'
    );
  });

  test("works when there are many typescript blocks", () => {
    const source = readFile(
      "./src/samples/withManyTypescript.md"
    );
    const final = readFile(
      "./src/samples/withManyTypescript.ts"
    );

    expect(processTsString(source)).toBe(final);
  });

  test("works with just markdown file", () => {
    const source = readFile(
      "./src/samples/justMarkdown.md"
    );
    expect(processTsString(source)).toBe("");
  });

  test("comments eval line", () => {
    const source = 'eval("1");';
    expect(processTsString(source)).toBe(
      "// " + source + "\n"
    );
  });
});
