import { NextRequest } from 'next/server'

const MODEL = 'gemini-2.0-flash-lite'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse`

const SYSTEM_PROMPT = `You are the EngyNation AI Advisor — a concise, sharp career mentor for engineering students and professionals across all disciplines: CS/SWE, EE, ME, Civil, ChE, Aero, BME, and EnvE.

You help with: salaries, negotiation, interview prep, career paths, offer comparisons, industry trends, grad school decisions, and skills to build.

Response rules (follow strictly):
- Write exactly 2 short paragraphs. Never more.
- Target 120–160 words total. Stop at 180.
- Use **bold** only for key terms or company names. No bullet lists. No headers.
- Include at least one specific number (salary, timeline, percentage, or stat).
- End with one clear, actionable recommendation — one sentence.
- Write like a sharp, direct colleague — not a corporate FAQ or motivational poster.`

export async function POST(req: NextRequest) {
  try {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) {
    console.error('[POST /api/ai] GOOGLE_AI_API_KEY is not set')
    return Response.json(
      { error: 'AI advisor not configured — add GOOGLE_AI_API_KEY to your environment.' },
      { status: 503 }
    )
  }

  const body = await req.json().catch(() => ({}))
  const { message, context } = body
  if (!message?.trim()) {
    return Response.json({ error: 'message is required' }, { status: 422 })
  }

  // Build context-aware prompt for thread replies
  let userMessage = message.trim()
  if (context?.threadTitle) {
    userMessage = [
      `Forum thread: "${context.threadTitle}"`,
      context.threadContent ? `Original post: ${context.threadContent.slice(0, 300)}` : null,
      context.major ? `Engineering discipline: ${context.major}` : null,
      context.job && context.job !== 'All Roles' ? `Role: ${context.job}` : null,
      `\nWrite a helpful, specific reply as the EngyNation AI Advisor.`,
    ].filter(Boolean).join('\n')
  }

  console.log(`[POST /api/ai] calling Gemini model=${MODEL} messageLen=${userMessage.length}`)

  let geminiRes: Response
  try {
    geminiRes = await fetch(`${GEMINI_URL}&key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: { maxOutputTokens: 300, temperature: 0.65 },
      }),
    })
  } catch (fetchErr) {
    console.error('[POST /api/ai] network error reaching Gemini:', fetchErr)
    return Response.json({ error: 'Could not reach AI service' }, { status: 502 })
  }

  if (!geminiRes.ok) {
    const errText = await geminiRes.text()
    console.error(`[POST /api/ai] Gemini ${geminiRes.status}:`, errText)
    return Response.json({ error: `AI request failed (${geminiRes.status})`, detail: errText }, { status: 500 })
  }

  // Stream SSE from Gemini → plain text chunks to client
  const stream = new ReadableStream({
    async start(controller) {
      const reader = geminiRes.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const json = line.slice(6).trim()
            if (json === '[DONE]') { controller.close(); return }
            try {
              const parsed = JSON.parse(json)
              const text: string = parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
              if (text) controller.enqueue(new TextEncoder().encode(text))
            } catch {}
          }
        }
      } catch (err) {
        console.error('[POST /api/ai] stream error:', err)
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
  } catch (err) {
    console.error('[POST /api/ai] unhandled error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
