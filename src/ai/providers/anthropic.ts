import Anthropic from "@anthropic-ai/sdk";
import { AIProvider } from "./types";

export const anthropicProvider: AIProvider = {
  name: "anthropic",
  async generateText({ apiKey, model, prompt }) {
    const client = new Anthropic({
      apiKey,
      timeout: 30000,
      maxRetries: 2,
    });

    const response = await client.messages.create({
      model,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    return response.content
      .filter((block) => block.type === "text")
      .map((block) => (block as { type: "text"; text: string }).text)
      .join("");
  },
};

