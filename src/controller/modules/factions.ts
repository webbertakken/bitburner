import { NS } from '@ns'
import { createApp } from '@/core/app'

export const main = async (ns: NS) => {
  const app = await createApp(ns)

  let factionInvitations = ['initial']
  while (factionInvitations && factionInvitations.length >= 1) {
    // Get faction invitations
    const pid1 = ns.run(`plugins/singularity/getFactionInvitations.js`, 1)
    if (pid1 <= 0) return
    while (ns.isRunning(pid1)) await ns.sleep(1)
    factionInvitations = (app.getFact('factionInvitations') as string[]) || []

    // Join factions
    if (factionInvitations.length >= 1) {
      const pid2 = ns.run(`plugins/singularity/joinFaction.js`, 1, factionInvitations[0])
      if (pid2 <= 0) return
      while (ns.isRunning(pid2)) await ns.sleep(1)

      // Work for faction
      const pid3 = ns.run(`plugins/singularity/workForFaction.js`, 1, factionInvitations[0])
      if (pid3 <= 0) return
      while (ns.isRunning(pid3)) await ns.sleep(1)
    }

    await ns.sleep(10)
  }
}
