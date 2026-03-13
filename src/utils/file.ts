import * as fs from "fs";
import * as path from "path";

export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function writeFile(filePath: string, content: string): void {
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