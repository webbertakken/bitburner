import { NS } from '@ns'
import { createApp } from '@/core/app'
import { runLocal } from '@/core/run'
import { FactionWorkType } from '@/plugins/singularity/workForFaction'

export const main = async (ns: NS) => {
  const app = await createApp(ns)

  let factionInvitations = ['initial']
  while (factionInvitations && factionInvitations.length >= 1) {
    // Get faction invitations
    if (!(await runLocal(ns, `plugins/singularity/getFactionInvitations.js`, 1))) return
    factionInvitations = (app.getFact('factionInvitations') as string[]) || []

    // Join factions
    if (factionInvitations.length >= 1) {
      if (!(await runLocal(ns, `plugins/singularity/joinFaction.js`, 1, factionInvitations[0]))) return

      // // Work for faction
      // const focus = !app.getFact('hasNeuroreceptorManagementImplant')
      // if (
      //   !(await runLocal(
      //     ns,
      //     `plugins/singularity/workForFaction.js`,
      //     1,
      //     factionInvitations[0],
      //     FactionWorkType.hacking,
      //     focus,
      //   ))
      // ) {
      //   return
      // }
    }

    await ns.sleep(10)
  }
}
