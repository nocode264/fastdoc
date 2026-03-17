import { parseFile } from "../src/parser/index";
import { readFile } from "../src/utils/file";

const files = [
  "tests/fixtures/sample.ts",
  "tests/fixtures/sample.cjs",
  "tests/fixtures/sample.esm",
];

files.forEach((filePath) => {
  const content = readFile(filePath);
  const result = parseFile(filePath, content);

  console.log("=".repeat(50));
  console.log(`FILE     : ${filePath}`);
  console.log(`Language : ${result.language}`);
  console.log(`Elements : ${result.elements.length}`);
  console.log("─".repeat(50));

  result.elements.forEach((el) => {
    console.log(`  [${el.type.toUpperCase().padEnd(9)}] ${el.name} (line ${el.line})`);
  });

  console.log("");
});