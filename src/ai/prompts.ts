import { ParsedFile } from "../parser/index";

const MAX_BODY_LENGTH = 1500; // max chars par élément
const MAX_ELEMENTS = 20;      // max éléments par fichier

export function buildPrompt(parsedFile: ParsedFile, language: string): string {
  const lang = language === "fr" ? "French" : "English";

  // Limite le nombre d'éléments
  const elements = parsedFile.elements.slice(0, MAX_ELEMENTS);

  if (parsedFile.elements.length > MAX_ELEMENTS) {
    console.warn(
      `⚠️  ${parsedFile.filePath} has ${parsedFile.elements.length} elements — only first ${MAX_ELEMENTS} will be documented.`
    );
  }

  const elementsText = elements
    .map((el) => {
      // Tronque les corps trop longs
      const body =
        el.body.length > MAX_BODY_LENGTH
          ? el.body.slice(0, MAX_BODY_LENGTH) + "\n... [truncated]"
          : el.body;

      return `### ${el.type.toUpperCase()}: ${el.name}\n\`\`\`\n${body}\n\`\`\``;
    })
    .join("\n\n");

  return `You are a technical documentation expert. Analyze the following ${parsedFile.language} code and generate professional documentation in ${lang}.

For each element (function, class, interface, route), provide:
- A clear description of its purpose
- Parameters with their types and descriptions
- Return value with type and description
- A usage example
- Any warnings (deprecated, throws, side effects)

Respond ONLY in valid JSON with this exact structure:
{
  "file": "<filename>",
  "language": "<language>",
  "description": "<overall file description>",
  "elements": [
    {
      "type": "<function|class|interface|route>",
      "name": "<name>",
      "description": "<what it does>",
      "signature": "<full signature>",
      "parameters": [
        { "name": "<param>", "type": "<type>", "description": "<desc>" }
      ],
      "returns": { "type": "<type>", "description": "<desc>" },
      "example": "<usage example as code string>",
      "warnings": "<optional warnings or empty string>"
    }
  ]
}

Do not include any text outside the JSON. No markdown backticks. No preamble.

FILE: ${parsedFile.filePath}
LANGUAGE: ${parsedFile.language}

${elementsText}`;
}