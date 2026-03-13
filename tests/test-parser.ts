import { parseFile } from "../src/parser/index";
import { readFile } from "../src/utils/file";

const filePath = "tests/fixtures/sample.ts";
const content = readFile(filePath);
const result = parseFile(filePath, content);

console.log("Language detected:", result.language);
console.log("Elements found:", result.elements.length);
console.log("---");

result.elements.forEach((el) => {
  console.log(`[${el.type.toUpperCase()}] ${el.name} (line ${el.line})`);
  console.log(`  Signature: ${el.signature}`);
  console.log("");
});