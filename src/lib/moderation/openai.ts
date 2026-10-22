import "server-only";

/**
 * Optional OpenAI moderation (free endpoint). Enabled when OPENAI_API_KEY is
 * set; otherwise returns null and the built-in filters decide alone.
 */
export type ExternalVerdict = {
  selfHarm: boolean;
  severe: boolean;
  flagged: boolean;
  categories: string[];
};

type OpenAIModerationResponse = {
  results: { flagged: boolean; categories: Record<string, boolean> }[];
};

const SEVERE = new Set([
  "sexual/minors",
  "hate/threatening",
  "harassment/threatening",
  "violence/graphic",
  "illicit/violent",
]);

export async function openAIModeration(text: string): Promise<ExternalVerdict | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const res = await fetch("https://api.openai.com/v1/moderations", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "omni-moderation-latest", input: text }),
    signal: AbortSignal.timeout(4000),
  });
  if (!res.ok) throw new Error(`OpenAI moderation failed: ${res.status}`);

  const json = (await res.json()) as OpenAIModerationResponse;
  const result = json.results[0];
  const categories = Object.entries(result.categories)
    .filter(([, on]) => on)
    .map(([name]) => name);

  return {
    flagged: result.flagged,
    selfHarm: categories.some((c) => c.startsWith("self-harm")),
    severe: categories.some((c) => SEVERE.has(c)),
    categories,
  };
}
