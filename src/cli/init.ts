import { Command } from "commander";
import { writeFile, fileExists } from "../utils/file";
import { logger } from "../utils/logger";

const DEFAULT_CONFIG = {
  language: "auto",
  output: ["md", "json"],
  outDir: "./docs",
  include: ["src/**/*"],
  exclude: ["node_modules", "dist", "*.test.ts"],
  ai: {
    model: "claude-sonnet-4-20250514",
    language: "en",
  },
};

export const initCommand = new Command("init")
  .description("Create a .fastdocrc configuration file")
  .action(async () => {
    const configPath = ".fastdocrc";

    if (fileExists(configPath)) {
      logger.warn(".fastdocrc already exists — skipping.");
      return;
    }

    writeFile(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2));
    logger.success(".fastdocrc created successfully!");
    logger.info("Edit it to customize fastdoc behavior.");
    logger.info("Don't forget to set your ANTHROPIC_API_KEY environment variable.");
  });