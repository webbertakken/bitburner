import { NS } from '@ns'

export async function main(ns: NS) {
  try {
    await ns.sleep(100)
    await ns.singularity.installBackdoor()
    ns.tprint(`💥 Backdoored.`)
    await ns.sleep(100)
  } catch {
    ns.tprint(`❌ Failed to backdoor.`)
  }
}
