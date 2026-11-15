import type { Course, Cuisine, Dish, DishType, Filters, Lang, Region, ThemeId, UiTheme } from './types.ts'

export const STORAGE_KEY = 'anginhi-v1'
export const STORAGE_FAIL = 'Không lưu được trên trình duyệt này.'

export type Store = {
  v: 1
  disabled: string[]
  custom: Dish[]
  filters: Filters
  area: string
  lastId: string | null
  sound: boolean
  lang: Lang
  mode: ThemeId
  ui: { theme: UiTheme | null }
  picks: number
  recent: string[]
  spendCustom: boolean
  seen: string[]
}

const DISH_TYPES: DishType[] = ['com', 'bun-pho', 'mi', 'banh', 'lau', 'khac']
const CUISINES: Cuisine[] = ['viet', 'nhat', 'han', 'thai', 'au']
const REGIONS: Region[] = ['bac', 'trung', 'nam']

export function emptyStore(): Store {
  return {
    v: 1,
    disabled: [],
    custom: [],
    filters: { types: [], cuisines: [], regions: [], course: 'chinh', veg: false, budget: 50 },
    area: 'nearby',
    lastId: null,
    sound: true,
    lang: 'vi',
    mode: 'que',
    ui: { theme: null },
    picks: 0,
    recent: [],
    spendCustom: false,
    seen: [],
  }
}

export function parseStore(raw: unknown): Store {
  const base = emptyStore()
  if (!raw || typeof raw !== 'object') return base
  const value = raw as Record<string, unknown>
  if (value.v !== 1) return base

  return {
    v: 1,
    disabled: Array.isArray(value.disabled) ? value.disabled.filter((id): id is string => typeof id === 'string') : [],
    custom: Array.isArray(value.custom) ? value.custom.flatMap((item) => parseDish(item) ?? []) : [],
    filters: {
      types: pickList(value.filters, 'types', DISH_TYPES),
      cuisines: pickList(value.filters, 'cuisines', CUISINES),
      regions: pickList(value.filters, 'regions', REGIONS),
      course: pickCourse(value.filters),
      veg: pickFlag(value.filters, 'veg'),
      budget: pickBudget(value.filters),
    },
    area: typeof value.area === 'string' && value.area ? value.area : 'nearby',
    lastId: typeof value.lastId === 'string' ? value.lastId : null,
    sound: value.sound !== false,
    lang: pickLang(value.lang),
    mode: pickTheme(value.mode ?? value.theme),
    ui: { theme: pickUiTheme(value.ui) },
    picks: typeof value.picks === 'number' && value.picks > 0 ? Math.floor(value.picks) : 0,
    recent: Array.isArray(value.recent)
      ? value.recent.filter((id): id is string => typeof id === 'string').slice(0, 8)
      : [],
    spendCustom: value.spendCustom === true,
    seen: Array.isArray(value.seen)
      ? value.seen.filter((id): id is string => typeof id === 'string').slice(0, 200)
      : [],
  }
}

export function writeStore(
  store: Store,
  storage: Pick<Storage, 'setItem'>,
): { ok: true } | { ok: false; message: string } {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(store))
    return { ok: true }
  } catch {
    return { ok: false, message: STORAGE_FAIL }
  }
}

function pickList<T extends string>(
  filters: unknown,
  key: string,
  allowed: readonly T[],
): T[] {
  if (!filters || typeof filters !== 'object') return []
  const list = (filters as Record<string, unknown>)[key]
  if (!Array.isArray(list)) return []
  return list.filter((item): item is T => typeof item === 'string' && (allowed as readonly string[]).includes(item))
}

function parseDish(raw: unknown): Dish | null {
  if (!raw || typeof raw !== 'object') return null
  const value = raw as Record<string, unknown>
  if (typeof value.id !== 'string' || !value.id) return null
  if (typeof value.name !== 'string' || !value.name) return null
  if (typeof value.type !== 'string' || !DISH_TYPES.includes(value.type as DishType)) return null
  if (typeof value.cuisine !== 'string' || !CUISINES.includes(value.cuisine as Cuisine)) return null
  const region =
    value.region === null
      ? null
      : typeof value.region === 'string' && REGIONS.includes(value.region as Region)
        ? (value.region as Region)
        : null
  const courses: Course[] = ['chinh', 'vat', 'uong', 'nhau']
  const course =
    typeof value.course === 'string' && courses.includes(value.course as Course)
      ? (value.course as Course)
      : 'chinh'
  const price = typeof value.price === 'number' && value.price > 0 ? value.price : 45
  return {
    id: value.id,
    name: value.name,
    type: value.type as DishType,
    cuisine: value.cuisine as Cuisine,
    region: value.cuisine === 'viet' ? region : null,
    builtin: false,
    price,
    veg: value.veg === true,
    course,
  }
}

function pickCourse(filters: unknown): Course | null {
  if (!filters || typeof filters !== 'object') return 'chinh'
  const course = (filters as Record<string, unknown>).course
  if (course === null) return null
  if (course === 'chinh' || course === 'vat' || course === 'uong' || course === 'nhau') return course
  return 'chinh'
}

function pickFlag(filters: unknown, key: string): boolean {
  if (!filters || typeof filters !== 'object') return false
  return (filters as Record<string, unknown>)[key] === true
}

function pickBudget(filters: unknown): number | null {
  if (!filters || typeof filters !== 'object') return 50
  const budget = (filters as Record<string, unknown>).budget
  if (budget === null) return null
  if (typeof budget === 'number' && Number.isInteger(budget) && budget >= 10 && budget <= 500) {
    return budget
  }
  return 50
}

const LANGS: Lang[] = ['vi', 'en', 'zh', 'ko', 'ja', 'hi']

function pickLang(raw: unknown): Lang {
  return typeof raw === 'string' && LANGS.includes(raw as Lang) ? (raw as Lang) : 'vi'
}

function pickTheme(_raw: unknown): ThemeId {
  return 'que'
}

function pickUiTheme(raw: unknown): UiTheme | null {
  if (!raw || typeof raw !== 'object') return null
  const theme = (raw as Record<string, unknown>).theme
  return theme === 'light' || theme === 'dark' ? theme : null
}
