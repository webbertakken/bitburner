import { createApp } from '@/core/app'
import { NS } from '@ns'

export async function main(ns: NS) {
  const app = await createApp(ns)
  const t = app.formatters
  if (ns.singularity.upgradeHomeRam()) {
    app.updateFact('upgradeRamCost', null)
    const newRam = ns.getServerMaxRam('home')
    ns.tprint(`✔️ RAM upgraded to ${t.size(newRam)}.`)
  } else {
    ns.tprint('✖️ RAM upgrade failed.')
  }
}
