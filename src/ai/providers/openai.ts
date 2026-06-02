import { AIProvider } from "./types";

type OpenAIChatResponse = {
  choices?: Array<{
    message?: { content?: string };
  }>;
};

export const openaiProvider: AIProvider = {
  name: "openai",
  async generateText({ apiKey, model, prompt }) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`OpenAI API error (${res.status}): ${text.slice(0, 200)}`);
    }

    const data = (await res.json()) as OpenAIChatResponse;
    const content = data.choices?.[0]?.message?.content ?? "";
    return content;
  },
};

