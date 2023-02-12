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
      app.updateFact('installedAugmentations', installedAugmentations, true)
      app.updateFact('numInstalledAugmentations', numInstalledAugmentations, true)
    }

    // All bought (installed + bought)
    const previousAllBoughtAugmentations = (app.getFact('allBoughtAugmentations') as string[]) || []
    const allBoughtAugmentations = ns.singularity.getOwnedAugmentations(true)
    if (previousAllBoughtAugmentations.length !== allBoughtAugmentations.length) {
      app.updateFact('allBoughtAugmentations', allBoughtAugmentations, true)
      app.updateFact('numAllBoughtAugmentations', allBoughtAugmentations.length, true)
    }

    // Bought this round
    let fluxes = 0
    const boughtAugmentations = allBoughtAugmentations.filter((a) => {
      // Filter out 1 the NeuroFlux Governor from installedAugmentations itself.
      if (a === 'NeuroFlux Governor') fluxes += 1
      return !installedAugmentations.includes(a) || (a === 'NeuroFlux Governor' && fluxes !== 2)
    })
    const previousNumBought = Number(app.getFact('numBoughtAugmentations'))
    const numBoughtAugmentations = boughtAugmentations.length
    if (previousNumBought !== numBoughtAugmentations) {
      app.updateFact('boughtAugmentations', boughtAugmentations, true)
      app.updateFact('numBoughtAugmentations', numBoughtAugmentations, true)
      ns.tprint(`🧬 Bought ${numBoughtAugmentations} augmentations so far (not counting NeuroFlux Governor).`)
    }

    /**
     * Specific augmentations that change gameplay mechanics
     */

    // Removes penalty for working unfocused
    if (installedAugmentations.includes('Neuroreceptor Management Implant')) {
      app.updateFact('hasNeuroreceptorManagementImplant', true, true)
    }
  } catch (error: any) {
    ns.tprint(`❌ Failed to update owned augmentations stats. ${error.message}`)
  }
}
