import { createApp } from '@/core/app'
import { NS } from '@ns'

export async function main(ns: NS) {
  const app = await createApp(ns)
  const t = app.formatters
  const upgradeCpuCost = ns.singularity.getUpgradeHomeCoresCost()
  app.updateFact('upgradeCpuCost', upgradeCpuCost)
  ns.tprint(`ℹ️ Next CPU upgrade costs ${t.money(upgradeCpuCost)}.`)
}
