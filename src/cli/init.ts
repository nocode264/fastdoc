import { Command } from "commander";
import { writeFile, fileExists } from "../utils/file";
import { logger } from "../utils/logger";
import * as readline from "node:readline/promises";
import process from "node:process";

const DEFAULT_CONFIG = {
  language: "auto",
  output: ["md", "json"],
  outDir: "./docs",
  include: ["src/**/*"],
  exclude: ["node_modules", "dist", "*.test.ts"],
  ai: {
    provider: "anthropic",
    model: "claude-sonnet-4-20250514",
    language: "en",
  },
};

export const initCommand = new Command("init")
  .description("Create a .fastdocrc configuration file")
  .option("--provider <name>", "AI provider: anthropic, openai, gemini")
  .option("--model <name>", "AI model name (provider-specific)")
  .action(async () => {
    const configPath = ".fastdocrc";

    if (fileExists(configPath)) {
      logger.warn(".fastdocrc already exists — skipping.");
      return;
    }

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const chosenProvider =
      ((initCommand.opts().provider as string | undefined) ??
        (await rl
          .question("Which AI provider? (anthropic/openai/gemini) [anthropic]: "))
          .trim()) || "anthropic";

    const provider = (["anthropic", "openai", "gemini"] as const).includes(
      chosenProvider as any
    )
      ? (chosenProvider as "anthropic" | "openai" | "gemini")
      : "anthropic";

    const defaultModel =
      provider === "anthropic"
        ? "claude-sonnet-4-20250514"
        : provider === "openai"
          ? "gpt-4.1-mini"
          : "gemini-2.5-flash";

    const chosenModel =
      ((initCommand.opts().model as string | undefined) ??
        (await rl.question(`Model name [${defaultModel}]: `)).trim()) ||
      defaultModel;

    rl.close();

    const cfg = {
      ...DEFAULT_CONFIG,
      ai: {
        ...DEFAULT_CONFIG.ai,
        provider,
        model: chosenModel,
      },
    };

    writeFile(configPath, JSON.stringify(cfg, null, 2));
    logger.success(".fastdocrc created successfully!");
    logger.info("Edit it to customize fastdoc behavior.");
    const envVar =
      provider === "anthropic"
        ? "ANTHROPIC_API_KEY"
        : provider === "openai"
          ? "OPENAI_API_KEY"
          : "GEMINI_API_KEY";
    logger.info(`Don't forget to set your ${envVar} environment variable.`);
  });