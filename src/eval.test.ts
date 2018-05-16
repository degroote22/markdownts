import { _eval, parseEvalLine } from "./eval";
import { rf } from "./util";

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

    expect(parseEvalLine('eval("1+1")')).toMatchObject({
      is: true,
      content: "1+1"
    });
  });
});

describe("eval", () => {
  test("recognizes correct order", async () => {
    const source = await rf("./src/samples/evalOrder.md");

    expect(_eval(source)).toMatchSnapshot();
  });

  test("recognizes and evals the value", () => {
    expect(_eval('eval("1+1")')).toBe("1+1 // === 2");
  });

  test("works when there is typescript", async () => {
    const source = await rf(
      "./src/samples/withTypescript.md"
    );
    expect(_eval(source)).toBe(source);
  });

  test("works when there are many typescript blocks", async () => {
    const source = await rf(
      "./src/samples/withManyTypescript.md"
    );

    expect(_eval(source)).toBe(source);
  });

  test("works with just markdown file", async () => {
    const source = await rf(
      "./src/samples/justMarkdown.md"
    );
    expect(_eval(source)).toBe(source);
  });
});
