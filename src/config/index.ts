import * as fs from "fs";
import * as path from "path";

export interface FastdocConfig {
  language: string;
  output: string[];
  outDir: string;
  include: string[];
  exclude: string[];
  ai: {
    provider?: "anthropic" | "openai" | "gemini";
    model: string;
    language: string;
  };
}

const DEFAULT_CONFIG: FastdocConfig = {
  language: "auto",
  output: ["md"],
  outDir: "./docs",
  include: ["src/**/*"],
  exclude: ["node_modules", "dist", "*.test.ts"],
  ai: {
    provider: "anthropic",
    model: "claude-sonnet-4-20250514",
    language: "en",
  },
};

export function loadConfig(cwd: string = process.cwd()): FastdocConfig {
  const configPath = path.join(cwd, ".fastdocrc");

  if (!fs.existsSync(configPath)) {
    return DEFAULT_CONFIG;
  }

  try {
    const raw = fs.readFileSync(configPath, "utf-8");
    const userConfig = JSON.parse(raw);
    return { ...DEFAULT_CONFIG, ...userConfig };
  } catch (error) {
    console.warn("⚠️  Invalid .fastdocrc file, using default config.");
    return DEFAULT_CONFIG;
  }
}

export function getApiKey(): string {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    console.error("❌ ANTHROPIC_API_KEY is not set.");
    console.error("   Run: export ANTHROPIC_API_KEY=your_api_key_here");
    process.exit(1);
  }
  const masked =
    key.slice(0, 10) + "****...****" + key.slice(-4);
  process.env.FASTDOC_MASKED_KEY = masked;
  return key;
}

export function getApiKeyForProvider(provider: "anthropic" | "openai" | "gemini"): string {
  const envVar =
    provider === "anthropic"
      ? "ANTHROPIC_API_KEY"
      : provider === "openai"
        ? "OPENAI_API_KEY"
        : "GEMINI_API_KEY";

  const key = process.env[envVar];
  if (!key) {
    console.error(`❌ ${envVar} is not set.`);
    process.exit(1);
  }
  return key;
}