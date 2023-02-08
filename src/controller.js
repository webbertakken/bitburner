import { createApp } from '/core/app'

const objectives = async (app, ns) => {
  if (ns.hackingLevel >= 57 && ns.hasRootAccess('CSEC')) {
  }
}

const unlocks = async (app, ns) => {
  const f = app.formatters
  let { maxSpendingMode, upgradeHome, upgradeRamCost } = app.getSettings()
  const plugins = app.getPlugins()

  // Requires This singularity function requires Source-File 4 to run. A power up you obtain later in the game.
  if (!plugins.singularity) return

  const ramFree = ns.getServerMaxRam('home') - ns.getServerUsedRam('home')
  if (upgradeHome && maxSpendingMode) {
    // Check RAM cost
    if (!upgradeRamCost) {
      const pid = ns.run(`plugins/singularity/getHomeRamCost.js`, 1)
      if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
      upgradeRamCost = app.getSetting('upgradeRamCost')
    }

    // Upgrade RAM
    if (upgradeRamCost && ns.getPlayer().money >= upgradeRamCost) {
      if (ramFree >= 50) {
        const pid = ns.run(`plugins/singularity/purchaseHomeRam.js`, 1)
        if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
      } else {
        ns.tprint(`⚠️ Trying to upgrade ram, but can't because of irony.`)
      }
    }

    // Todo - Upgrade CPU
    // Todo - Get the free faction thingy
  }

  // TOR Router
  if (ns.getPlayer().money >= 200_000 && !ns.hasTorRouter()) {
    const pid = ns.run(`plugins/singularity/buyTor.js`)
    if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
  }

  // Programs
  if (ns.getPlayer().money >= 500_000 && !ns.fileExists('BruteSSH.exe', 'home')) {
    const pid = ns.run(`plugins/singularity/buySoftware.js`, 1, 'BruteSSH.exe')
    if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
  }

  if (ns.getPlayer().money >= 1.5e6 && !ns.fileExists('FTPCrack.exe', 'home')) {
    const pid = ns.run(`plugins/singularity/buySoftware.js`, 1, 'FTPCrack.exe')
    if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
  }

  if (ns.getPlayer().money >= 5e6 && !ns.fileExists('relaySMTP.exe', 'home')) {
    const pid = ns.run(`plugins/singularity/buySoftware.js`, 1, 'relaySMTP.exe')
    if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
  }

  if (ns.getPlayer().money >= 30e6 && !ns.fileExists('HTTPWorm.exe', 'home')) {
    const pid = ns.run(`plugins/singularity/buySoftware.js`, 1, 'HTTPWorm.exe')
    if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
  }

  if (ns.getPlayer().money >= 250e6 && !ns.fileExists('SQLInject.exe', 'home')) {
    const pid = ns.run(`plugins/singularity/buySoftware.js`, 1, 'SQLInject.exe')
    if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
  }

  if (ns.getPlayer().money >= 500_000 && !ns.fileExists('ServerProfiler.exe', 'home')) {
    const pid = ns.run(`plugins/singularity/buySoftware.js`, 1, 'ServerProfiler.exe')
    if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
  }

  if (ns.getPlayer().money >= 500_000 && !ns.fileExists('DeepscanV1.exe', 'home')) {
    const pid = ns.run(`plugins/singularity/buySoftware.js`, 1, 'DeepscanV1.exe')
    if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
  }

  if (ns.getPlayer().money >= 25e6 && !ns.fileExists('DeepscanV2.exe', 'home')) {
    const pid = ns.run(`plugins/singularity/buySoftware.js`, 1, 'DeepscanV2.exe')
    if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
  }

  if (ns.getPlayer().money >= 1e6 && !ns.fileExists('AutoLink.exe', 'home')) {
    const pid = ns.run(`plugins/singularity/buySoftware.js`, 1, 'AutoLink.exe')
    if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
  }

  if (ns.getPlayer().money >= 25e9 /* 5e9 */ && !ns.fileExists('Formulas.exe', 'home')) {
    const pid = ns.run(`plugins/singularity/buySoftware.js`, 1, 'Formulas.exe')
    if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
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
