export function pickDish<T>(items: readonly T[], random: () => number = Math.random): T {
  if (!items.length) throw new Error('empty')
  const draw = random()
  const index = Math.min(items.length - 1, Math.max(0, Math.floor(draw * items.length)))
  return items[index] as T
}

const LOG_SPREAD = 0.35

function priceWeights<T extends { price: number }>(items: readonly T[], target: number): number[] {
  const prices = items.map((item) => item.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const aim = Math.min(max, Math.max(min, target))
  const counts = new Map<number, number>()
  for (const item of items) counts.set(item.price, (counts.get(item.price) ?? 0) + 1)
  if (aim === min || aim === max) {
    const n = counts.get(aim) ?? 1
    return items.map((item) => (item.price === aim ? 1 / n : 0))
  }
  const logs = items.map((item) => Math.log(item.price / 50))
  const prior = logs.map((value, index) => {
    const count = counts.get(items[index]!.price) ?? 1
    return -0.5 * (value / LOG_SPREAD) ** 2 - Math.log(count)
  })
  const weights = (tilt: number) => {
    const logits = logs.map((value, index) => prior[index]! + tilt * value)
    const anchor = Math.max(...logits)
    const raw = logits.map((value) => Math.exp(value - anchor))
    const sum = raw.reduce((total, value) => total + value, 0)
    return raw.map((value) => value / sum)
  }
  const mean = (next: number[]) => items.reduce((total, item, index) => total + item.price * next[index]!, 0)
  let lo = -1
  let hi = 1
  while (mean(weights(lo)) > aim) lo *= 2
  while (mean(weights(hi)) < aim) hi *= 2
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2
    if (mean(weights(mid)) < aim) lo = mid
    else hi = mid
  }
  return weights((lo + hi) / 2)
}

export function weightedMean<T extends { price: number }>(items: readonly T[], target: number): number {
  if (!items.length) return 0
  const weights = priceWeights(items, target)
  return items.reduce((total, item, index) => total + item.price * weights[index]!, 0)
}

export function pickWeighted<T extends { price: number }>(
  items: readonly T[],
  target: number,
  random: () => number = Math.random,
): T {
  if (!items.length) throw new Error('empty')
  const weights = priceWeights(items, target)
  const sum = weights.reduce((total, value) => total + value, 0)
  let remaining = random() * sum
  for (let i = 0; i < items.length; i++) {
    remaining -= weights[i]!
    if (remaining < 0) return items[i] as T
  }
  return items[items.length - 1] as T
}

export function pickUnseen<T extends { id: string; price: number }>(
  items: readonly T[],
  seen: readonly string[],
  target: number,
  random: () => number = Math.random,
): T {
  const fresh = items.filter((item) => !seen.includes(item.id))
  return pickWeighted(fresh.length ? fresh : items, target, random)
}

export function fillSlots<T extends { id: string }>(
  items: readonly T[],
  count: number,
  random: () => number = Math.random,
): T[] {
  if (!items.length) throw new Error('empty')
  const result: T[] = []
  const bag = [...items]
  for (let i = 0; i < count; i++) {
    if (!bag.length) bag.push(...items)
    const index = Math.min(bag.length - 1, Math.max(0, Math.floor(random() * bag.length)))
    result.push(bag.splice(index, 1)[0] as T)
  }
  return result
}
