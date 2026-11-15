import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveTheme } from '../src/theme.ts'

test('resolveTheme prefers stored value over system', () => {
  assert.equal(resolveTheme('light', true), 'light')
  assert.equal(resolveTheme('dark', false), 'dark')
})

test('resolveTheme follows system when stored is null', () => {
  assert.equal(resolveTheme(null, true), 'dark')
  assert.equal(resolveTheme(null, false), 'light')
})
