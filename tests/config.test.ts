import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { loadConfig } from "../src/config/index";
import * as fs from "fs";

describe("Config — loadConfig", () => {
  const configPath = ".fastdocrc.test";

  afterEach(() => {
    if (fs.existsSync(configPath)) fs.unlinkSync(configPath);
  });

  it("returns default config when no .fastdocrc exists", () => {
    const config = loadConfig("/nonexistent/path");
    expect(config.language).toBe("auto");
    expect(config.output).toContain("md");
    expect(config.outDir).toBe("./docs");
  });

  it("merges user config with defaults", () => {
    const userConfig = { outDir: "./custom-docs", language: "fr" };
    fs.writeFileSync(".fastdocrc", JSON.stringify(userConfig));

    const config = loadConfig(process.cwd());
    expect(config.outDir).toBe("./custom-docs");
    expect(config.language).toBe("fr");
    expect(config.ai.model).toBe("claude-sonnet-4-20250514"); // default preserved
  });

  it("returns default config on invalid JSON", () => {
    fs.writeFileSync(".fastdocrc", "{ invalid json }");
    const config = loadConfig(process.cwd());
    expect(config.language).toBe("auto");
  });
});