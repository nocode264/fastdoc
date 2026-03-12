import { Command } from "commander";
import console from "node:console";

export const generateCommand = new Command("generate")
  .description("Analyze source code and generate documentation")
  .option("-f, --file <path>", "Generate docs for a single file")
  .option("-l, --lang <lang>", "Force language detection (js, ts, php, dart, py)")
  .option("-o, --output <format>", "Output format: md, json, all", "md")
  .option("-d, --out-dir <path>", "Output directory", "./docs")
  .action(async (options) => {
    console.log("⚡ fastdoc — generating documentation...");
    console.log("Options:", options);
    // TODO: implementation coming next
  });