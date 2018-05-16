import { safeJoin } from "./util";
import * as ts from "typescript";

let isInsideMarkdownTSCode = false;

interface Transport {
  ts: string;
  md: string;
}

interface parseIs {
  is: true;
  content: string;
}

interface parseIsnt {
  is: false;
}

type ParseResult = parseIs | parseIsnt;

export const parseEvalLine = (
  line: string
): ParseResult => {
  const afterEval = line.split("eval(")[1];
  const isEvalLine = !!afterEval;

  if (isEvalLine) {
    const afterEndsWithSemi =
      afterEval[afterEval.length - 1] === ";";
    const cleanEvalWithQuotes = afterEndsWithSemi
      ? afterEval.substring(0, afterEval.length - 2)
      : afterEval.substring(0, afterEval.length - 1);

    const cleanEval = cleanEvalWithQuotes.substring(
      1,
      cleanEvalWithQuotes.length - 1
    );

    return { is: true, content: cleanEval };
  }

  return {
    is: false
  };
};

export const putSemi = (s: string) => {
  const endsWithSemi = s[s.length - 1] === ";";

  return endsWithSemi ? s : s + ";";
};

export const getEvalued = (
  _ts: string,
  parsed: parseIs
) => {
  try {
    const source = safeJoin(
      _ts,
      `eval(\`${parsed.content}\`);`
    );
    let js = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS
      }
    }).outputText;
    return eval(js);
  } catch (err) {
    return String(err);
  }
};

// Inspired by
// https://github.com/graphile/postgraphile/blob/master/examples/forum/scripts/build-schema
export const _eval = (data: string) => {
  return (
    data
      // Split our file up into all of its lines.
      .split("\n")
      // Reduce our file back so that it is just Typescript.
      .reduce(
        (curr: Transport, line: string): Transport => {
          // If we are inside some Typescript code, we want to include this code in our
          // final file.

          // If we have a line starting with eval( we will comment it so that it won't pop up errors.
          const parsed = parseEvalLine(line);
          if (parsed.is) {
            let evalued = getEvalued(curr.ts, parsed);

            const newLine = `${putSemi(
              parsed.content
            )} // === ${evalued}`;

            return {
              ts: curr.ts,
              md: safeJoin(curr.md, newLine)
            };
          }

          if (isInsideMarkdownTSCode) {
            // If this line closes our Typescript, do not include this line, but do
            // change our state.
            if (line === "```") {
              isInsideMarkdownTSCode = false;
              return {
                ts: curr.ts,
                md: safeJoin(curr.md, line)
              };
            }

            return {
              ts: safeJoin(curr.ts, line),
              md: safeJoin(curr.md, line)
            };
          }
          // If we are not inside some Typescript code, we should just return back the
          // code so far.
          else {
            // If this line opens a block of Typescript, change our state.
            if (line === "```typescript") {
              isInsideMarkdownTSCode = true;
            }

            return {
              ts: curr.ts,
              md: safeJoin(curr.md, line)
            };
          }
        },
        { ts: "", md: "" }
      ).md
  );
};

export default _eval;
