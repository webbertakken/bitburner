import { NS } from '@ns'
import { createApp } from '@/core/app'

export const main = async (ns: NS) => {
  const app = await createApp(ns)
  const backdoors = ['CSEC', 'avmnite-02h', 'I.I.I.I', 'run4theh111z']

  for (const host of backdoors) {
    const factName = `backdoored ${host}`

    const node = app.getFact(host) as NodeInfo
    if (!node) continue
    const { reqHackingLevel, path } = node

    if (app.getFact(factName) === true) continue
    if (ns.getHackingLevel() < reqHackingLevel || !ns.hasRootAccess(host)) continue

    const pid1 = ns.run(`plugins/singularity/connect.js`, 1, path)
    if (pid1 > 0) while (ns.isRunning(pid1)) await ns.sleep(1)

    const pid2 = ns.run(`plugins/singularity/backdoor.js`)
    if (pid2 > 0) {
      while (ns.isRunning(pid2)) await ns.sleep(1)
      app.updateFact(factName, true)
    }

    const pid3 = ns.run(`plugins/singularity/connect.js`)
    if (pid3 > 0) while (ns.isRunning(pid1)) await ns.sleep(1)
  }
}
