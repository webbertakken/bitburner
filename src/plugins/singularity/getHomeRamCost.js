import { createApp } from '/core/app.js'

/** @param {NS} ns */
export async function main(ns) {
  const app = await createApp(ns)
  const t = app.formatters
  const upgradeRamCost = ns.singularity.getUpgradeHomeRamCost()
  app.updateSetting('upgradeRamCost', upgradeRamCost)
  ns.tprint(`🛈 Next RAM upgrade costs ${t.money(upgradeRamCost)}.`)
}
