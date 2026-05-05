import { describe, expect, it } from 'vitest'

import { caesarCipher } from './ceasarCypher'

describe('caesarCipher', () => {
  it('encodes the bitburner sample input by shifting left 5', () => {
    expect(caesarCipher('MACRO DEBUG PRINT FRAME CACHE', 5)).toBe('HVXMJ YZWPB KMDIO AMVHZ XVXCZ')
  })

  it('round-trips when shifted by N then by 26-N', () => {
    const original = 'HELLO WORLD'
    const encoded = caesarCipher(original, 7)
    expect(caesarCipher(encoded, 26 - 7)).toBe(original)
  })

  it('passes spaces and digits through unchanged', () => {
    expect(caesarCipher('A 1 Z', 1)).toBe('Z 1 Y')
  })

  it('handles a key of 0 as identity for uppercase letters', () => {
    expect(caesarCipher('ABCXYZ', 0)).toBe('ABCXYZ')
  })

  it('wraps around the alphabet correctly', () => {
    expect(caesarCipher('A', 1)).toBe('Z')
    expect(caesarCipher('B', 5)).toBe('W')
  })
})
