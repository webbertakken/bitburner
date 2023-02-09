import { NS } from '@ns'
import { lookup } from '@/tools/lookup'
import { runLocal } from '@/core/runLocal'
import { createApp } from '@/core/app'

export const main = async (ns: NS) => {
  const app = await createApp(ns)
  const host: string = (ns.args[0] as string) || ns.getHostname()
  const node = lookup(ns, host)

  if (!app.getPlugin('singularity')) {
    ns.tprint('❌ Method requires Singularity plugin.')
    return
  }

  const path = node.path.split(' ')
  runLocal(ns, 'plugins/singularity/connect.js', 1, ...path)
}
