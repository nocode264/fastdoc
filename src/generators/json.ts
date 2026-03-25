import { DocumentedFile } from "../ai/client";
import { writeFile, sanitizeFileName } from "../utils/file";
import * as path from "path";

export function generateJSON(
  documented: DocumentedFile,
  outDir: string,
  filePath: string
): string {
  const rawName = path.basename(filePath, path.extname(filePath));
  const fileName = sanitizeFileName(rawName);
  const outputPath = path.join(outDir, `${fileName}.json`);

  const output = {
    generatedAt: new Date().toISOString(),
    generatedBy: "fastdoc",
    ...documented,
  };

  writeFile(outputPath, JSON.stringify(output, null, 2));
  return outputPath;
}