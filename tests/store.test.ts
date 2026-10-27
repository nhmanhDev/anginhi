import assert from 'node:assert/strict'
import test from 'node:test'
import { emptyStore, parseStore, writeStore, STORAGE_KEY, STORAGE_FAIL } from '../src/store.ts'

test('parseStore returns emptyStore for garbage', () => {
  assert.deepEqual(parseStore(null), emptyStore())
  assert.deepEqual(parseStore('nope'), emptyStore())
})

test('parseStore keeps valid fields and drops unknown ids in filters', () => {
  const parsed = parseStore({
    v: 1,
    disabled: ['pho-bo', 3],
    custom: [],
    filters: { types: ['com', 'nope'], cuisines: ['viet'], regions: ['nam'] },
    area: 'hcm-q1',
    lastId: 'pho-bo',
    extra: true,
  })
  assert.deepEqual(parsed.disabled, ['pho-bo'])
  assert.deepEqual(parsed.filters.types, ['com'])
  assert.equal(parsed.area, 'hcm-q1')
  assert.equal(parsed.lastId, 'pho-bo')
})

test('parseStore keeps a custom budget amount', () => {
  const parsed = parseStore({
    v: 1,
    filters: { types: [], cuisines: [], regions: [], budget: 80 },
    spendCustom: true,
  })
  assert.equal(parsed.filters.budget, 80)
  assert.equal(parsed.spendCustom, true)
})

test('parseStore maps retired modes back to quẻ and defaults ui.theme', () => {
  assert.equal(parseStore({ v: 1, theme: 'kem', lang: 'zh' }).mode, 'que')
  assert.equal(parseStore({ v: 1, theme: 'muc' }).mode, 'que')
  assert.equal(parseStore({ v: 1, theme: 'cho' }).mode, 'que')
  assert.equal(parseStore({ v: 1, theme: 'meo', lang: 'ja' }).mode, 'que')
  assert.equal(parseStore({ v: 1, mode: 'khui' }).mode, 'que')
  assert.equal(parseStore({ v: 1 }).ui.theme, null)
  assert.equal(parseStore({ v: 1, ui: { theme: 'dark' } }).ui.theme, 'dark')
  assert.equal(parseStore({ v: 1, ui: { theme: 'neon' } }).ui.theme, null)
  assert.equal(parseStore({ v: 1, lang: 'ja' }).lang, 'ja')
  assert.equal(parseStore({ v: 1, lang: 'xx' }).lang, 'vi')
})

test('parseStore keeps seen dish ids', () => {
  const parsed = parseStore({ v: 1, seen: ['pho-bo', 2, 'com-tam'] })
  assert.deepEqual(parsed.seen, ['pho-bo', 'com-tam'])
})

test('writeStore reports failure when setItem throws', () => {
  const result = writeStore(emptyStore(), {
    setItem() {
      throw new Error('quota')
    },
  })
  assert.deepEqual(result, { ok: false, message: STORAGE_FAIL })
})

test('writeStore writes JSON under anginhi-v1', () => {
  const bag: Record<string, string> = {}
  const result = writeStore(emptyStore(), {
    setItem(k, v) {
      bag[k] = v
    },
  })
  assert.equal(result.ok, true)
  assert.equal(JSON.parse(bag[STORAGE_KEY]).v, 1)
})
