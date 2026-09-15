export type DishType = 'com' | 'bun-pho' | 'mi' | 'banh' | 'lau' | 'khac'
export type Cuisine = 'viet' | 'nhat' | 'han' | 'thai' | 'au'
export type Region = 'bac' | 'trung' | 'nam'
export type Course = 'chinh' | 'vat' | 'uong' | 'nhau'
export type ThemeId = 'ket' | 'duyen' | 'khui' | 'que' | 'meo'
export type Lang = 'vi' | 'en' | 'zh' | 'ko' | 'ja' | 'hi'

export type Dish = {
  id: string
  name: string
  type: DishType
  cuisine: Cuisine
  region: Region | null
  builtin: boolean
  image?: string
  price: number
  veg: boolean
  course: Course
}

export type Filters = {
  types: DishType[]
  cuisines: Cuisine[]
  regions: Region[]
  course?: Course | null
  veg?: boolean
  budget?: number | null
}
