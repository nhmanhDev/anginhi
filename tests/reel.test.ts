import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { buildReel, idleReel, reelOffset, CARD_STEP, CARD_WIDTH, WIN_INDEX } from '../src/reel.ts'
import type { Dish } from '../src/types.ts'

const dish = (id: string): Dish => ({
  id,
  name: id,
  type: 'com',
  cuisine: 'viet',
  region: 'nam',
  builtin: true,
  price: 45,
  veg: false,
  course: 'chinh',
})

describe('reel', () => {
  it('places the winner at a fixed index', () => {
    const pool = [dish('a'), dish('b'), dish('c')]
    const reel = buildReel(pool, pool[1]!, () => 0)
    assert.equal(reel[WIN_INDEX]?.id, 'b')
    assert.equal(reel.length, WIN_INDEX + 5)
  })

  it('centers a card in the viewport', () => {
    assert.equal(reelOffset(0, 1000), 500 - CARD_WIDTH / 2)
    assert.equal(reelOffset(2, 1000), 500 - CARD_WIDTH / 2 - 2 * CARD_STEP)
  })

  it('repeats the pool for an idle strip', () => {
    const pool = [dish('a'), dish('b')]
    const reel = idleReel(pool)
    assert.equal(reel.length, 16)
    assert.equal(reel[0]?.id, 'a')
    assert.equal(reel[1]?.id, 'b')
  })
})
