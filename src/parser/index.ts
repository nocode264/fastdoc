import { getFileExtension } from "../utils/file";
import { parseJavaScript } from "./javascript";
import { parsePHP } from "./php";
import { parseDart } from "./dart";
import { parsePython } from "./python";

export interface ParsedElement {
  type: "function" | "class" | "method" | "route" | "interface";
  name: string;
  signature: string;
  body: string;
  line: number;
}

export interface ParsedFile {
  filePath: string;
  language: string;
  elements: ParsedElement[];
  rawContent: string;
}

export function parseFile(filePath: string, content: string): ParsedFile {
  const ext = getFileExtension(filePath);

  let language = "unknown";
  let elements: ParsedElement[] = [];

  switch (ext) {
    case "js":
    case "mjs":
    case "cjs":
      language = "javascript";
      elements = parseJavaScript(content);
      break;
    case "ts":
      language = "typescript";
      elements = parseJavaScript(content); // même parser, TS est un superset
      break;
    case "php":
      language = "php";
      elements = parsePHP(content);
      break;
    case "dart":
      language = "dart";
      elements = parseDart(content);
      break;
    case "py":
      language = "python";
      elements = parsePython(content);
      break;
    default:
      language = "unknown";
  }

  return { filePath, language, elements, rawContent: content };
}