import * as fs from "fs";
import * as path from "path";

// Vérifie qu'un chemin de sortie ne sort pas du répertoire de travail
export function validateOutputPath(outputPath: string, baseDir: string): void {
  const resolved = path.resolve(outputPath);
  const base = path.resolve(baseDir);

  if (!resolved.startsWith(base)) {
    throw new Error(
      `❌ Security: output path "${outputPath}" is outside the project directory.`
    );
  }
}

export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function writeFile(filePath: string, content: string): void {
  validateOutputPath(filePath, process.cwd());
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf-8");
}

export function readFile(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

export function getFileExtension(filePath: string): string {
  return path.extname(filePath).toLowerCase().replace(".", "");
}

export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, "_") 
    .replace(/_{2,}/g, "_")
    .replace(/^_+|_+$/g, "");
}