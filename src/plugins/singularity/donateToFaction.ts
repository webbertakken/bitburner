import { NS } from '@ns'
import { createApp } from '@/core/app'

export async function main(ns: NS) {
  const app = await createApp(ns)
  const [faction, amount] = ns.args as [string, number]
  const formattedAmount = app.formatters.money(amount)
  try {
    if (!ns.singularity.donateToFaction(faction, amount)) throw new Error(`Unable to donate ${formattedAmount}.`)
    ns.tprint(`🏛️ Donated ${formattedAmount} to ${faction}.`)
  } catch (error) {
    ns.tprint(`❌ Failed to join ${faction}.`)
  }
}
