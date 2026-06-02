import * as fs from "fs";
import * as path from "path";

function assertPathInsideBase(
  targetPath: string,
  baseDir: string,
  kind: "input" | "output"
): void {
  const resolvedTarget = path.resolve(targetPath);
  const resolvedBase = path.resolve(baseDir);
  const rel = path.relative(resolvedBase, resolvedTarget);

  // `path.relative` may return a path with drive letters when bases differ on Windows,
  // which `path.isAbsolute()` catches.
  const isOutside = rel === "" ? false : rel.startsWith("..") || path.isAbsolute(rel);
  if (isOutside) {
    throw new Error(
      `❌ Security: ${kind} path "${targetPath}" is outside the project directory.`
    );
  }
}

// Vérifie qu'un chemin de sortie ne sort pas du répertoire de travail
export function validateOutputPath(outputPath: string, baseDir: string): void {
  assertPathInsideBase(outputPath, baseDir, "output");
}

// Vérifie qu'un chemin d'entrée ne sort pas du répertoire de travail
export function validateInputPath(inputPath: string, baseDir: string): void {
  assertPathInsideBase(inputPath, baseDir, "input");
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
  validateInputPath(filePath, process.cwd());
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