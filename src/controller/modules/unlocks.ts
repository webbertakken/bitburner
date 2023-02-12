import { NS } from '@ns'
import { createApp } from '@/core/app'

export const main = async (ns: NS) => {
  const app = await createApp(ns)

  const { maxSpendingMode, upgradeHome } = app.getSettings()
  let upgradeRamCost = app.getFact('upgradeRamCost')
  let upgradeCpuCost = app.getFact('upgradeCpuCost')

  const ramFree = ns.getServerMaxRam('home') - ns.getServerUsedRam('home')
  if (upgradeHome && maxSpendingMode) {
    // Check RAM cost
    if (!upgradeRamCost) {
      const pid = ns.run(`plugins/singularity/getHomeRamCost.js`, 1)
      if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
      upgradeRamCost = app.getFact('upgradeRamCost')
    }

    // Upgrade RAM
    if (upgradeRamCost && ns.getPlayer().money >= upgradeRamCost) {
      if (ramFree >= 50) {
        const pid = ns.run(`plugins/singularity/purchaseHomeRam.js`, 1)
        if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
      } else {
        ns.tprint(`⚠️ Trying to upgrade RAM, but can't because of irony.`)
      }
    }

    // Check CPU cost
    if (!upgradeCpuCost) {
      const pid = ns.run(`plugins/singularity/getHomeCpuCost.js`, 1)
      if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
      upgradeCpuCost = app.getFact('upgradeCpuCost')
    }

    // Upgrade CPU
    if (upgradeCpuCost && ns.getPlayer().money >= upgradeCpuCost) {
      if (ramFree >= 50) {
        const pid = ns.run(`plugins/singularity/purchaseHomeCpu.js`, 1)
        if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
      } else {
        ns.tprint(`⚠️ Trying to upgrade CPU, but can't because of insufficient RAM available.`)
      }
    }
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
