import { ParsedFile } from "../parser/index";
import { buildPrompt } from "./prompts";
import { logger } from "../utils/logger";
import { validateDocumentedFile } from "./validator";
import { loadConfig, getApiKeyForProvider } from "../config/index";
import { getProvider } from "./providers/factory";
import { extractFirstJsonObject, stripCodeFences } from "./json";

export interface DocumentedFile {
  file: string;
  language: string;
  description: string;
  elements: DocumentedElement[];
}

export interface DocumentedElement {
  type: string;
  name: string;
  description: string;
  signature: string;
  parameters: { name: string; type: string; description: string }[];
  returns: { type: string; description: string };
  example: string;
  warnings: string;
}

export async function generateDocumentation(
  parsedFile: ParsedFile,
  aiLanguage: string = "en"
): Promise<DocumentedFile> {
  const config = loadConfig();
  const providerName = config.ai.provider ?? "anthropic";
  const model = config.ai.model ?? "claude-sonnet-4-20250514";
  const apiKey = getApiKeyForProvider(providerName);

  const provider = getProvider(providerName);
  const prompt = buildPrompt(parsedFile, aiLanguage);

  logger.step(`Sending ${parsedFile.filePath} to ${providerName}...`);

  const raw = await provider.generateText({ apiKey, model, prompt });

  try {
    const cleaned = stripCodeFences(raw);
    const jsonText = extractFirstJsonObject(cleaned);
    const parsed = JSON.parse(jsonText);
    const result = validateDocumentedFile(parsed);
    logger.success(`Documentation generated for ${parsedFile.filePath}`);
    return result;
  } catch {
    logger.error("Failed to parse AI response as JSON.");
    logger.error(`Response length: ${raw.length} chars`);
    throw new Error("Invalid JSON response from AI provider");
  }
}