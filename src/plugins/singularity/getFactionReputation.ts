import { NS } from '@ns'
import { createApp } from '@/core/app'

export async function main(ns: NS) {
  const app = await createApp(ns)
  const [faction] = ns.args as [string]
  const reputationFactName = `${faction}Reputation`

  try {
    const previousValue = app.getFact(reputationFactName)
    const reputation = Math.floor(ns.singularity.getFactionRep(faction) / 1000) * 1000
    if (reputation !== previousValue) {
      // ns.tprint(`🏛️ ${faction} reputation is ${reputation} (rounded per 1k).`)
      app.updateFact(reputationFactName, reputation, true)
    }
  } catch (error) {
    ns.tprint(`❌ Failed to update faction reputation for ${faction}`)
  }
}
