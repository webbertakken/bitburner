import { NS } from '@ns'

export async function main(ns: NS) {
  try {
    ns.singularity.installAugmentations('start.js')
  } catch (error) {
    ns.tprint(`❌ Failed to install augmentations.`)
  }
}
