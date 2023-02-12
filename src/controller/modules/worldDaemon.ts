import { NS } from '@ns'
import { State } from '@/config/settings'
import { createApp } from '@/core/app'
import { runLocal } from '@/core/run'

export const main = async (ns: NS) => {
  const app = await createApp(ns)
  const state = app.getSetting('state')
  if (state !== State.WorldDaemon || ns.getHackingLevel() < 9000) return

  // World daemon
  ns.tprint('🖲️ Go for world daemon')

  // Connect
  const { path } = app.getFact('The-Cave') as NodeInfo
  const worldDaemonPath = `${path} w0r1d_d43m0n`
  await runLocal(ns, `plugins/singularity/connect.js`, 1, worldDaemonPath)

  // Nuke
  ns.brutessh('w0r1d_d43m0n')
  ns.relaysmtp('w0r1d_d43m0n')
  ns.ftpcrack('w0r1d_d43m0n')
  ns.httpworm('w0r1d_d43m0n')
  ns.sqlinject('w0r1d_d43m0n')
  ns.nuke('w0r1d_d43m0n')

  // Backdoor
  await runLocal(ns, `plugins/singularity/backdoor.js`)
}
