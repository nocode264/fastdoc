import { ParsedElement } from "./index";

// ─── ESModule patterns ───────────────────────────────────────────────────────
const ESM_FUNC        = /^(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)/;
const ESM_ARROW       = /^(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\(([^)]*)\)\s*(?::\s*[\w<>\[\]|&]+\s*)?=>/;
const ESM_ARROW_SHORT = /^(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?(\w+)\s*=>/;
const ESM_CLASS       = /^(?:export\s+)?(?:default\s+)?(?:abstract\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?/;
const ESM_INTERFACE   = /^(?:export\s+)?interface\s+(\w+)/;
const ESM_TYPE        = /^(?:export\s+)?type\s+(\w+)\s*=/;
const ESM_DEFAULT_FN  = /^export\s+default\s+(?:async\s+)?function\s*\(([^)]*)\)/;

// ─── CommonJS patterns ───────────────────────────────────────────────────────
const CJS_EXPORTS_FN      = /^(?:module\.)?exports\.(\w+)\s*=\s*(?:async\s+)?function\s*\(([^)]*)\)/;
const CJS_EXPORTS_ARROW   = /^(?:module\.)?exports\.(\w+)\s*=\s*(?:async\s+)?\(([^)]*)\)\s*=>/;
const CJS_MODULE_EXPORTS  = /^module\.exports\s*=\s*\{/;
const CJS_FUNC            = /^(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)/;
const CJS_VAR_FUNC        = /^(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?function\s*\(([^)]*)\)/;

// ─── Méthodes dans une classe ─────────────────────────────────────────────────
const METHOD_REGEX = /^\s+(?:(?:public|private|protected|static|async|override|readonly)\s+)*(\w+)\s*\(([^)]*)\)\s*(?::\s*[\w<>\[\]|&]+\s*)?\{/;

// ─── Décorateurs NestJS / Angular ─────────────────────────────────────────────
const DECORATOR_REGEX = /^\s*@(\w+)\s*\(?/;

// ─── Mots-clés à exclure des méthodes ────────────────────────────────────────
const KEYWORDS = new Set(["if", "else", "for", "while", "switch", "try", "catch", "finally", "do", "return", "constructor"]);

export function parseJavaScript(content: string): ParsedElement[] {
  const elements: ParsedElement[] = [];
  const lines = content.split("\n");

  let insideClass = false;
  let classDepth = 0;
  let currentDecorator = "";

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("*")) return;

    // ── Décorateurs ──────────────────────────────────────────────────────────
    const decoratorMatch = trimmed.match(DECORATOR_REGEX);
    if (decoratorMatch) {
      currentDecorator = decoratorMatch[1];
      return;
    }

    // ── ESModule : export default function anonyme ───────────────────────────
    const esmDefaultFn = trimmed.match(ESM_DEFAULT_FN);
    if (esmDefaultFn) {
      elements.push({
        type: "function",
        name: "default",
        signature: `export default function(${esmDefaultFn[1]})`,
        body: extractBlock(lines, index),
        line: index + 1,
      });
      currentDecorator = "";
      return;
    }

    // ── ESModule : function classique ────────────────────────────────────────
    const esmFunc = trimmed.match(ESM_FUNC);
    if (esmFunc) {
      elements.push({
        type: "function",
        name: esmFunc[1],
        signature: `function ${esmFunc[1]}(${esmFunc[2]})`,
        body: extractBlock(lines, index),
        line: index + 1,
      });
      currentDecorator = "";
      return;
    }

    // ── ESModule : arrow function ────────────────────────────────────────────
    const esmArrow = trimmed.match(ESM_ARROW);
    if (esmArrow) {
      elements.push({
        type: "function",
        name: esmArrow[1],
        signature: `${esmArrow[1]}(${esmArrow[2]})`,
        body: extractBlock(lines, index),
        line: index + 1,
      });
      currentDecorator = "";
      return;
    }

    // ── ESModule : arrow function courte (x => ...) ──────────────────────────
    const esmArrowShort = trimmed.match(ESM_ARROW_SHORT);
    if (esmArrowShort) {
      elements.push({
        type: "function",
        name: esmArrowShort[1],
        signature: `${esmArrowShort[1]}(${esmArrowShort[2]})`,
        body: trimmed,
        line: index + 1,
      });
      currentDecorator = "";
      return;
    }

    // ── ESModule : classe ────────────────────────────────────────────────────
    const esmClass = trimmed.match(ESM_CLASS);
    if (esmClass) {
      insideClass = true;
      classDepth = 0;
      elements.push({
        type: "class",
        name: esmClass[1],
        signature: esmClass[2]
          ? `class ${esmClass[1]} extends ${esmClass[2]}`
          : `class ${esmClass[1]}`,
        body: extractBlock(lines, index),
        line: index + 1,
      });
      currentDecorator = "";
      return;
    }

    // ── ESModule : interface TypeScript ──────────────────────────────────────
    const esmInterface = trimmed.match(ESM_INTERFACE);
    if (esmInterface) {
      elements.push({
        type: "interface",
        name: esmInterface[1],
        signature: `interface ${esmInterface[1]}`,
        body: extractBlock(lines, index),
        line: index + 1,
      });
      currentDecorator = "";
      return;
    }

    // ── ESModule : type TypeScript ───────────────────────────────────────────
    const esmType = trimmed.match(ESM_TYPE);
    if (esmType) {
      elements.push({
        type: "interface",
        name: esmType[1],
        signature: `type ${esmType[1]}`,
        body: trimmed,
        line: index + 1,
      });
      currentDecorator = "";
      return;
    }

    // ── CommonJS : exports.fn = function(){} ─────────────────────────────────
    const cjsExportsFn = trimmed.match(CJS_EXPORTS_FN);
    if (cjsExportsFn) {
      elements.push({
        type: "function",
        name: cjsExportsFn[1],
        signature: `exports.${cjsExportsFn[1]}(${cjsExportsFn[2]})`,
        body: extractBlock(lines, index),
        line: index + 1,
      });
      currentDecorator = "";
      return;
    }

    // ── CommonJS : exports.fn = () => {} ─────────────────────────────────────
    const cjsExportsArrow = trimmed.match(CJS_EXPORTS_ARROW);
    if (cjsExportsArrow) {
      elements.push({
        type: "function",
        name: cjsExportsArrow[1],
        signature: `exports.${cjsExportsArrow[1]}(${cjsExportsArrow[2]})`,
        body: extractBlock(lines, index),
        line: index + 1,
      });
      currentDecorator = "";
      return;
    }

    // ── CommonJS : module.exports = { ... } ──────────────────────────────────
    trimmed.match(CJS_MODULE_EXPORTS);

    // ── CommonJS : var fn = function(){} ─────────────────────────────────────
    const cjsVarFunc = trimmed.match(CJS_VAR_FUNC);
    if (cjsVarFunc) {
      elements.push({
        type: "function",
        name: cjsVarFunc[1],
        signature: `${cjsVarFunc[1]}(${cjsVarFunc[2]})`,
        body: extractBlock(lines, index),
        line: index + 1,
      });
      currentDecorator = "";
      return;
    }

    // ── CommonJS : function maFonction(){} ───────────────────────────────────
    const cjsFunc = trimmed.match(CJS_FUNC);
    if (cjsFunc) {
      elements.push({
        type: "function",
        name: cjsFunc[1],
        signature: `function ${cjsFunc[1]}(${cjsFunc[2]})`,
        body: extractBlock(lines, index),
        line: index + 1,
      });
      currentDecorator = "";
      return;
    }

    // ── Méthodes dans une classe ─────────────────────────────────────────────
    if (insideClass) {
      const isClassDeclaration = trimmed.match(ESM_CLASS);
      if (!isClassDeclaration) {
        for (const char of trimmed) {
          if (char === "{") classDepth++;
          if (char === "}") classDepth--;
        }
        if (classDepth < 0) {
          insideClass = false;
          classDepth = 0;
          return;
        }
      }

      const methodMatch = line.match(METHOD_REGEX);
      if (methodMatch && !KEYWORDS.has(methodMatch[1])) {
        elements.push({
          type: "method",
          name: methodMatch[1],
          signature: `${methodMatch[1]}(${methodMatch[2]})`,
          body: extractBlock(lines, index),
          line: index + 1,
        });
        currentDecorator = "";
      }
    }
  });

  return elements;
}

function extractBlock(lines: string[], startIndex: number): string {
  const block: string[] = [];
  let depth = 0;
  let started = false;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    block.push(line);

    for (const char of line) {
      if (char === "{") { depth++; started = true; }
      if (char === "}") depth--;
    }

    if (started && depth === 0) break;
    if (block.length > 200) break;
  }

  return block.join("\n");
}