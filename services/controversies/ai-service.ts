import Groq from "groq-sdk";
import { COUNTRIES } from "@/constants/controversies-countries";
import { Article } from "@/types/controversies";

export class AIService {
  async generatePoliticalSummary(
    articles: Article[],
    countryCode: string
  ): Promise<string> {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return "AI summarization unavailable - GROQ_API_KEY not configured.";
    }

    const groq = new Groq({ apiKey: GROQ_API_KEY });
    const country = COUNTRIES[countryCode.toLowerCase()];
    const countryName = country ? country.name : "the country";

    const articlesText = articles
      .slice(0, 5)
      .map(
        (article, i) =>
          `Article ${i + 1}: ${article.title}. ${article.description || ""}`
      )
      .join("\n\n");

    const prompt = `You are a political analyst. Write a concise political summary for ${countryName} based on these news articles. 

Return ONLY the summary paragraph - no explanations, no analysis of the task, no quotes around it, just the summary text.

Style: Use phrases like "ongoing debate", "concerns about", "sparked heated discussions", "tensions have emerged". Focus on political tensions and controversies. Keep it to 2-4 sentences maximum with a flowing, analytical tone.

Articles:
${articlesText}

Political Summary:`;

    try {
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "openai/gpt-oss-20b",
        temperature: 0.7,
        max_tokens: 600,
      });

      const content = completion.choices[0]?.message?.content?.trim();
      const reasoning = completion.choices[0]?.message?.reasoning?.trim();

      let summary = content || reasoning;

      if (!summary) {
        return "AI response was empty.";
      }

      summary = summary.replace(/^["']|["']$/g, "").trim();

      if (summary && !summary.match(/[.!?]$/)) {
        const lastSentenceEnd = Math.max(
          summary.lastIndexOf("."),
          summary.lastIndexOf("!"),
          summary.lastIndexOf("?")
        );
        if (lastSentenceEnd > summary.length * 0.6) {
          summary = summary.substring(0, lastSentenceEnd + 1);
        }
      }

      return summary;
    } catch (error: any) {
      if (error.message.includes("401") || error.status === 401) {
        return "AI summarization failed - Invalid GROQ_API_KEY.";
      } else if (error.message.includes("429") || error.status === 429) {
        return "AI summarization failed - Rate limit exceeded.";
      } else if (error.message.includes("model")) {
        return "AI summarization failed - Model not available.";
      } else {
        return `AI summarization failed - ${error.message}`;
      }
    }
  }
}
