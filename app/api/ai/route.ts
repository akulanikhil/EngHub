import { NextRequest, NextResponse } from 'next/server'

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

const SYSTEM_PROMPT = `You are the EngHub AI Advisor — a friendly, knowledgeable career mentor for engineering students and professionals. You cover all disciplines: Computer Science, Electrical Engineering, Mechanical Engineering, Civil Engineering, Chemical Engineering, Aerospace Engineering, Biomedical Engineering, and Environmental Engineering.

You help with:
- Salary ranges, total compensation, and negotiation tactics
- Interview prep (technical, behavioral, system design)
- Career path advice, job transitions, and offer comparisons
- Industry trends, top employers, and emerging opportunities
- Graduate school vs. industry decisions
- Certifications, skills to learn, and resume tips

Guidelines:
- Be concise: 2–4 short paragraphs max
- Be specific: use real salary figures, company names, tools, and frameworks
- Be practical: give actionable next steps
- Be honest: don't sugarcoat hard truths about job markets`

export async function POST(req: NextRequest) {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'AI advisor not configured — add GOOGLE_AI_API_KEY to your environment.' }, { status: 503 })
  }

  const { message, context } = await req.json()
  if (!message?.trim()) {
    return NextResponse.json({ error: 'message is required' }, { status: 422 })
  }

  // Build a context-aware prompt for thread replies
  let userMessage = message.trim()
  if (context?.threadTitle) {
    const parts = [
      `Forum thread: "${context.threadTitle}"`,
      context.threadContent ? `Post: ${context.threadContent.slice(0, 400)}` : null,
      context.major ? `Engineering discipline: ${context.major}` : null,
      context.job && context.job !== 'All Roles' ? `Role focus: ${context.job}` : null,
      `\nPlease reply as the EngHub AI Advisor with helpful, specific career advice.`,
    ].filter(Boolean)
    userMessage = parts.join('\n')
  }

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        generationConfig: { maxOutputTokens: 600, temperature: 0.7 },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[POST /api/ai] Gemini error:', err)
      return NextResponse.json({ error: 'AI request failed' }, { status: 500 })
    }

    const data = await res.json()
    const text: string =
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      'Sorry, I could not generate a response right now.'

    return NextResponse.json({ text })
  } catch (err) {
    console.error('[POST /api/ai] fetch error:', err)
    return NextResponse.json({ error: 'AI advisor unavailable' }, { status: 500 })
  }
}
