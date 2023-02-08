import { createApp } from '/core/app'

const unlocks = async (app, ns) => {
  const f = app.formatters
  const { maxSpendingMode } = app.getSettings()
  const plugins = app.getPlugins()

  if (!plugins.singularity) return

  // Todo - Check whether 'home' machine can be upgraded.
  // Todo - Buy tor router
  // Todo - Buy software

  const myMoney = ns.getPlayer().money
  if (myMoney >= 200_000) {
    // Requires This singularity function requires Source-File 4 to run. A power up you obtain later in the game.
    // ns.hasTorRouter() || app.log(`Buying Tor Router for ${f.money(200_000)}...`)
    // ns.singularity.purchaseTor()
  }
}

const hardware = async (app, ns) => {
  const f = app.formatters
  const { maxSpendingMode } = app.getSettings()

  // Calculate spending
  const myMoney = ns.getPlayer().money

  // Note: 0.5 is enough, because you're spending 25 times the maxSpendingPerItem to double capacity.
  // For example, if your next upgrade would cost 1M, it would upgrade every time when you have 2M.
  // In this example you need 26M total instead of 25.1M if you would use a multiplier of 0.99.
  // This strategy allows buying other things of equal cost in between.
  const spendingMultiplier = maxSpendingMode ? 0.5 : 0.01
  const maxSpendingPerItem = myMoney * spendingMultiplier

  // First buy up to the maximum amount of servers
  const maxServers = ns.getPurchasedServerLimit()
  const numPurchasedServers = ns.getPurchasedServers().length
  if (numPurchasedServers < maxServers) {
    let scale = Math.pow(2, 4) // 16GB
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
  const servers = ns
    .getPurchasedServers()
    .sort((a, b) => ns.getServerMaxRam(a) - ns.getServerMaxRam(b))
  for (const hostname of servers) {
    const ram = ns.getServerMaxRam(hostname)
    const nextPower = Math.log2(ram) + 1
    const nextRam = Math.pow(2, nextPower)
    const nextCost = ns.getPurchasedServerUpgradeCost(hostname, nextRam)
    if (nextCost <= maxSpendingPerItem) {
      if (nextCost >= 1e9 && myMoney < 6e9 + nextCost) return // Keep at least 6B at some point
      app.log(`⏩ Upgrading "${hostname}" to ${nextRam}GB for ${f.money(nextCost)}...`)
      ns.upgradePurchasedServer(hostname, nextRam)
      break
    }
  }
}

const hacknet = async (app, ns) => {
  const f = app.formatters
  const h = ns.hacknet
  const { maxSpendingMode } = app.getSettings()

  const myMoney = ns.getPlayer().money
  const maxSpendingPerItem = Math.min(myMoney, Math.max(106_000, myMoney * 0.001))
  const maxSpendingPerRam = Math.min(myMoney, Math.max(106_000, myMoney * 0.01))

  // Acquire more nodes
  if (h.numNodes() < h.maxNumNodes()) {
    const newNodeCost = h.getPurchaseNodeCost()
    if (newNodeCost < 10e6 && newNodeCost < maxSpendingPerItem) {
      app.log(`🆕 Buying new node (${h.numNodes()}) for ${f.money(newNodeCost)}...`)
      h.purchaseNode()
      return
    }
  }

  if (h.numNodes() === 0) return

  // Get all nodes
  const nodes = Array.from({ length: h.numNodes() }, (e, i) => ({
    ...h.getNodeStats(i),
    levelUpgradeCost: h.getLevelUpgradeCost(i, 10),
    ramUpgradeCost: h.getRamUpgradeCost(i),
    coreUpgradeCost: h.getCoreUpgradeCost(i),
    cacheUpgradeCost: h.getCacheUpgradeCost(i),
    id: i,
  }))

  // Upgrade ram
  const cheapestRamUpgradeNode = nodes.sort((a, b) => a.ramUpgradeCost - b.ramUpgradeCost)[0]
  if (cheapestRamUpgradeNode.ramUpgradeCost < maxSpendingPerRam) {
    app.log(`⬆️ Upgrading 🐏 for ${f.money(cheapestRamUpgradeNode.ramUpgradeCost)}...`)
    h.upgradeRam(cheapestRamUpgradeNode.id, 1)
    return
  }

  // Upgrade level
  const cheapestLevelUpgradeNode = nodes.sort((a, b) => a.levelUpgradeCost - b.levelUpgradeCost)[0]
  if (cheapestLevelUpgradeNode.levelUpgradeCost < maxSpendingPerItem) {
    app.log(`⬆️ Upgrading 🎚️ for ${f.money(cheapestLevelUpgradeNode.levelUpgradeCost)}...`)
    h.upgradeLevel(cheapestLevelUpgradeNode.id, 10)
    return
  }

  // Upgrade core
  const cheapestCoreUpgradeNode = nodes.sort((a, b) => a.coreUpgradeCost - b.coreUpgradeCost)[0]
  if (cheapestCoreUpgradeNode.coreUpgradeCost < maxSpendingPerItem) {
    app.log(`⬆️ Upgrading 🧠 for ${f.money(cheapestCoreUpgradeNode.coreUpgradeCost)}...`)
    h.upgradeCore(cheapestCoreUpgradeNode.id, 1)
    return
  }
}

/** @param {NS} ns */
export async function main(ns) {
  const app = await createApp(ns)
  await app.openWindow(0, 1)
  const f = app.formatters

  // Show all prices once
  app.log('Purchased server costs:')
  app.log('-----------------------')
  for (const scale of [Math.pow(2, 10), Math.pow(2, 14), Math.pow(2, 16)]) {
    const cost = ns.getPurchasedServerCost(scale)
    app.log(`🖥️ Server with ${scale}GB: ${f.money(cost)}`)
  }
  app.log('-----------------------')
  app.log('\n')
  app.log('🏃 Running...')

  while (true) {
    const { buyHardware, buyHacknetNodes } = app.getSettings()

    await unlocks(app, ns)
    if (buyHardware) await hardware(app, ns)
    if (buyHacknetNodes) await hacknet(app, ns)

    await ns.sleep(1000)
  }
}
