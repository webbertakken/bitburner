import { NS } from '@ns'
import { createApp } from '@/core/app'

export async function main(ns: NS) {
  const app = await createApp(ns)
  const [augmentation] = ns.args as [string]
  const augmentationsFactName = `repReqOf${augmentation}`

  try {
    const previousValue = app.getFact(augmentationsFactName) as number | null
    const repReq = ns.singularity.getAugmentationRepReq(augmentation)
    if (repReq !== previousValue) {
      // ns.tprint(`🏛️ ${augmentation} price updated.`)
      app.updateFact(augmentationsFactName, repReq, true)
    }
  } catch {
    ns.tprint(`❌ Could not find reputation requirement of ${augmentation}.`)
  }
}
