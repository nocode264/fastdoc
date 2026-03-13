import { ParsedElement } from "./index";

export function parsePHP(content: string): ParsedElement[] {
  const elements: ParsedElement[] = [];
  const lines = content.split("\n");

  const funcRegex = /(?:public|private|protected)?\s*(?:static\s+)?function\s+(\w+)\s*\(([^)]*)\)/;
  const classRegex = /^(?:abstract\s+)?class\s+(\w+)/;
  const routeRegex = /Route::(get|post|put|patch|delete)\s*\(\s*['"]([^'"]+)['"]/;

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    const funcMatch = trimmed.match(funcRegex);
    if (funcMatch) {
      elements.push({
        type: "function",
        name: funcMatch[1],
        signature: `function ${funcMatch[1]}(${funcMatch[2]})`,
        body: extractPHPBlock(lines, index),
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
        body: extractPHPBlock(lines, index),
        line: index + 1,
      });
      return;
    }

    const routeMatch = trimmed.match(routeRegex);
    if (routeMatch) {
      elements.push({
        type: "route",
        name: `${routeMatch[1].toUpperCase()} ${routeMatch[2]}`,
        signature: `Route::${routeMatch[1]}('${routeMatch[2]}')`,
        body: trimmed,
        line: index + 1,
      });
    }
  });

  return elements;
}

function extractPHPBlock(lines: string[], startIndex: number): string {
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