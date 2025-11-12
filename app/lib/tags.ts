import { missionsStatusOptions } from '../components/consumption/options'
import type { TagField, TagMeta } from '../../shared/types/tag'

const colorPalette: string[] = [
  'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
  'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
  'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200',
  'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/40 dark:text-fuchsia-200',
  'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200',
  'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200',
  'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200',
  'bg-lime-100 text-lime-800 dark:bg-lime-900/40 dark:text-lime-200',
  'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200',
  'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200',
]

const fallbackColor = 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200'

const fieldsOptions: Record<TagField, string[]> = {
  missions_status: missionsStatusOptions
}

const hash = (value: string): number => {
  let h = 0
  for (let i = 0; i < value.length; i++) {
    h = (h * 31 + value.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

const colorFromValue = (value: string, palette: string[] = colorPalette): string => {
  const idx = hash(value) % palette.length
  const picked = palette[idx]
  return picked !== undefined ? picked : fallbackColor
}

export const isTagField = (field: string): field is TagField => {
  return (
    field === 'target' ||
    field === 'size' ||
    field === 'legal_status' ||
    field === 'activity_sector' ||
    field === 'seniority' ||
    field === 'region' ||
    field === 'department'
  )
}

export const getTagMeta = (field: TagField, value?: string | null): TagMeta | undefined => {
  if (!value) return undefined
  const options = fieldsOptions[field]
  if (!options) return undefined
  const option = options.find((option) => option === value)
  if (!option) return undefined
  return { label: option, colorClass: colorFromValue(value) }
}