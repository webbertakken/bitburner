import { createApp } from '@/core/app'
import { NS } from '@ns'

export async function main(ns: NS) {
  const app = await createApp(ns)
  try {
    // Installed
    const previousNumInstalled = app.getSetting('numInstalledAugmentations')
    const numInstalledAugmentations = ns.singularity.getOwnedAugmentations()?.length
    if (previousNumInstalled !== numInstalledAugmentations) {
      ns.tprint(`🧬 Installed ${numInstalledAugmentations} augmentations.`)
      app.updateSetting('numInstalledAugmentations', numInstalledAugmentations)
    }

    // Bought
    const previousNumBought = app.getSetting('numBoughtAugmentations')
    const numBoughtAugmentations = ns.singularity.getOwnedAugmentations()?.length - numInstalledAugmentations
    if (previousNumBought !== numBoughtAugmentations) {
      app.updateSetting('numBoughtAugmentations', numBoughtAugmentations)
      ns.tprint(`🧬 Bought ${numBoughtAugmentations} augmentations so far.`)
    }
  } catch (error) {
    ns.tprint(`❌ Failed to get number of augmentations.`)
  }
}
