export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = process.env.OPENROUTER_MODEL ?? "qwen/qwen3-235b-a22b:free";

/** Retry config */
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1500;

/**
 * Simple exponential backoff sleep.
 */
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calls OpenRouter with the given messages and returns the first choice's content.
 * Includes automatic retry with exponential backoff for transient failures.
 *
 * @throws Error if the API key is missing (caller must handle)
 * Returns null only if all retry attempts fail.
 */
export async function callOpenRouter(
  systemPrompt: string,
  userMessage: string,
  model = DEFAULT_MODEL,
  timeoutMs = 60_000,
  maxTokens = 4096
): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured. AI analysis cannot proceed.");
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
      console.warn(`[OpenRouter] Retry ${attempt}/${MAX_RETRIES} after ${delay}ms...`);
      await sleep(delay);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "https://atsprecision.app",
          "X-Title": "ATS Precision"
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          temperature: 0.3,
          max_tokens: maxTokens
        })
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => response.statusText);
        console.error(`[OpenRouter] HTTP ${response.status}: ${errText}`);

        // 429 rate limit or 5xx server errors are retryable
        if (response.status === 429 || response.status >= 500) {
          lastError = new Error(`HTTP ${response.status}: ${errText}`);
          continue;
        }

        // 4xx client errors (except 429) are not retryable
        lastError = new Error(`HTTP ${response.status}: ${errText}`);
        break;
      }

      const data = (await response.json()) as OpenRouterResponse;
      const content = data.choices?.[0]?.message?.content ?? null;

      if (!content) {
        console.warn("[OpenRouter] Empty response content, retrying...");
        lastError = new Error("Empty response from AI model");
        continue;
      }

      return content;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.warn("[OpenRouter] Request timed out after", timeoutMs, "ms.");
        lastError = new Error(`Request timed out after ${timeoutMs}ms`);
      } else {
        console.error("[OpenRouter] Request failed:", error);
        lastError = error instanceof Error ? error : new Error(String(error));
      }
      // Timeout and network errors are retryable
      continue;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  console.error(`[OpenRouter] All ${MAX_RETRIES + 1} attempts failed. Last error:`, lastError?.message);
  return null;
}

/**
 * Parses a JSON string from the model's output, handling markdown code fences
 * and common AI output quirks.
 */
export function parseJsonFromModel<T>(raw: string): T | null {
  try {
    // Strip markdown fences, leading/trailing whitespace, and any preamble text before the JSON
    let cleaned = raw.trim();

    // Remove markdown code fences
    cleaned = cleaned.replace(/^```(?:json)?[\s\n]*/i, "").replace(/[\s\n]*```\s*$/i, "");

    // If the response starts with text before JSON, find the first { or [
    const jsonStart = cleaned.search(/[{\[]/);
    if (jsonStart > 0) {
      cleaned = cleaned.slice(jsonStart);
    }

    // Find the last matching } or ]
    const lastBrace = cleaned.lastIndexOf("}");
    const lastBracket = cleaned.lastIndexOf("]");
    const jsonEnd = Math.max(lastBrace, lastBracket);
    if (jsonEnd > 0 && jsonEnd < cleaned.length - 1) {
      cleaned = cleaned.slice(0, jsonEnd + 1);
    }

    return JSON.parse(cleaned) as T;
  } catch {
    console.error("[OpenRouter] Failed to parse JSON from model output:", raw.slice(0, 200));
    return null;
  }
}
