export interface Consumption {
  id: string
  last_index: number
  last_index_date: string
  last_qmin: number
  last_qmin_date: string
  pds: string
  index_daily_differential: number | null
  index_daily_differential_date: string | null
  index_weekly_differential: number | null
  index_weekly_differential_date: string | null
  qmin_daily_differential: number | null
  qmin_daily_differential_date: string | null
  qmin_weekly_differential: number | null
  qmin_weekly_differential_date: string | null
}