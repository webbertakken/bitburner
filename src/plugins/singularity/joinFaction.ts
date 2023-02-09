import { NS } from '@ns'

export async function main(ns: NS) {
  const faction: string = ns.args[0] as string
  try {
    ns.singularity.joinFaction(faction)
    ns.tprint(`🏛️ Joined ${faction}.`)
  } catch (error) {
    ns.tprint(`❌ Failed to join ${faction}.`)
  }
}
