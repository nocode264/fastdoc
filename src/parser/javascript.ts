import { ParsedElement } from "./index";

export function parseJavaScript(content: string): ParsedElement[] {
  const elements: ParsedElement[] = [];
  const lines = content.split("\n");

  // Fonctions classiques et arrow functions exportées
  const funcRegex =
    /^(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)/;
  const arrowRegex =
    /^(?:export\s+)?(?:const|let)\s+(\w+)\s*=\s*(?:async\s+)?\(([^)]*)\)\s*=>/;

  // Classes
  const classRegex = /^(?:export\s+)?class\s+(\w+)/;

  // Méthodes dans une classe
  const methodRegex = /^\s+(?:async\s+)?(\w+)\s*\(([^)]*)\)\s*[:{]/;

  // Interfaces TypeScript
  const interfaceRegex = /^(?:export\s+)?interface\s+(\w+)/;

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    const funcMatch = trimmed.match(funcRegex);
    if (funcMatch) {
      elements.push({
        type: "function",
        name: funcMatch[1],
        signature: `function ${funcMatch[1]}(${funcMatch[2]})`,
        body: extractBlock(lines, index),
        line: index + 1,
      });
      return;
    }

    const arrowMatch = trimmed.match(arrowRegex);
    if (arrowMatch) {
      elements.push({
        type: "function",
        name: arrowMatch[1],
        signature: `${arrowMatch[1]}(${arrowMatch[2]})`,
        body: extractBlock(lines, index),
        line: index + 1,
      });
      return;
    }

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

    const interfaceMatch = trimmed.match(interfaceRegex);
    if (interfaceMatch) {
      elements.push({
        type: "interface",
        name: interfaceMatch[1],
        signature: `interface ${interfaceMatch[1]}`,
        body: extractBlock(lines, index),
        line: index + 1,
      });
      return;
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