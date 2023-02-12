import { NS } from '@ns'

export async function main(ns: NS) {
  const [faction, augmentation] = ns.args as [string, string]

  try {
    if (!ns.singularity.purchaseAugmentation(faction, augmentation)) {
      throw new Error(`Unable to purchase ${augmentation} from ${faction}.`)
    }

    ns.tprint(`🧬 Purchased ${augmentation} from ${faction}.`)
  } catch (error: any) {
    ns.tprint(`❌ Failed to purchase augmentation. ${error.message}`)
  }
}
