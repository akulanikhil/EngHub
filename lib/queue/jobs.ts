// ── Job type definitions ──────────────────────────────────────────
// All jobs are serialized to Redis as JSON and processed by workers.

export type JobType =
  | 'compute_salary_aggregates'
  | 'detect_outliers'
  | 'recompute_role_stats'

export interface BaseJob {
  id: string
  type: JobType
  createdAt: string
  attempts: number
  maxAttempts: number
}

export interface ComputeSalaryAggregatesJob extends BaseJob {
  type: 'compute_salary_aggregates'
  payload: {
    role: string
    company?: string   // if omitted, compute across all companies
  }
}

export interface DetectOutliersJob extends BaseJob {
  type: 'detect_outliers'
  payload: {
    salaryId: string   // newly submitted salary to check
  }
}

export interface RecomputeRoleStatsJob extends BaseJob {
  type: 'recompute_role_stats'
  payload: {
    role: string
  }
}

export type Job =
  | ComputeSalaryAggregatesJob
  | DetectOutliersJob
  | RecomputeRoleStatsJob
