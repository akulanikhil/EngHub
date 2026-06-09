/**
 * Non-streaming Gemini helper.
 * Used by server-side code (cron jobs, workers) that needs a full response
 * without SSE streaming.
 */

const MODEL = 'gemini-1.5-flash'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

export const FORUM_REPLY_SYSTEM_PROMPT = `You are the EngyNation AI Advisor — a concise, sharp career mentor for engineering students and professionals across all disciplines: CS/SWE, EE, ME, Civil, ChE, Aero, BME, and EnvE.

You are replying to a forum post from a fellow engineering student or professional. Write a helpful, specific reply that:
- Addresses their actual question or situation
- Includes at least one specific number (salary range, timeline, stat, or percentage)
- Uses **bold** only for key terms or company names. No bullet lists. No headers.
- Stays under 180 words across exactly 2 short paragraphs
- Ends with one clear, actionable recommendation
- Sounds like a sharp, direct colleague — not a corporate FAQ or AI chatbot`

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> }
  }>
}

export async function generateText(
  userMessage: string,
  systemPrompt: string = FORUM_REPLY_SYSTEM_PROMPT,
): Promise<string> {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) throw new Error('GOOGLE_AI_API_KEY not set')

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      generationConfig: { maxOutputTokens: 350, temperature: 0.7 },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini error ${res.status}: ${err.slice(0, 200)}`)
  }

  const json: GeminiResponse = await res.json()
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  if (!text) throw new Error('Empty response from Gemini')
  return text.trim()
}
