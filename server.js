// server.js — Melotone Backend (clean version with Fix My Message + /ping)

require("dotenv").config();

console.log("🚀 Starting Melotone backend from file:", __filename);

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5000;

// ✅ Read API key from environment variable
// Put OPENAI_API_KEY=sk-... in your .env file
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(cors());
app.use(express.json());

/**
 * Helper to call OpenAI and return a parsed JSON object.
 * Expects the model to respond with ONLY pure JSON (no markdown).
 */
async function callOpenAIJson(systemPrompt, userPrompt) {
  if (!OPENAI_API_KEY) {
    throw new Error("Missing OpenAI API key. Set OPENAI_API_KEY in your environment.");
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        // If your account doesn’t support response_format, remove this line:
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const content = response.data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    try {
      return JSON.parse(content);
    } catch (parseErr) {
      console.error("JSON parse error from OpenAI, raw content was:");
      console.error(content);
      throw new Error("Failed to parse OpenAI JSON: " + parseErr.message);
    }
  } catch (err) {
    const apiMsg =
      err.response?.data?.error?.message ||
      (err.response?.data ? JSON.stringify(err.response.data) : "") ||
      err.message ||
      "Unknown OpenAI error";

    console.error("OpenAI error:", apiMsg);
    throw new Error(apiMsg);
  }
}

/* ----------------------- HEALTHCHECK: /ping ---------------------- */

app.get("/ping", (req, res) => {
  res.json({
    ok: true,
    message: "Melotone backend is using the NEW server.js",
    routes: ["/api/rewrite", "/api/translate", "/api/short-message", "/api/fix"]
  });
});

/* ----------------------- API: REWRITE ---------------------------- */

app.post("/api/rewrite", async (req, res) => {
  try {
    const { text, style, platform } = req.body || {};

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Missing 'text' in request body." });
    }

    const systemPrompt =
      "You are Melotone, an assistant that rewrites emails with clarity and tone. " +
      "You MUST respond with ONLY valid JSON, no markdown, no backticks, no explanations. " +
      "JSON shape: { \"subject\": string, \"email\": string, \"shortMessage\": string }.";

    const userPrompt = `
Rewrite this message into a clear, well-written email.

Tone: ${style || "warm, encouraging, positive"}
Platform: ${platform || "email"}

Return JSON like:
{
  "subject": "...",
  "email": "...",
  "shortMessage": "..."
}

Original message:
${text}
`.trim();

    const result = await callOpenAIJson(systemPrompt, userPrompt);

    res.json({
      subject: result.subject || "No subject",
      rewritten: result.email || "",
      shortMessage: result.shortMessage || ""
    });
  } catch (err) {
    console.error("Rewrite error:", err.message);
    res.status(500).json({ error: err.message || "Rewrite failed" });
  }
});

/* ----------------------- API: TRANSLATE -------------------------- */

app.post("/api/translate", async (req, res) => {
  try {
    const {
      text,
      targetLanguage,
      targetLanguageLabel,
      style,
      platform
    } = req.body || {};

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Missing 'text' in request body." });
    }

    if (!targetLanguage && !targetLanguageLabel) {
      return res.status(400).json({
        error: "Missing 'targetLanguage' or 'targetLanguageLabel' in request body."
      });
    }

    const languageName = targetLanguageLabel || targetLanguage;

    const systemPrompt =
      "You are Melotone, an AI that translates and polishes messages while keeping the meaning. " +
      "You MUST respond with ONLY valid JSON, no markdown, no backticks, no explanations. " +
      "JSON shape: { \"subject\": string, \"email\": string, \"shortMessage\": string }.";

    const userPrompt = `
Translate this message into ${languageName},
improving clarity while keeping the same meaning.

Tone: ${style || "neutral, clear"}
Platform: ${platform || "email"}

Return JSON like:
{
  "subject": "...",
  "email": "...",
  "shortMessage": "..."
}

Original message:
${text}
`.trim();

    const result = await callOpenAIJson(systemPrompt, userPrompt);

    res.json({
      subject: result.subject || "No subject",
      translated: result.email || "",
      shortMessage: result.shortMessage || ""
    });
  } catch (err) {
    console.error("Translate error:", err.message);
    res.status(500).json({ error: err.message || "Translation failed" });
  }
});

/* ------------------- API: SHORT MESSAGE -------------------------- */

app.post("/api/short-message", async (req, res) => {
  try {
    const { text, platform, style } = req.body || {};

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Missing 'text' in request body." });
    }

    const systemPrompt =
      "You are Melotone, an AI that creates short, natural WhatsApp/SMS/chat messages. " +
      "You MUST respond with ONLY valid JSON, no markdown, no backticks, no explanations. " +
      "JSON shape: { \"message\": string }.";

    const userPrompt = `
Create ONE short message for ${platform || "WhatsApp"} 
in tone: ${style || "warm, friendly"}.

Return JSON like:
{
  "message": "..."
}

Base text:
${text}
`.trim();

    const result = await callOpenAIJson(systemPrompt, userPrompt);

    res.json({ message: result.message || "" });
  } catch (err) {
    console.error("Short message error:", err.message);
    res.status(500).json({ error: err.message || "Short message failed" });
  }
});

/* ------------------- API: FIX MY MESSAGE ------------------------- */

app.post("/api/fix", async (req, res) => {
  console.log("🔧 /api/fix called with body:", req.body);

  try {
    const { text, style, preferredLanguage, platform } = req.body || {};

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Missing 'text' in request body." });
    }

    const systemPrompt =
      "You are Melotone, an assistant that helps immigrants and bilingual users " +
      "write clear, polite and correct messages. " +
      "You detect the input language (for example English or European Portuguese), " +
      "and then produce a polished version in the most appropriate language. " +
      "If a preferredLanguage is supplied and it's different from the input, you may translate into that language. " +
      "Always keep the meaning, but improve clarity, tone and structure. " +
      "You MUST respond with ONLY valid JSON, no markdown, no backticks, no explanations. " +
      "JSON shape: { \"subject\": string, \"email\": string, \"shortMessage\": string, \"detectedLanguage\": string }.";

    const userPrompt = `
User's base message (possibly messy or mixed language):
${text}

Tone to use: ${style || "polite, respectful, clear"}
Platform: ${platform || "email"}
Preferred output language (if any): ${preferredLanguage || "same as input language"}

Tasks:
1. Detect the language of the original message (e.g. "English", "European Portuguese").
2. Rewrite it as a clear, polite, well-structured email in the most appropriate language.
3. Create a short subject line for the email.
4. Create ONE short chat message (WhatsApp-style), informal but respectful, matching the same meaning.

Return JSON like:
{
  "subject": "...",
  "email": "...",
  "shortMessage": "...",
  "detectedLanguage": "English"
}
`.trim();

    const result = await callOpenAIJson(systemPrompt, userPrompt);

    res.json({
      subject: result.subject || "No subject",
      email: result.email || "",
      shortMessage: result.shortMessage || "",
      detectedLanguage: result.detectedLanguage || ""
    });
  } catch (err) {
    console.error("Fix error:", err.message);
    res.status(500).json({ error: err.message || "Fix My Message failed" });
  }
});

/* ---------------------- START SERVER ----------------------------- */

app.listen(PORT, () => {
  console.log(`Melotone backend running at http://localhost:${PORT}`);
});
