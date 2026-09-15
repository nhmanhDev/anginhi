import type { Dish } from './types.ts'

export const CARD_WIDTH = 240
export const CARD_STEP = 254
export const WIN_INDEX = 10

export function pickFrom(pool: readonly Dish[], random: () => number): Dish {
  if (!pool.length) throw new Error('empty')
  return pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))] as Dish
}

export function buildReel(pool: readonly Dish[], winner: Dish, random: () => number = Math.random): Dish[] {
  const others = pool.filter((dish) => dish.id !== winner.id)
  const source = others.length ? others : pool
  const items: Dish[] = []
  for (let i = 0; i < WIN_INDEX; i++) items.push(pickFrom(source, random))
  items.push(winner)
  for (let i = 0; i < 4; i++) items.push(pickFrom(source, random))
  return items
}

export function idleReel(pool: readonly Dish[]): Dish[] {
  if (!pool.length) return []
  return Array.from({ length: 16 }, (_, i) => pool[i % pool.length] as Dish)
}

export function reelOffset(index: number, viewportWidth: number): number {
  return viewportWidth / 2 - CARD_WIDTH / 2 - index * CARD_STEP
}
