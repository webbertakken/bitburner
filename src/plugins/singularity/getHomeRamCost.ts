import { createApp } from '@/core/app'
import { NS } from '@ns'

export async function main(ns: NS) {
  const app = await createApp(ns)
  const t = app.formatters
  const upgradeRamCost = ns.singularity.getUpgradeHomeRamCost()
  app.updateFact('upgradeRamCost', upgradeRamCost)
  ns.tprint(`🛈 Next RAM upgrade costs ${t.money(upgradeRamCost)}.`)
}
