import assert from 'node:assert/strict'
import test from 'node:test'
import { validateCustomInput } from '../src/dish.ts'

test('rejects empty and too-long names', () => {
  const empty = validateCustomInput(
    { name: '   ', type: 'com', cuisine: 'viet', region: 'nam', price: 45, veg: false, course: 'chinh' },
    0,
  )
  assert.equal(empty.ok, false)
  const long = validateCustomInput(
    { name: 'x'.repeat(61), type: 'com', cuisine: 'viet', region: null, price: 45, veg: false, course: 'chinh' },
    0,
  )
  assert.equal(long.ok, false)
})

test('rejects a 51st custom dish', () => {
  const r = validateCustomInput(
    { name: 'Cơm nhà', type: 'com', cuisine: 'viet', region: 'nam', price: 45, veg: false, course: 'chinh' },
    50,
  )
  assert.equal(r.ok, false)
})

test('strips region on non-Việt cuisine and keeps price', () => {
  const r = validateCustomInput(
    { name: 'Ramen', type: 'mi', cuisine: 'nhat', region: 'bac', price: 80, veg: true, course: 'chinh' },
    0,
  )
  assert.equal(r.ok, true)
  if (r.ok) {
    assert.equal(r.dish.region, null)
    assert.equal(r.dish.price, 80)
    assert.equal(r.dish.veg, true)
  }
})

test('rejects a price outside 10–500', () => {
  const r = validateCustomInput(
    { name: 'Cơm nhà', type: 'com', cuisine: 'viet', region: 'nam', price: 9, veg: false, course: 'chinh' },
    0,
  )
  assert.equal(r.ok, false)
})
