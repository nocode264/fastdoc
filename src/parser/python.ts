import { ParsedElement } from "./index";

export function parsePython(content: string): ParsedElement[] {
  const elements: ParsedElement[] = [];
  const lines = content.split("\n");

  const funcRegex = /^(?:async\s+)?def\s+(\w+)\s*\(([^)]*)\)\s*(?:->\s*\w+\s*)?:/;
  const classRegex = /^class\s+(\w+)/;

  lines.forEach((line, index) => {
    const classMatch = line.match(classRegex);
    if (classMatch) {
      elements.push({
        type: "class",
        name: classMatch[1],
        signature: `class ${classMatch[1]}`,
        body: extractPythonBlock(lines, index),
        line: index + 1,
      });
      return;
    }

    const funcMatch = line.match(funcRegex);
    if (funcMatch) {
      elements.push({
        type: "function",
        name: funcMatch[1],
        signature: `def ${funcMatch[1]}(${funcMatch[2]})`,
        body: extractPythonBlock(lines, index),
        line: index + 1,
      });
    }
  });

  return elements;
}

function extractPythonBlock(lines: string[], startIndex: number): string {
  const block: string[] = [lines[startIndex]];
  const baseIndent = lines[startIndex].match(/^(\s*)/)?.[1].length ?? 0;

  for (let i = startIndex + 1; i < Math.min(startIndex + 50, lines.length); i++) {
    const line = lines[i];
    if (line.trim() === "") { block.push(line); continue; }

    const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
    if (indent <= baseIndent) break;

    block.push(line);
  }

  return block.join("\n");
}