import { NS } from '@ns'
import { createApp } from '@/core/app'

export async function main(ns: NS) {
  const app = await createApp(ns)
  const [faction] = ns.args as [string]
  const augmentationsFactName = `all${faction}Augmentations`

  try {
    const previousValue = app.getFact(augmentationsFactName) as string[] | null
    const augmentations = ns.singularity.getAugmentationsFromFaction(faction)
    if (augmentations.length !== previousValue?.length) {
      ns.tprint(`🏛️ ${faction} augmentations updated.`)
      app.updateFact(augmentationsFactName, augmentations, true)
    }
  } catch {
    ns.tprint(`❌ Failed to update faction augmentations for ${faction}`)
  }
}
