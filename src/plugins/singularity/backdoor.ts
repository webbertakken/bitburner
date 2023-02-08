import { NS } from '@ns'

export async function main(ns: NS) {
  try {
    await ns.singularity.installBackdoor()
    ns.tprint(`💥 Backdoored ${ns.getHostname()}.`)
  } catch (error) {
    ns.tprint(`❌ Unable to backdoor ${ns.getHostname()}.`)
  }
}
