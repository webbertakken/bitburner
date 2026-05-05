/**
 * Solver for the bitburner "Algorithmic Stock Trader II/III/IV"
 * coding contracts. Returns the maximum profit obtainable on a sequence of
 * daily prices given a maximum number of buy/sell transactions.
 *
 * Naive O(n^2 \u00b7 tradesAllowed) recursion. Sufficient for the
 * contract's input sizes; not optimal for arbitrary inputs.
 */
export function bestTrades(
  days: number[],
  tradesAllowed = 2,
  start = 0,
  trades = 0,
  profit = 0,
): number {
  if (trades === tradesAllowed || start === days.length) return profit

  let highest = profit
  for (let i = start; i < days.length; i++) {
    for (let j = i + 1; j < days.length; j++) {
      const currentProfit = Math.max(0, days[j] - days[i])
      const newProfit = bestTrades(days, tradesAllowed, j + 1, trades + 1, profit + currentProfit)
      if (newProfit > highest) {
        highest = newProfit
      }
    }
  }

  return highest
}
