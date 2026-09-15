import type { Course, Cuisine, DishType, Lang, Region } from './types.ts'

export const TYPE_LABELS: Record<DishType, string> = {
  com: 'Cơm',
  'bun-pho': 'Bún/Phở',
  mi: 'Mì',
  banh: 'Bánh',
  lau: 'Lẩu',
  khac: 'Khác',
}

export const CUISINE_LABELS: Record<Cuisine, string> = {
  viet: 'Việt',
  nhat: 'Nhật',
  han: 'Hàn',
  thai: 'Thái',
  au: 'Âu',
}

export const REGION_LABELS: Record<Region, string> = {
  bac: 'Bắc',
  trung: 'Trung',
  nam: 'Nam',
}

export const COURSE_LABELS: Record<Course, string> = {
  chinh: 'Món chính',
  vat: 'Ăn vặt',
  uong: 'Đồ uống',
  nhau: 'Món nhậu',
}

export const BUDGETS = [35, 50, 75, 100, 150] as const

const TYPE_EN: Record<DishType, string> = {
  com: 'Rice',
  'bun-pho': 'Bún / phở',
  mi: 'Noodles',
  banh: 'Bánh',
  lau: 'Hotpot',
  khac: 'Other',
}

const CUISINE_EN: Record<Cuisine, string> = {
  viet: 'Vietnamese',
  nhat: 'Japanese',
  han: 'Korean',
  thai: 'Thai',
  au: 'Western',
}

const REGION_EN: Record<Region, string> = {
  bac: 'North',
  trung: 'Central',
  nam: 'South',
}

export function typeLabel(id: DishType, lang: Lang) {
  return lang === 'en' ? TYPE_EN[id] : TYPE_LABELS[id]
}

export function cuisineLabel(id: Cuisine, lang: Lang) {
  return lang === 'en' ? CUISINE_EN[id] : CUISINE_LABELS[id]
}

export function regionLabel(id: Region, lang: Lang) {
  return lang === 'en' ? REGION_EN[id] : REGION_LABELS[id]
}

export const TYPE_OPTIONS = (Object.keys(TYPE_LABELS) as DishType[]).map((id) => [id, TYPE_LABELS[id]] as const)
export const CUISINE_OPTIONS = (Object.keys(CUISINE_LABELS) as Cuisine[]).map((id) => [id, CUISINE_LABELS[id]] as const)
export const REGION_OPTIONS = (Object.keys(REGION_LABELS) as Region[]).map((id) => [id, REGION_LABELS[id]] as const)
export const COURSE_OPTIONS = Object.entries(COURSE_LABELS) as [Course, string][]
