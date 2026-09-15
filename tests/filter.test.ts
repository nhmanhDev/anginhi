import assert from 'node:assert/strict'
import test from 'node:test'
import { CATALOG } from '../src/catalog.ts'
import { eligibleDishes } from '../src/filter.ts'
import { NAME_EN } from '../src/names.ts'
import type { Dish } from '../src/types.ts'

const d = (partial: Partial<Dish> & Pick<Dish, 'id' | 'type' | 'cuisine'>): Dish => ({
  name: partial.id,
  region: null,
  builtin: true,
  price: 50,
  veg: false,
  course: 'chinh',
  ...partial,
})

const pool: Dish[] = [
  d({ id: 'com-tam', type: 'com', cuisine: 'viet', region: 'nam', price: 50, course: 'chinh', veg: false }),
  d({ id: 'pho-bo', type: 'bun-pho', cuisine: 'viet', region: 'bac', price: 50, course: 'chinh', veg: false }),
  d({ id: 'ramen', type: 'mi', cuisine: 'nhat', price: 80, course: 'chinh', veg: false }),
  d({ id: 'pizza', type: 'banh', cuisine: 'au', price: 90, course: 'vat', veg: false }),
  d({ id: 'salad', type: 'khac', cuisine: 'au', price: 40, course: 'chinh', veg: true }),
]

test('no filters returns every enabled dish', () => {
  assert.deepEqual(
    eligibleDishes(pool, [], { types: [], cuisines: [], regions: [] }).map((x) => x.id),
    ['com-tam', 'pho-bo', 'ramen', 'pizza', 'salad'],
  )
})

test('disabled builtin ids are removed', () => {
  assert.deepEqual(
    eligibleDishes(pool, ['pizza'], { types: [], cuisines: [], regions: [] }).map((x) => x.id),
    ['com-tam', 'pho-bo', 'ramen', 'salad'],
  )
})

test('same group is OR, groups are AND', () => {
  const ids = eligibleDishes(pool, [], {
    types: ['com', 'bun-pho'],
    cuisines: ['viet'],
    regions: ['bac'],
  }).map((x) => x.id)
  assert.deepEqual(ids, ['pho-bo'])
})

test('region chip excludes dishes with null region', () => {
  const ids = eligibleDishes(pool, [], {
    types: [],
    cuisines: [],
    regions: ['nam'],
  }).map((x) => x.id)
  assert.deepEqual(ids, ['com-tam'])
})

test('catalog covers every type, cuisine, and region', () => {
  const types = new Set(CATALOG.map((d) => d.type))
  const cuisines = new Set(CATALOG.map((d) => d.cuisine))
  const regions = new Set(CATALOG.map((d) => d.region).filter(Boolean))
  assert.deepEqual([...types].sort(), ['banh', 'bun-pho', 'com', 'khac', 'lau', 'mi'])
  assert.ok(CATALOG.some((d) => d.course === 'uong'))
  assert.deepEqual([...cuisines].sort(), ['au', 'han', 'nhat', 'thai', 'viet'])
  assert.deepEqual([...regions].sort(), ['bac', 'nam', 'trung'])
  assert.ok(CATALOG.length >= 50)
  assert.ok(CATALOG.every((d) => d.builtin && d.id && d.name && d.image?.startsWith(`/food/${d.id}.jpg`)))
  assert.ok(CATALOG.every((d) => d.price > 0 && d.course && typeof d.veg === 'boolean'))
  assert.ok(CATALOG.filter((d) => d.veg && d.course === 'chinh').length >= 4)
  assert.ok(CATALOG.every((d) => NAME_EN[d.id]))
})

test('vegetarian filter keeps only veg dishes', () => {
  const ids = eligibleDishes(pool, [], { types: [], cuisines: [], regions: [], veg: true }).map((x) => x.id)
  assert.deepEqual(ids, ['salad'])
})

test('budget keeps dishes at or under the cap', () => {
  const ids = eligibleDishes(pool, [], { types: [], cuisines: [], regions: [], budget: 40 }).map((x) => x.id)
  assert.deepEqual(ids, ['salad'])
})

test('course chip is exclusive', () => {
  const ids = eligibleDishes(pool, [], { types: [], cuisines: [], regions: [], course: 'vat' }).map((x) => x.id)
  assert.deepEqual(ids, ['pizza'])
})
