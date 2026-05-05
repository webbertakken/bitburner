import { describe, expect, it } from 'vitest'

import { set } from './set'

describe('set', () => {
  it('sets a top-level property', () => {
    const obj = {}
    set(obj, 'a', 1)
    expect(obj).toEqual({ a: 1 })
  })

  it('sets a nested property using dot notation', () => {
    const obj = {}
    set(obj, 'a.b.c', 'hello')
    expect(obj).toEqual({ a: { b: { c: 'hello' } } })
  })

  it('sets a nested property using an array path', () => {
    const obj = {}
    set(obj, ['a', 'b'], 42)
    expect(obj).toEqual({ a: { b: 42 } })
  })

  it('overwrites a non-object intermediate node', () => {
    const obj: Record<string, unknown> = { a: 'old' }
    set(obj, 'a.b', 1)
    expect(obj).toEqual({ a: { b: 1 } })
  })

  it('preserves siblings when overwriting one branch', () => {
    const obj = { a: { b: 1, c: 2 } }
    set(obj, 'a.b', 99)
    expect(obj).toEqual({ a: { b: 99, c: 2 } })
  })

  it('returns the same object reference', () => {
    const obj = {}
    expect(set(obj, 'x', 1)).toBe(obj)
  })
})
