import { safeJoin } from "./util";

describe("safejoin", () => {
  test("if start is empty, dont add new line", () => {
    expect(safeJoin("", "abc")).toBe("abc");
  });

  test("if start is not empty, add new line", () => {
    expect(safeJoin("abc", "def")).toBe("abc\ndef");
  });
});
