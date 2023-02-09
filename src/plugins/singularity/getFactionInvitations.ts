import { NS } from '@ns'
import { createApp } from '@/core/app'

export async function main(ns: NS) {
  const app = await createApp(ns)
  try {
    const previousValue = app.getFact('factionInvitations')
    const invitations = ns.singularity.checkFactionInvitations()

    if (previousValue === invitations) return

    if (invitations.length > 0) ns.tprint(`🏛️ Found ${invitations.length} faction invitations.`)

    app.updateFact('factionInvitations', invitations, true)
  } catch (error) {
    ns.tprint(`❌ Failed to update faction invitations`)
  }
}
