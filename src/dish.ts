import type { Course, Cuisine, Dish, DishType, Region } from './types.ts'

const NAME_ERROR = 'Tên 1–60 ký tự.'
const LIMIT_ERROR = 'Tối đa 50 món tự thêm.'
const PRICE_ERROR = 'Giá 10–500 nghìn.'

const COURSES: Course[] = ['chinh', 'vat', 'uong', 'nhau']

export function validateCustomInput(
  input: {
    name: string
    type: DishType
    cuisine: Cuisine
    region: Region | null
    price: number
    veg: boolean
    course: Course
  },
  existingCustomCount: number,
): { ok: true; dish: Omit<Dish, 'id' | 'builtin'> } | { ok: false; message: string } {
  if (existingCustomCount >= 50) return { ok: false, message: LIMIT_ERROR }
  const name = input.name.normalize('NFC').trim()
  if (!name || name.length > 60 || /[\u0000-\u001f\u007f]/.test(name)) {
    return { ok: false, message: NAME_ERROR }
  }
  if (!Number.isInteger(input.price) || input.price < 10 || input.price > 500) {
    return { ok: false, message: PRICE_ERROR }
  }
  const course = COURSES.includes(input.course) ? input.course : 'chinh'
  return {
    ok: true,
    dish: {
      name,
      type: input.type,
      cuisine: input.cuisine,
      region: input.cuisine === 'viet' ? input.region : null,
      price: input.price,
      veg: input.veg === true,
      course,
    },
  }
}
