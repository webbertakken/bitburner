import { createApp } from '@/core/app'
import { NS } from '@ns'

export async function main(ns: NS) {
  const app = await createApp(ns)
  if (ns.singularity.upgradeHomeCores()) {
    app.updateFact('upgradeCpuCost', null)
    ns.tprint(`✔️ Added an additional core.`)
  } else {
    ns.tprint('✖️ CPU upgrade failed.')
  }
}
