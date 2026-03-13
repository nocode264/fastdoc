import Anthropic from "@anthropic-ai/sdk";
import { ParsedFile } from "../parser/index";
import { buildPrompt } from "./prompts";
import { getApiKey } from "../config/index";
import { logger } from "../utils/logger";

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
  const apiKey = getApiKey();
  const client = new Anthropic({ apiKey });

  const prompt = buildPrompt(parsedFile, aiLanguage);

  logger.step(`Sending ${parsedFile.filePath} to Claude...`);

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = response.content
    .filter((block) => block.type === "text")
    .map((block) => (block as { type: "text"; text: string }).text)
    .join("");

  try {
    const result = JSON.parse(raw);
    logger.success(`Documentation generated for ${parsedFile.filePath}`);
    return result;
  } catch {
    logger.error("Failed to parse Claude response as JSON.");
    logger.error("Raw response: " + raw.slice(0, 200));
    throw new Error("Invalid JSON response from Claude API");
  }
}