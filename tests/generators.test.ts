import { describe, it, expect, afterEach } from "vitest";
import { generateMarkdown } from "../src/generators/markdown";
import { generateJSON } from "../src/generators/json";
import { DocumentedFile } from "../src/ai/client";
import * as fs from "fs";
import * as path from "path";

const mockDocumented: DocumentedFile = {
  file: "tests/fixtures/sample.ts",
  language: "typescript",
  description: "A sample file for testing",
  elements: [
    {
      type: "function",
      name: "hello",
      description: "Says hello to someone",
      signature: "function hello(name: string): string",
      parameters: [{ name: "name", type: "string", description: "The name" }],
      returns: { type: "string", description: "Greeting message" },
      example: 'hello("World"); // → "Hello World"',
      warnings: "",
    },
  ],
};

const TEST_OUT_DIR = "./docs-test";

afterEach(() => {
  if (fs.existsSync(TEST_OUT_DIR)) {
    fs.rmSync(TEST_OUT_DIR, { recursive: true });
  }
});

describe("Generator — Markdown", () => {
  it("creates a markdown file", () => {
    const outPath = generateMarkdown(mockDocumented, TEST_OUT_DIR, "sample.ts");
    expect(fs.existsSync(outPath)).toBe(true);
  });

  it("markdown contains function name", () => {
    const outPath = generateMarkdown(mockDocumented, TEST_OUT_DIR, "sample.ts");
    const content = fs.readFileSync(outPath, "utf-8");
    expect(content).toContain("hello");
  });

  it("markdown contains parameters table", () => {
    const outPath = generateMarkdown(mockDocumented, TEST_OUT_DIR, "sample.ts");
    const content = fs.readFileSync(outPath, "utf-8");
    expect(content).toContain("| `name` |");
  });

  it("markdown contains example", () => {
    const outPath = generateMarkdown(mockDocumented, TEST_OUT_DIR, "sample.ts");
    const content = fs.readFileSync(outPath, "utf-8");
    expect(content).toContain("Hello World");
  });
});

describe("Generator — JSON", () => {
  it("creates a json file", () => {
    const outPath = generateJSON(mockDocumented, TEST_OUT_DIR, "sample.ts");
    expect(fs.existsSync(outPath)).toBe(true);
  });

  it("json contains generatedBy field", () => {
    const outPath = generateJSON(mockDocumented, TEST_OUT_DIR, "sample.ts");
    const content = JSON.parse(fs.readFileSync(outPath, "utf-8"));
    expect(content.generatedBy).toBe("fastdoc");
  });

  it("json contains elements array", () => {
    const outPath = generateJSON(mockDocumented, TEST_OUT_DIR, "sample.ts");
    const content = JSON.parse(fs.readFileSync(outPath, "utf-8"));
    expect(content.elements).toHaveLength(1);
    expect(content.elements[0].name).toBe("hello");
  });
});