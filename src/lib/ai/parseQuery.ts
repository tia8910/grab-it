import OpenAI from "openai";
import { ParsedQuery } from "../types";

const SYSTEM_PROMPT = `You are a query parser for an online course search engine. Extract structured metadata from the user's natural language query.

Return a JSON object with these fields:
- topic (string, required): The subject the user wants to learn (e.g. "data science", "python", "digital marketing")
- pricePref (string, optional): One of "FREE", "PAID", "SUBSCRIPTION". Only include if the user expresses a preference.
- credentialPref (string, optional): One of "CERTIFIED", "KNOWLEDGE_ONLY". Only include if the user mentions certificates/credentials.
- financialPref (string, optional): One of "AUDIT_AVAILABLE", "FINANCIAL_AID", "NONE". Only include if mentioned.
- timePref (string, optional): One of "SHORT_FORM", "FULL_SPECIALIZATION". Only include if the user mentions duration/depth.
- maxPrice (number, optional): Maximum price in USD if the user specifies a budget (e.g. "under $20" → 20).

Only include optional fields when the user's query clearly indicates that preference. Do not guess.`;

export async function parseQuery(query: string): Promise<ParsedQuery> {
  const apiKey = process.env.OPENAI_API_KEY;

  // If no API key, fall back to simple keyword extraction
  if (!apiKey) {
    return fallbackParse(query);
  }

  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: query },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    return fallbackParse(query);
  }

  return JSON.parse(content) as ParsedQuery;
}

/** Simple keyword-based fallback when no OpenAI key is configured */
function fallbackParse(query: string): ParsedQuery {
  const lower = query.toLowerCase();

  const parsed: ParsedQuery = { topic: query };

  // Extract price preference
  if (lower.includes("free")) parsed.pricePref = "FREE";
  else if (lower.includes("paid") || lower.includes("$"))
    parsed.pricePref = "PAID";
  else if (lower.includes("subscription")) parsed.pricePref = "SUBSCRIPTION";

  // Extract credential preference
  if (
    lower.includes("certificate") ||
    lower.includes("certified") ||
    lower.includes("credential")
  )
    parsed.credentialPref = "CERTIFIED";

  // Extract financial path
  if (lower.includes("audit")) parsed.financialPref = "AUDIT_AVAILABLE";
  else if (lower.includes("financial aid"))
    parsed.financialPref = "FINANCIAL_AID";

  // Extract time preference
  if (lower.includes("short") || lower.includes("quick"))
    parsed.timePref = "SHORT_FORM";
  else if (lower.includes("specialization") || lower.includes("full"))
    parsed.timePref = "FULL_SPECIALIZATION";

  // Extract max price
  const priceMatch = lower.match(/under\s*\$?(\d+)/);
  if (priceMatch) parsed.maxPrice = parseInt(priceMatch[1], 10);

  // Clean up topic: remove filter keywords to get the core subject
  parsed.topic = query
    .replace(
      /\b(free|paid|certificate|certified|audit|financial aid|short|quick|specialization|full|under\s*\$?\d+|with\s+a|i\s+want\s+a?|course|courses|,)\b/gi,
      ""
    )
    .replace(/\s+/g, " ")
    .trim();

  if (!parsed.topic) parsed.topic = query;

  return parsed;
}
