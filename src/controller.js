import { createApp } from '/core/app'

const unlocks = async (app, ns) => {
  const f = app.formatters

  const myMoney = ns.getPlayer().money

  if (myMoney >= 200_000) {
    // Requires This singularity function requires Source-File 4 to run. A power up you obtain later in the game.
    // ns.hasTorRouter() || ns.print(`Buying Tor Router for ${f.money(200_000)}...`)
    // ns.singularity.purchaseTor()
  }
}

const hardware = async (app, ns, maxSpendingMode) => {
  const f = app.formatters

  // Calculate spending
  const myMoney = ns.getPlayer().money

  // Keep 300M for purchases
  if (maxSpendingMode && myMoney <= 500e6) return

  const spendingMultiplier = maxSpendingMode ? 0.95 : 0.01
  const maxSpendingPerItem = myMoney * spendingMultiplier
  const maxServers = ns.getPurchasedServerLimit()
  const numPurchasedServers = ns.getPurchasedServers().length

  // First buy up to the maximum amount of servers (asap, go over budget)
  if (numPurchasedServers < maxServers) {
    let scale = Math.pow(2, 10) // 1 TB
    const newServerCost = ns.getPurchasedServerCost(scale)
    if (newServerCost < maxSpendingPerItem || (newServerCost <= 100e6 && myMoney >= 100e6)) {
      const nextId = ns.getPurchasedServers().length % maxServers
      const hostname = `webber${nextId}`
      ns.print(`🆕 Buying new server "${hostname}" for ${f.money(newServerCost)}...`)
      ns.purchaseServer(hostname, scale)
    }

    return
  }

  // Then upgrade the servers when affordable
  for (const hostname of ns.getPurchasedServers()) {
    const ram = ns.getServerMaxRam(hostname)
    const nextPower = Math.log2(ram) + 1
    const nextRam = Math.pow(2, nextPower)
    const nextCost = ns.getPurchasedServerUpgradeCost(hostname, nextRam)
    if (nextCost <= maxSpendingPerItem) {
      ns.print(`⏩ Upgrading "${hostname}" to ${nextRam}GB for ${f.money(nextCost)}...`)
      ns.upgradePurchasedServer(hostname, nextRam)
      break
    }
  }
}

/** @param {NS} ns */
export async function main(ns) {
  const app = await createApp(ns)
  await app.window(1, 1)
  const f = app.formatters

  const [maxSpendingMode = false] = ns.args

  // Show all prices once
  ns.print('Purchased server costs:')
  ns.print('-----------------------')
  for (const scale of [Math.pow(2, 10), Math.pow(2, 14), Math.pow(2, 16)]) {
    const cost = ns.getPurchasedServerCost(scale)
    ns.print(`🖥️ Server with ${scale}GB: ${f.money(cost)}`)
  }
  ns.print('-----------------------')
  ns.print('\n')
  ns.print('🏃 Running...')

  while (true) {
    await unlocks(app, ns, maxSpendingMode)
    await hardware(app, ns, maxSpendingMode)
    await ns.sleep(1000)
  }
}
