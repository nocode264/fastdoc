import { Command } from "commander";
import { loadConfig } from "../config/index";
import { parseFile } from "../parser/index";
import { generateDocumentation } from "../ai/client";
import { generateMarkdown } from "../generators/markdown";
import { generateJSON } from "../generators/json";
import { readFile, fileExists } from "../utils/file";
import { logger } from "../utils/logger";
import * as path from "path";
import * as fs from "fs";
import { withRateLimit } from "../utils/ratelimit";


export const generateCommand = new Command("generate")
  .description("Analyze source code and generate documentation")
  .option("-f, --file <path>", "Generate docs for a single file")
  .option("-l, --lang <lang>", "Force language detection (js, ts, php, dart, py)")
  .option("-o, --output <format>", "Output format: md, json, all", "md")
  .option("-d, --out-dir <path>", "Output directory", "./docs")
  .action(async (options) => {
    const config = loadConfig();
    const outDir = options.outDir ?? config.outDir;
    const outputFormat = options.output ?? config.output[0];
    const aiLanguage = config.ai.language;

    logger.step("fastdoc — starting documentation generation...");

    // Récupère les fichiers à analyser
    const files = options.file
      ? [validateAndResolveInputFile(options.file)]
      : getProjectFiles(config.include, config.exclude);

    if (files.length === 0) {
      logger.warn("No files found to document.");
      return;
    }

    logger.info(`Found ${files.length} file(s) to document.`);

    let successCount = 0;

    for (const filePath of files) {
      if (!fileExists(filePath)) {
        logger.warn(`File not found: ${filePath}`);
        continue;
      }

      try {
        const content = readFile(filePath);
        const parsed = parseFile(filePath, content);

        if (parsed.language === "unknown") {
          logger.warn(`Unsupported file: ${filePath} — skipping.`);
          continue;
        }

        if (parsed.elements.length === 0) {
          logger.warn(`No elements found in: ${filePath} — skipping.`);
          continue;
        }

        // Rate limit : 500ms entre chaque requête API
        const documented = await withRateLimit(
          () => generateDocumentation(parsed, aiLanguage),
          500
        );

        if (outputFormat === "md" || outputFormat === "all") {
          const mdPath = generateMarkdown(documented, outDir, filePath);
          logger.success(`Markdown → ${mdPath}`);
        }

        if (outputFormat === "json" || outputFormat === "all") {
          const jsonPath = generateJSON(documented, outDir, filePath);
          logger.success(`JSON     → ${jsonPath}`);
        }

        successCount++;
      } catch (error) {
        logger.error(
          `Failed to document ${filePath}: ${(error as Error).message}`
        );
      }
    }

    logger.step(`Done! ${successCount}/${files.length} file(s) documented → ${outDir}`);

    // En CI/CD, on sort avec un code non-zéro si des fichiers ont échoué
    if (successCount < files.length) {
      const failed = files.length - successCount;
      logger.warn(`${failed} file(s) failed to document.`);
      process.exit(1);
    }
  });

function getProjectFiles(include: string[], exclude: string[]): string[] {
  const files: string[] = [];
  const supportedExts = [".js", ".ts", ".php", ".dart", ".py"];

  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Vérifier les exclusions
      const shouldExclude = exclude.some(
        (ex) => fullPath.includes(ex) || entry.name.includes(ex)
      );
      if (shouldExclude) continue;

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (supportedExts.includes(path.extname(entry.name))) {
        files.push(fullPath);
      }
    }
  }

  // On part du dossier src/ par défaut
  walk("src");

  return files;
}

function validateAndResolveInputFile(filePath: string): string {
  const resolved = path.resolve(filePath);
  const base = path.resolve(process.cwd());
  const rel = path.relative(base, resolved);
  const isOutside = rel.startsWith("..") || path.isAbsolute(rel);
  if (isOutside) {
    throw new Error(
      `❌ Security: input file "${filePath}" is outside the project directory.`
    );
  }

  logger.warn(
    `Privacy notice: "${rel}" will be sent to an external AI service (Anthropic) for documentation generation.`
  );

  return resolved;
}