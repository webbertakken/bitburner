import { NS } from '@ns'
import { State } from '@/config/settings'
import { createApp } from '@/core/app'

export const main = async (ns: NS) => {
  const app = await createApp(ns)
  const state = app.getSetting('state')
  if (state !== State.WorldDaemon || ns.getHackingLevel() < 9000) return

  // World daemon
  ns.tprint('🖲️ Go for world daemon')

  // Connect
  const { path } = app.getFact('The-Cave') as NodeInfo
  const worldDaemonPath = `${path} w0r1d_d43m0n`
  const pid1 = ns.run(`plugins/singularity/connect.js`, 1, worldDaemonPath)
  if (pid1 > 0) while (ns.isRunning(pid1)) await ns.sleep(1)

  // Nuke
  ns.brutessh('w0r1d_d43m0n')
  ns.relaysmtp('w0r1d_d43m0n')
  ns.ftpcrack('w0r1d_d43m0n')
  ns.httpworm('w0r1d_d43m0n')
  ns.sqlinject('w0r1d_d43m0n')
  ns.nuke('w0r1d_d43m0n')

  // Backdoor
  const pid2 = ns.run(`plugins/singularity/backdoor.js`)
  if (pid2 > 0) while (ns.isRunning(pid2)) await ns.sleep(1)
}
