import { NS } from '@ns'

export async function main(ns: NS) {
  try {
    ns.singularity.installAugmentations('start.js')
  } catch {
    ns.tprint(`❌ Failed to install augmentations.`)
  }
}
