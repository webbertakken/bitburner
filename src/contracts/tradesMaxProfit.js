import { assertEquals } from 'https://deno.land/std@0.153.0/testing/asserts.ts'

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

Deno.test('bestTrades', async (context) => {
  const testData = [
    [
      2,
      [
        33, 139, 9, 128, 106, 84, 145, 114, 100, 66, 4, 161, 134, 168, 13, 97, 25, 51, 70, 27, 80,
        19, 55, 28, 27, 71, 16, 12, 150, 64, 34, 137, 37, 196,
      ],
      348,
    ],
    // [
    //   7,
    //   [
    //     133, 14, 142, 102, 5, 46, 45, 199, 22, 180, 49, 112, 18, 122, 128, 140, 140, 195, 166, 10,
    //     63, 148, 66, 195, 18, 197, 186, 13, 89, 60, 113, 135, 101, 24, 104, 23, 45, 135,
    //   ],
    //   1143,
    // ],
  ]

  for (const [tradesAllowed, days, expected] of testData) {
    await context.step(`highestTotal of ${tradesAllowed}`, async (test) => {
      const outcome = bestTrades(days, tradesAllowed)
      assertEquals(outcome, expected)
    })
  }
})
