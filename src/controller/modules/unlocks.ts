import { NS } from '@ns'
import { createApp } from '@/core/app'
import { runLocal } from '@/core/runLocal'

export const main = async (ns: NS) => {
  const app = await createApp(ns)

  const { maxSpendingMode, upgradeHome } = app.getSettings()
  let upgradeRamCost = app.getFact('upgradeRamCost')
  let upgradeCpuCost = app.getFact('upgradeCpuCost')

  const ramFree = ns.getServerMaxRam('home') - ns.getServerUsedRam('home')
  if (upgradeHome && maxSpendingMode) {
    // Check RAM cost
    if (!upgradeRamCost) {
      await runLocal(ns, `plugins/singularity/getHomeRamCost.js`, 1)
      upgradeRamCost = app.getFact('upgradeRamCost')
    }

    // Upgrade RAM
    if (upgradeRamCost && ns.getPlayer().money >= upgradeRamCost) {
      if (ramFree >= 50) {
        await runLocal(ns, `plugins/singularity/purchaseHomeRam.js`, 1)
      } else {
        ns.tprint(`⚠️ Trying to upgrade RAM, but can't because of irony.`)
      }
    }

    // Check CPU cost
    if (!upgradeCpuCost) {
      await runLocal(ns, `plugins/singularity/getHomeCpuCost.js`, 1)
      upgradeCpuCost = app.getFact('upgradeCpuCost')
    }

    // Upgrade CPU
    if (upgradeCpuCost && ns.getPlayer().money >= upgradeCpuCost) {
      if (ramFree >= 50) {
        await runLocal(ns, `plugins/singularity/purchaseHomeCpu.js`, 1)
      } else {
        ns.tprint(`⚠️ Trying to upgrade CPU, but can't because of insufficient RAM available.`)
      }
    }
  }

  // TOR Router
  if (ns.getPlayer().money >= 200_000 && !ns.hasTorRouter()) {
    await runLocal(ns, `plugins/singularity/buyTor.js`)
  }

  // Programs
  if (ns.getPlayer().money >= 500_000 && !ns.fileExists('BruteSSH.exe', 'home')) {
    await runLocal(ns, `plugins/singularity/buySoftware.js`, 1, 'BruteSSH.exe')
  }

  if (ns.getPlayer().money >= 1.5e6 && !ns.fileExists('FTPCrack.exe', 'home')) {
    await runLocal(ns, `plugins/singularity/buySoftware.js`, 1, 'FTPCrack.exe')
  }

  if (ns.getPlayer().money >= 5e6 && !ns.fileExists('relaySMTP.exe', 'home')) {
    await runLocal(ns, `plugins/singularity/buySoftware.js`, 1, 'relaySMTP.exe')
  }

  if (ns.getPlayer().money >= 30e6 && !ns.fileExists('HTTPWorm.exe', 'home')) {
    await runLocal(ns, `plugins/singularity/buySoftware.js`, 1, 'HTTPWorm.exe')
  }

  if (ns.getPlayer().money >= 250e6 && !ns.fileExists('SQLInject.exe', 'home')) {
    await runLocal(ns, `plugins/singularity/buySoftware.js`, 1, 'SQLInject.exe')
  }

  if (ns.getPlayer().money >= 500_000 && !ns.fileExists('ServerProfiler.exe', 'home')) {
    await runLocal(ns, `plugins/singularity/buySoftware.js`, 1, 'ServerProfiler.exe')
  }

  if (ns.getPlayer().money >= 500_000 && !ns.fileExists('DeepscanV1.exe', 'home')) {
    await runLocal(ns, `plugins/singularity/buySoftware.js`, 1, 'DeepscanV1.exe')
  }

  if (ns.getPlayer().money >= 25e6 && !ns.fileExists('DeepscanV2.exe', 'home')) {
    await runLocal(ns, `plugins/singularity/buySoftware.js`, 1, 'DeepscanV2.exe')
  }

  if (ns.getPlayer().money >= 1e6 && !ns.fileExists('AutoLink.exe', 'home')) {
    await runLocal(ns, `plugins/singularity/buySoftware.js`, 1, 'AutoLink.exe')
  }

  if (ns.getPlayer().money >= 25e9 /* 5e9 */ && !ns.fileExists('Formulas.exe', 'home')) {
    await runLocal(ns, `plugins/singularity/buySoftware.js`, 1, 'Formulas.exe')
  }
}
