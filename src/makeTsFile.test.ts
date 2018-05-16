import { makeTsFile } from "./makeTsFile";
import { rf } from "./util";

describe("makeTsFile", () => {
  test("works when there is typescript", async () => {
    const source = await rf(
      "./src/samples/withTypescript.md"
    );
    expect(makeTsFile(source)).toBe(
      'const hello = "world";'
    );
  });

  test("works when there are many typescript blocks", async () => {
    const source = await rf(
      "./src/samples/withManyTypescript.md"
    );
    expect(makeTsFile(source)).toBe(
      'const hello = "world";\nconst hello = "world";\nconst hello = "world";'
    );
  });

  test("works with just markdown file", async () => {
    const source = await rf(
      "./src/samples/justMarkdown.md"
    );
    expect(makeTsFile(source)).toBe("");
  });

  test("comments eval line", () => {
    const source = 'eval("1");';
    expect(makeTsFile(source)).toBe("// " + source);
  });
});
