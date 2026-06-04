/**
 * Content moderation utility.
 * Checks posts and comments for profanity and low-quality/spam content.
 */

// ── Profanity list ─────────────────────────────────────────────────────────
// This is a professional engineering career community — block all profanity.
const BLOCKED_WORDS = new Set([
  // Slurs and hate speech (racial, ethnic, gender, orientation)
  'nigger', 'nigga', 'faggot', 'fag', 'dyke', 'tranny', 'retard', 'retarded',
  'kike', 'spic', 'chink', 'gook', 'wetback', 'zipperhead', 'towelhead', 'raghead',
  'sandnigger', 'coon', 'jigaboo', 'spook',
  // Explicit sexual content
  'cunt', 'pussy', 'cock', 'dick', 'blowjob', 'handjob',
  'cum', 'cumshot', 'jizz', 'dildo', 'porn', 'pornography', 'masturbate',
  'masturbation', 'rape', 'rapist',
  // Compound profanity
  'motherfucker', 'motherfucking', 'cocksucker', 'asshole', 'shithead',
  'fuckhead', 'fucktard', 'dumbfuck', 'dumbass', 'jackass', 'smartass',
])

// Normalize: lowercase, collapse whitespace, strip non-alphanumeric (except spaces)
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Check for blocked words (whole-word matching where possible)
function containsProfanity(text: string): { blocked: boolean; word?: string } {
  const normalized = normalize(text)
  for (const word of BLOCKED_WORDS) {
    // Use word-boundary-style check: pad with spaces for whole-word matching
    const padded = ` ${normalized} `
    if (padded.includes(` ${word} `) || padded.includes(` ${word}s `)) {
      return { blocked: true, word }
    }
  }
  return { blocked: false }
}

// ── Spam / low-quality detection ───────────────────────────────────────────

function isSpam(text: string): { spam: boolean; reason?: string } {
  const trimmed = text.trim()

  // Too short
  if (trimmed.length < 5) {
    return { spam: true, reason: 'too short' }
  }

  // All caps (more than 70% uppercase letters)
  const letters = trimmed.replace(/[^a-zA-Z]/g, '')
  if (letters.length > 10) {
    const upperRatio = (trimmed.replace(/[^A-Z]/g, '').length) / letters.length
    if (upperRatio > 0.75) {
      return { spam: true, reason: 'excessive caps' }
    }
  }

  // Excessive repeated characters (e.g. "aaaaaaa", "!!!!!!")
  if (/(.)\1{7,}/.test(trimmed)) {
    return { spam: true, reason: 'repeated characters' }
  }

  // Pure gibberish: very high ratio of consonant clusters with no vowels
  const words = trimmed.split(/\s+/)
  const gibberishWords = words.filter(w => {
    if (w.length < 5) return false
    const vowelCount = (w.match(/[aeiou]/gi) ?? []).length
    return vowelCount === 0 // no vowels at all in a 5+ char word
  })
  if (words.length >= 3 && gibberishWords.length / words.length > 0.6) {
    return { spam: true, reason: 'gibberish content' }
  }

  // Promotion / spam links (very basic)
  const spamPatterns = [
    /\b(buy now|click here|free money|earn \$\d+|make money fast|work from home)\b/i,
    /https?:\/\/[^\s]{40,}/, // suspiciously long URL
  ]
  for (const pattern of spamPatterns) {
    if (pattern.test(trimmed)) {
      return { spam: true, reason: 'spam content detected' }
    }
  }

  return { spam: false }
}

// ── Public API ─────────────────────────────────────────────────────────────

export interface ModerationResult {
  allowed: boolean
  reason?: string  // user-facing message if blocked
}

export function moderate(title: string | null, body: string): ModerationResult {
  const combinedText = [title, body].filter(Boolean).join(' ')

  // Profanity check
  const profanityCheck = containsProfanity(combinedText)
  if (profanityCheck.blocked) {
    return {
      allowed: false,
      reason: 'Your post contains language that is not allowed on EngyNation. Please keep the community professional and respectful.',
    }
  }

  // Spam / quality check on the body
  const spamCheck = isSpam(body)
  if (spamCheck.spam) {
    const messages: Record<string, string> = {
      'too short': 'Please write a more detailed post so the community can help you effectively.',
      'excessive caps': 'Please avoid writing in all caps.',
      'repeated characters': 'Your post appears to contain excessive repeated characters.',
      'gibberish content': 'Your post could not be understood. Please write in clear English.',
      'spam content detected': 'Your post was flagged as potential spam.',
    }
    return {
      allowed: false,
      reason: messages[spamCheck.reason!] ?? 'Your post was flagged by our content filter.',
    }
  }

  return { allowed: true }
}
