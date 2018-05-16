import {
  _eval,
  parseEvalLine,
  putSemi,
  getEvalued
} from "./eval";
import { readFile } from "./util";

describe("getEvalued", () => {
  test("works when there are errors", () => {
    expect(
      getEvalued("", {
        is: true,
        content: "x.length"
      })
    ).toBe("ReferenceError: x is not defined");
  });

  test("works when there are no errors", () => {
    expect(
      getEvalued("let a = 1;", { is: true, content: "a" })
    ).toBe(1);
  });
});

describe("putsemi", () => {
  test("puts if needed", () => {
    expect(putSemi("a")).toBe("a;");
  });

  test("does not put if not needed", () => {
    expect(putSemi("a;")).toBe("a;");
  });
});

describe("parseEvalLine", () => {
  test("recognizes when it is not", () => {
    expect(parseEvalLine("abc")).toMatchObject({
      is: false
    });
  });

  test("recognizes when it is and parses", () => {
    expect(
      parseEvalLine('                    eval("1+1")')
    ).toMatchObject({
      is: true,
      content: "1+1"
    });

    expect(parseEvalLine('eval("1+1");')).toMatchObject({
      is: true,
      content: "1+1"
    });

    expect(parseEvalLine('eval("1+1;")')).toMatchObject({
      is: true,
      content: "1+1;"
    });

    expect(parseEvalLine('eval("1+1")')).toMatchObject({
      is: true,
      content: "1+1"
    });
  });
});

describe("eval", () => {
  test("prints errors", () => {
    const source = readFile(
      "./src/samples/errorTypescript.md"
    );
    const final = readFile(
      "./src/samples/errorTypescript.eval.md"
    );

    expect(_eval(source)).toBe(final);
  });

  test("recognizes correct order", () => {
    const source = readFile("./src/samples/evalOrder.md");

    const final = readFile(
      "./src/samples/evalOrder.eval.md"
    );

    expect(_eval(source)).toBe(final);
  });

  test("recognizes and evals the value", () => {
    expect(_eval('eval("1+1")')).toBe("1+1; // === 2");
  });

  test("works when there is typescript", () => {
    const source = readFile(
      "./src/samples/withTypescript.md"
    );
    expect(_eval(source)).toBe(source);
  });

  test("works when there are many typescript blocks", () => {
    const source = readFile(
      "./src/samples/withManyTypescript.md"
    );

    expect(_eval(source)).toBe(source);
  });

  test("works with just markdown file", () => {
    const source = readFile(
      "./src/samples/justMarkdown.md"
    );
    expect(_eval(source)).toBe(source);
  });
});
