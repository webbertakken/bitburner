import { NS } from '@ns'
import { createApp } from '@/core/app'

export const main = async (ns: NS) => {
  const app = await createApp(ns)
  const f = app.formatters
  const h = ns.hacknet

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
    ramUpgradeCost: h.getRamUpgradeCost(i, 1),
    coreUpgradeCost: h.getCoreUpgradeCost(i, 1),
    cacheUpgradeCost: h.getCacheUpgradeCost(i, 1),
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
