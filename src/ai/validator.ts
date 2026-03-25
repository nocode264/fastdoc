import { DocumentedFile } from "./client";

export function validateDocumentedFile(data: unknown): DocumentedFile {
  if (typeof data !== "object" || data === null) {
    throw new Error("Response is not a valid object");
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.file !== "string" || obj.file.trim() === "") {
    throw new Error("Missing or invalid field: file");
  }

  if (typeof obj.language !== "string" || obj.language.trim() === "") {
    throw new Error("Missing or invalid field: language");
  }

  if (typeof obj.description !== "string") {
    throw new Error("Missing or invalid field: description");
  }

  if (!Array.isArray(obj.elements)) {
    throw new Error("Missing or invalid field: elements (must be an array)");
  }

  obj.elements.forEach((el: unknown, index: number) => {
    if (typeof el !== "object" || el === null) {
      throw new Error(`Element at index ${index} is not a valid object`);
    }

    const element = el as Record<string, unknown>;

    if (typeof element.type !== "string") {
      throw new Error(`Element ${index}: missing field "type"`);
    }

    if (typeof element.name !== "string") {
      throw new Error(`Element ${index}: missing field "name"`);
    }

    if (typeof element.description !== "string") {
      throw new Error(`Element ${index}: missing field "description"`);
    }

    if (!Array.isArray(element.parameters)) {
      element.parameters = [];
    }

    if (typeof element.returns !== "object" || element.returns === null) {
      element.returns = { type: "void", description: "" };
    }

    if (typeof element.example !== "string") {
      element.example = "";
    }

    if (typeof element.warnings !== "string") {
      element.warnings = "";
    }
  });

  return obj as unknown as DocumentedFile;
}