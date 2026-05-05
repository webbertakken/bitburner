import { NS } from '@ns'
import { createApp } from '@/core/app'

export async function main(ns: NS) {
  const app = await createApp(ns)
  const faction: string = ns.args[0] as string
  try {
    if (!ns.singularity.joinFaction(faction)) throw new Error(`Unable to join.`)
    app.updateFact(`${faction}Joined`, true)
    ns.tprint(`🏛️ Joined ${faction}.`)
  } catch {
    ns.tprint(`❌ Failed to join ${faction}.`)
  }
}
