import { describe, expect, it } from 'vitest'

import { bestTrades } from './tradesMaxProfit'

describe('bestTrades', () => {
  it('handles the sample dataset (2 trades, 34-day series)', () => {
    const days = [
      33, 139, 9, 128, 106, 84, 145, 114, 100, 66, 4, 161, 134, 168, 13, 97, 25, 51, 70, 27, 80, 19,
      55, 28, 27, 71, 16, 12, 150, 64, 34, 137, 37, 196,
    ]
    expect(bestTrades(days, 2)).toBe(348)
  })

  it('returns 0 for an empty series', () => {
    expect(bestTrades([], 2)).toBe(0)
  })

  it('returns 0 for a strictly decreasing series', () => {
    expect(bestTrades([10, 8, 5, 3, 1], 2)).toBe(0)
  })

  it('returns 0 when zero trades are allowed', () => {
    expect(bestTrades([1, 5, 10], 0)).toBe(0)
  })

  it('uses a single trade for a strictly increasing series when only one trade allowed', () => {
    expect(bestTrades([1, 2, 5, 10], 1)).toBe(9)
  })

  it('uses both trades when there are two distinct upswings', () => {
    // Buy at 1 sell at 5 (+4), buy at 2 sell at 8 (+6), total 10.
    expect(bestTrades([1, 5, 2, 8], 2)).toBe(10)
  })
})
