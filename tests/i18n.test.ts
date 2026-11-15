import assert from 'node:assert/strict'
import test from 'node:test'
import { COPY, THEMES, t } from '../src/copy.ts'
import { modeText } from '../src/modes.ts'
import type { Lang } from '../src/types.ts'

const langs: Lang[] = ['vi', 'en', 'zh', 'ko', 'ja', 'hi']

test('every language has the same COPY keys as vi and no empty string', () => {
  const keys = Object.keys(COPY.vi).sort()
  for (const lang of langs) {
    assert.deepEqual(Object.keys(COPY[lang]).sort(), keys, lang)
    for (const key of keys) {
      const value = COPY[lang][key as keyof typeof COPY.vi]
      assert.equal(typeof value, 'string', `${lang}.${key}`)
      assert.ok(value.trim().length > 0, `${lang}.${key} empty`)
    }
  }
})

test('t() returns the table for that language', () => {
  assert.equal(t('zh').close, COPY.zh.close)
  assert.equal(t('vi').brand, 'Ăn gì nhỉ')
})

test('modeText covers quẻ in 6 langs', () => {
  for (const lang of langs) {
    for (const id of THEMES) {
      const line = modeText(id, lang)
      assert.ok(line.title.trim())
      assert.ok(line.pick.trim())
    }
  }
})
