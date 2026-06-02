import { AIProvider, AIProviderName } from "./types";
import { anthropicProvider } from "./anthropic";
import { openaiProvider } from "./openai";
import { geminiProvider } from "./gemini";

const PROVIDERS: Record<AIProviderName, AIProvider> = {
  anthropic: anthropicProvider,
  openai: openaiProvider,
  gemini: geminiProvider,
};

export function getProvider(name: AIProviderName): AIProvider {
  return PROVIDERS[name];
}

