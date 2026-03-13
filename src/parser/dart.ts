import { ParsedElement } from "./index";

export function parseDart(content: string): ParsedElement[] {
  const elements: ParsedElement[] = [];
  const lines = content.split("\n");

  const funcRegex = /^(?:Future|void|String|int|double|bool|List|Map|dynamic|\w+)\s+(\w+)\s*\(([^)]*)\)\s*(?:async\s*)?\{/;
  const classRegex = /^(?:abstract\s+)?class\s+(\w+)/;

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    const classMatch = trimmed.match(classRegex);
    if (classMatch) {
      elements.push({
        type: "class",
        name: classMatch[1],
        signature: `class ${classMatch[1]}`,
        body: extractBlock(lines, index),
        line: index + 1,
      });
      return;
    }

    const funcMatch = trimmed.match(funcRegex);
    if (funcMatch) {
      elements.push({
        type: "function",
        name: funcMatch[1],
        signature: `${funcMatch[1]}(${funcMatch[2]})`,
        body: extractBlock(lines, index),
        line: index + 1,
      });
    }
  });

  return elements;
}

function extractBlock(lines: string[], startIndex: number): string {
  const block: string[] = [];
  let depth = 0;
  let started = false;

  for (let i = startIndex; i < Math.min(startIndex + 50, lines.length); i++) {
    const line = lines[i];
    block.push(line);

    for (const char of line) {
      if (char === "{") { depth++; started = true; }
      if (char === "}") depth--;
    }

    if (started && depth === 0) break;
  }

  return block.join("\n");
}