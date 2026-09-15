import assert from 'node:assert/strict'
import test from 'node:test'
import { grabSearchUrl, mapsSearchUrl, shopeeSearchUrl } from '../src/maps.ts'
import { fillSlots, pickUnseen, pickWeighted, weightedMean } from '../src/pick.ts'
import { pickDish } from '../src/pick.ts'
import { AREAS } from '../src/areas.ts'

const nearby = AREAS.find((a) => a.id === 'nearby')!
const q1 = AREAS.find((a) => a.id === 'hcm-q1')!

test('nearby query is the dish name only', () => {
  assert.equal(
    mapsSearchUrl('Bún chả', nearby),
    'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Bún chả'),
  )
})

test('grab search uses the dish and area', () => {
  assert.equal(
    grabSearchUrl('Bún chả', q1),
    'https://food.grab.com/vn/vi/restaurants?search=' + encodeURIComponent('Bún chả Quận 1, Hồ Chí Minh'),
  )
})

test('area query appends the area search label', () => {
  assert.equal(
    mapsSearchUrl('Bún chả', q1),
    'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Bún chả Quận 1, Hồ Chí Minh'),
  )
})

test('pickDish uses the supplied draw', () => {
  assert.equal(pickDish(['a', 'b', 'c'], () => 0.99), 'c')
})

test('pickDish throws when the list is empty', () => {
  assert.throws(() => pickDish([]), /empty/)
})

test('shopee search uses the city path', () => {
  assert.equal(
    shopeeSearchUrl('Bún chả', q1),
    'https://shopeefood.vn/ho-chi-minh/food?q=' + encodeURIComponent('Bún chả'),
  )
  const hn = AREAS.find((a) => a.id === 'hn-hoan-kiem')!
  assert.equal(
    shopeeSearchUrl('Bún chả', hn),
    'https://shopeefood.vn/ha-noi/food?q=' + encodeURIComponent('Bún chả'),
  )
})

test('pickWeighted at the cheapest price only draws that price', () => {
  const items = [
    { id: 'cheap', price: 25 },
    { id: 'mid', price: 50 },
    { id: 'dear', price: 90 },
  ]
  assert.equal(pickWeighted(items, 25, () => 0.1).id, 'cheap')
  assert.equal(pickWeighted(items, 25, () => 0.9).id, 'cheap')
})

test('weightedMean sits near the target when the range allows it', () => {
  const items = [
    { price: 25 },
    { price: 50 },
    { price: 50 },
    { price: 90 },
  ]
  const mean = weightedMean(items, 50)
  assert.ok(mean > 40 && mean < 65)
})

test('pickUnseen draws from unmet dishes first', () => {
  const items = [
    { id: 'old', price: 50 },
    { id: 'fresh', price: 50 },
  ]
  assert.equal(pickUnseen(items, ['old'], 50, () => 0.4).id, 'fresh')
  assert.equal(pickUnseen(items, ['old', 'fresh'], 50, () => 0.1).id, 'old')
})

test('fillSlots deals unique dishes while the bag lasts', () => {
  const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
  assert.deepEqual(
    fillSlots(items, 3, () => 0).map((item) => item.id),
    ['a', 'b', 'c'],
  )
})
