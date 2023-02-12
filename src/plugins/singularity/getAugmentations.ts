import { createApp } from '@/core/app'
import { NS } from '@ns'

export async function main(ns: NS) {
  const app = await createApp(ns)
  try {
    // Installed
    const previousNumInstalled = app.getFact('numInstalledAugmentations') as number | 0
    const installedAugmentations = (ns.singularity.getOwnedAugmentations() as string[]) || []
    const numInstalledAugmentations = installedAugmentations.length
    if (previousNumInstalled !== numInstalledAugmentations) {
      ns.tprint(`🧬 Installed ${numInstalledAugmentations} augmentations.`)
      app.updateFact('installedAugmentations', installedAugmentations)
      app.updateFact('numInstalledAugmentations', numInstalledAugmentations)
    }

    // All bought (installed + bought)
    const previousAllBoughtAugmentations = (app.getFact('allBoughtAugmentations') as string[]) || []
    const allBoughtAugmentations = ns.singularity.getOwnedAugmentations(true)
    if (previousAllBoughtAugmentations.length !== allBoughtAugmentations.length) {
      app.updateFact('allBoughtAugmentations', allBoughtAugmentations)
      app.updateFact('numAllBoughtAugmentations', allBoughtAugmentations.length)
    }

    // Bought this round
    const boughtAugmentations = allBoughtAugmentations.filter((a) => !installedAugmentations.includes(a))
    const previousNumBought = Number(app.getFact('numBoughtAugmentations'))
    const numBoughtAugmentations = boughtAugmentations.length
    if (previousNumBought !== numBoughtAugmentations) {
      app.updateFact('boughtAugmentations', boughtAugmentations)
      app.updateFact('numBoughtAugmentations', numBoughtAugmentations)
      ns.tprint(`🧬 Bought ${numBoughtAugmentations} augmentations so far (not counting NeuroFlux Governor).`)
    }
  } catch (error: any) {
    ns.tprint(`❌ Failed to update owned augmentations stats. ${error.message}`)
  }
}
