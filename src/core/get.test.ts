import { describe, expect, it } from 'vitest'

import { get } from './get'

describe('get', () => {
  it('reads a top-level property', () => {
    expect(get({ a: 1 }, 'a')).toBe(1)
  })

  it('reads a nested property using dot notation', () => {
    expect(get({ a: { b: { c: 'hello' } } }, 'a.b.c')).toBe('hello')
  })

  it('reads a nested property using an array path', () => {
    expect(get({ a: { b: 42 } }, ['a', 'b'])).toBe(42)
  })

  it('returns the default value when the path is missing', () => {
    expect(get({}, 'a.b', 'fallback')).toBe('fallback')
  })

  it('returns the default value when an intermediate node is null', () => {
    expect(get({ a: null }, 'a.b', 'fallback')).toBe('fallback')
  })

  it('returns undefined when the path is missing and no default is given', () => {
    expect(get({}, 'a.b')).toBeUndefined()
  })

  it('returns the default when the leaf value is undefined', () => {
    expect(get({ a: { b: undefined } }, 'a.b', 'fallback')).toBe('fallback')
  })

  it('returns null when the leaf value is null (null is a real value, not absent)', () => {
    expect(get({ a: { b: null } }, 'a.b', 'fallback')).toBeNull()
  })
})
