import { NS } from '@ns'
import { createApp } from '@/core/app'

export const main = async (ns: NS) => {
  const app = await createApp(ns)
  const f = app.formatters
  const { maxSpendingMode } = app.getSettings()

  // Show all prices once
  // app.log('Purchased server costs:')
  // app.log('-----------------------')
  // for (const scale of [Math.pow(2, 10), Math.pow(2, 14), Math.pow(2, 16)]) {
  //   const cost = ns.getPurchasedServerCost(scale)
  //   app.log(`🖥️ Server with ${scale}GB: ${f.money(cost)}`)
  // }
  // app.log('-----------------------')
  // app.log('\n')

  while (true) {
    // Calculate spending
    const myMoney = ns.getPlayer().money

    // Note: 0.5 is enough, because you're spending 25 times the maxSpendingPerItem to double capacity.
    // For example, if your next upgrade would cost 1M, it would upgrade every time when you have 2M.
    // In this example you need 26M total instead of 25.1M if you would use a multiplier of 0.99.
    // This strategy allows buying other things of equal cost in between.
    // Note: 0.0099 means you'll only spend 1B if you have 101B. Making it easier to save round numbers.
    const spendingMultiplier = maxSpendingMode ? 0.5 : 0.0099
    const maxSpendingPerItem = myMoney * spendingMultiplier

    // First buy up to the maximum amount of servers
    const maxServers = ns.getPurchasedServerLimit()
    const numPurchasedServers = ns.getPurchasedServers().length
    if (numPurchasedServers < maxServers) {
      const scale = Math.pow(2, 4) // 16GB
      const newServerCost = ns.getPurchasedServerCost(scale)
      if (newServerCost < maxSpendingPerItem || (newServerCost <= 100e6 && myMoney >= 100e6)) {
        const nextId = ns.getPurchasedServers().length % maxServers
        const hostname = `webber${nextId}`
        app.log(`🆕 Buying new server "${hostname}" for ${f.money(newServerCost)}...`)
        ns.purchaseServer(hostname, scale)
      }

      return
    }

    // Then upgrade the servers when affordable
    const servers = ns.getPurchasedServers().sort((a, b) => ns.getServerMaxRam(a) - ns.getServerMaxRam(b))
    let allServersMaxed = true
    for (const hostname of servers) {
      const ram = ns.getServerMaxRam(hostname)
      const nextPower = Math.log2(ram) + 1
      const nextRam = Math.pow(2, nextPower)
      const nextCost = ns.getPurchasedServerUpgradeCost(hostname, nextRam)
      if (!Number.isNaN(nextCost)) allServersMaxed = false
      if (nextCost <= maxSpendingPerItem) {
        if (nextCost >= 1e9 && myMoney < 6e9 + nextCost) return // Keep at least 6B at some point
        app.log(`⏩ Upgrading "${hostname}" to ${nextRam}GB for ${f.money(nextCost)}...`)
        ns.upgradePurchasedServer(hostname, nextRam)
        break
      }
      await ns.sleep(1)
    }

    if (allServersMaxed) {
      ns.tprint('All servers maxed')
      app.updateFact('allServersMaxed', true)
    }

    return
  }
}
