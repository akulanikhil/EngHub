// ── Title normalization ───────────────────────────────────────────
// Prevents fragmentation like "SWE" / "Software Eng" / "swe" all being
// different buckets in the aggregates table.

const TITLE_MAP: [RegExp, string][] = [
  [/\bswe\b|\bsoftware\s+eng(ineer)?\b|\bsoftware\s+dev(eloper)?\b/i, 'Software Engineer'],
  [/\bfrontend\b|\bfront[\s-]end\b|\bui\s+eng\b/i,                    'Frontend Engineer'],
  [/\bbackend\b|\bback[\s-]end\b|\bserver[\s-]side\b/i,               'Backend Engineer'],
  [/\bfull[\s-]?stack\b/i,                                             'Full Stack Engineer'],
  [/\bml\s+eng|\bmachine\s+learning\s+eng|\bai\s+eng/i,               'ML / AI Engineer'],
  [/\bdata\s+eng/i,                                                     'Data Engineer'],
  [/\bdevops\b|\bsre\b|\bsite\s+reliability\b/i,                       'DevOps / SRE'],
  [/\bsecurity\s+eng|\bcyber\b/i,                                       'Security Engineer'],
  [/\bmobile\b|\bios\b|\bandroid\b/i,                                   'Mobile Engineer'],
  [/\beng(ineering)?\s+manager\b|\bem\b/i,                              'Engineering Manager'],
  [/\bproduct\s+manager\b|\bpm\b/i,                                     'Product Manager'],
  [/\bic\s+design|\bvlsi\b|\bchip\s+design/i,                         'IC Design Engineer'],
  [/\bembedded\b/i,                                                      'Embedded Systems Engineer'],
  [/\bfpga\b/i,                                                          'FPGA Engineer'],
  [/\brf\s+eng/i,                                                        'RF Engineer'],
  [/\bpropulsion\b/i,                                                    'Propulsion Engineer'],
  [/\bavionics\b/i,                                                       'Avionics Engineer'],
  [/\bprocess\s+eng/i,                                                   'Process Engineer'],
  [/\bstructural\s+eng/i,                                                'Structural Engineer'],
  [/\brobotic/i,                                                          'Robotics Engineer'],
  [/\bautomotive\b/i,                                                     'Automotive Engineer'],
  [/\bmed(ical)?\s+device\b/i,                                           'Medical Device Engineer'],
  [/\bbioinformatics\b/i,                                                 'Bioinformatics Engineer'],
]

export function normalizeTitle(raw: string): string {
  const trimmed = raw.trim()
  for (const [pattern, canonical] of TITLE_MAP) {
    if (pattern.test(trimmed)) return canonical
  }
  // Title-case fallback
  return trimmed
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase())
}

// ── Salary validation / cleaning ──────────────────────────────────
// Catches obviously wrong values before they pollute aggregates.

const SALARY_BOUNDS = {
  base:   { min: 20_000,  max: 1_000_000 },
  bonus:  { min: 0,       max: 500_000 },
  equity: { min: 0,       max: 2_000_000 },
  yoe:    { min: 0,       max: 50 },
}

export interface SalaryInput {
  role:     string
  company:  string
  base:     number
  bonus?:   number | null
  equity?:  number | null
  yoe:      number
  location: string
}

export interface ValidationResult {
  ok:     boolean
  errors: string[]
  data:   SalaryInput | null
}

export function validateAndNormalize(input: SalaryInput): ValidationResult {
  const errors: string[] = []

  if (!input.role?.trim())    errors.push('role is required')
  if (!input.company?.trim()) errors.push('company is required')
  if (!input.location?.trim()) errors.push('location is required')

  if (input.base < SALARY_BOUNDS.base.min || input.base > SALARY_BOUNDS.base.max)
    errors.push(`base salary must be between $${SALARY_BOUNDS.base.min.toLocaleString()} and $${SALARY_BOUNDS.base.max.toLocaleString()}`)

  if (input.bonus != null && (input.bonus < SALARY_BOUNDS.bonus.min || input.bonus > SALARY_BOUNDS.bonus.max))
    errors.push('bonus value out of expected range')

  if (input.equity != null && (input.equity < SALARY_BOUNDS.equity.min || input.equity > SALARY_BOUNDS.equity.max))
    errors.push('equity value out of expected range')

  if (input.yoe < SALARY_BOUNDS.yoe.min || input.yoe > SALARY_BOUNDS.yoe.max)
    errors.push('years of experience must be between 0 and 50')

  if (errors.length > 0) return { ok: false, errors, data: null }

  return {
    ok: true,
    errors: [],
    data: {
      ...input,
      role:    normalizeTitle(input.role),
      company: input.company.trim(),
      location: input.location.trim(),
    },
  }
}
