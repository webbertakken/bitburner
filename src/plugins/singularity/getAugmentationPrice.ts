import { NS } from '@ns'
import { createApp } from '@/core/app'

export async function main(ns: NS) {
  const app = await createApp(ns)
  const [augmentation] = ns.args as [string]
  const augmentationsFactName = `priceOf${augmentation}`

  try {
    const previousValue = app.getFact(augmentationsFactName) as number | null
    const price = ns.singularity.getAugmentationPrice(augmentation)
    if (price !== previousValue) {
      // ns.tprint(`🏛️ ${augmentation} price updated.`)
      app.updateFact(augmentationsFactName, price, true)
    }
  } catch (error) {
    ns.tprint(`❌ Could not find price of ${augmentation}.`)
  }
}
