import { NS } from '@ns'
import { createApp } from '@/core/app'

export async function main(ns: NS) {
  const app = await createApp(ns)
  const [faction] = ns.args as [string]
  const favourFactName = `${faction}Favour`

  try {
    const previousValue = app.getFact(favourFactName)
    const favour = Math.floor(ns.singularity.getFactionFavor(faction))
    if (favour !== previousValue) {
      ns.tprint(`🏛️ ${faction} favour is ${favour}.`)
      app.updateFact(favourFactName, favour, true)
    }
  } catch {
    ns.tprint(`❌ Failed to update faction favour for ${faction}`)
  }
}
