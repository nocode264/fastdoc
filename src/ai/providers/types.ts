export type AIProviderName = "anthropic" | "openai" | "gemini";

export interface AIProvider {
  readonly name: AIProviderName;
  generateText(params: { apiKey: string; model: string; prompt: string }): Promise<string>;
}

