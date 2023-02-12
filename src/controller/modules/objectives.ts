import { NS } from '@ns'
import { createApp } from '@/core/app'
import { runLocal } from '@/core/run'

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

    if (
      (await runLocal(ns, `plugins/singularity/connect.js`, 1, path)) &&
      (await runLocal(ns, `plugins/singularity/backdoor.js`))
    ) {
      app.updateFact(factName, true)
    }

    await runLocal(ns, `plugins/singularity/connect.js`)
  }
}
