import { createApp } from './app'

const hacknet = async (app, ns) => {
  const f = app.formatters
  const h = ns.hacknet

  const myMoney = ns.getPlayer().money
  const maxSpendingPerItem = myMoney * 0.001

  // Acquire more nodes
  if (h.numNodes() < h.maxNumNodes()) {
    const newNodeCost = h.getPurchaseNodeCost()
    if (newNodeCost < 10e6 && newNodeCost < maxSpendingPerItem) {
      ns.print(`🆕 Buying new node (${h.numNodes()}) for ${f.money(newNodeCost)}...`)
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
  if (cheapestRamUpgradeNode.ramUpgradeCost < maxSpendingPerItem) {
    ns.print(`⬆️🐏 Upgrading ram for ${f.money(cheapestRamUpgradeNode.ramUpgradeCost)}...`)
    h.upgradeRam(cheapestRamUpgradeNode.id, 1)
    return
  }

  // Upgrade level
  const cheapestLevelUpgradeNode = nodes.sort((a, b) => a.levelUpgradeCost - b.levelUpgradeCost)[0]
  if (cheapestLevelUpgradeNode.levelUpgradeCost < maxSpendingPerItem) {
    ns.print(
      `⬆️🎚️ Upgrading 10 levels for ${f.money(cheapestLevelUpgradeNode.levelUpgradeCost)}...`,
    )
    h.upgradeLevel(cheapestLevelUpgradeNode.id, 10)
    return
  }

  // Upgrade core
  const cheapestCoreUpgradeNode = nodes.sort((a, b) => a.coreUpgradeCost - b.coreUpgradeCost)[0]
  if (cheapestCoreUpgradeNode.coreUpgradeCost < maxSpendingPerItem) {
    ns.print(`⬆️🧠 Upgrading core for ${f.money(cheapestCoreUpgradeNode.coreUpgradeCost)}...`)
    h.upgradeCore(cheapestCoreUpgradeNode.id, 1)
    return
  }
}

/** @param {NS} ns */
export async function main(ns) {
  const app = await createApp(ns)
  await app.window(0, 1)

  ns.print('🏃 Running...')

  while (true) {
    await hacknet(app, ns)
    await ns.sleep(1000)
  }
}
