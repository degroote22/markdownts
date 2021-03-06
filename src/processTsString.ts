import { safeJoin } from "./util";

let isInsideMarkdownTSCode = false;

// Inspired by
// https://github.com/graphile/postgraphile/blob/master/examples/forum/scripts/build-schema
export const processTsString = (data: string) => {
  const result = data
    // Split our file up into all of its lines.
    .split("\n")
    // Reduce our file back so that it is just Typescript.
    .reduce((ts, line) => {
      // If we are inside some Typescript code, we want to include this code in our
      // final file.

      // If we have a line starting with eval( we will comment it so that it won't pop up errors.
      const isEvalLine = !!line.split("eval(")[1];

      if (isEvalLine) {
        return safeJoin(ts, "// " + line);
      }

      if (isInsideMarkdownTSCode) {
        // If this line closes our Typescript, do not include this line, but do
        // change our state.
        if (line === "```") {
          isInsideMarkdownTSCode = false;
          return ts;
          // return `${ts}\n`;
        }
        return safeJoin(ts, line);
      }
      // If we are not inside some Typescript code, we should just return back the
      // code so far.
      else {
        // If this line opens a block of Typescript, change our state.
        if (line === "```typescript")
          isInsideMarkdownTSCode = true;
        return ts;
      }
    }, "");

  return safeJoin(result, "");
};

export default processTsString;
