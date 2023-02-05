const days = [
  33, 139, 9, 128, 106, 84, 145, 114, 100, 66, 4, 161, 134, 168, 13, 97, 25, 51, 70, 27, 80, 19, 55,
  28, 27, 71, 16, 12, 150, 64, 34, 137, 37, 196,
]

const bestTrades = (days, tradesAllowed = 2, start = 0, trades = 0, profit = 0) => {
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

console.log(bestTrades(days))
