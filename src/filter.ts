import type { Dish, Filters } from './types.ts'

export function eligibleDishes(
  dishes: readonly Dish[],
  disabled: readonly string[],
  filters: Filters,
): Dish[] {
  const blocked = new Set(disabled)
  return dishes.filter((dish) => {
    if (blocked.has(dish.id)) return false
    if (filters.types.length && !filters.types.includes(dish.type)) return false
    if (filters.cuisines.length && !filters.cuisines.includes(dish.cuisine)) return false
    if (filters.regions.length && !(dish.region && filters.regions.includes(dish.region))) return false
    if (filters.course && dish.course !== filters.course) return false
    if (filters.veg && !dish.veg) return false
    if (filters.budget != null && dish.price > filters.budget) return false
    return true
  })
}
