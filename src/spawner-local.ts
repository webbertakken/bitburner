import { createApp } from '@/core/app'
import { runLocal } from '@/core/runLocal'
import { fillAllocation } from '@/core/fillAllocation'
import { NS } from '@ns'

const spawnCollector = async (app: App, ns: NS, target: string, reserve = 0) => {
  const host = ns.getHostname()
  const cost = ns.getScriptRam('/dist/collector.js')
  const maxReserve = Math.max(0, reserve - ns.getScriptRam('spawner-local.js'))

  const max = ns.getServerMaxRam(host)
  const used = ns.getServerUsedRam(host)
  const free = Math.max(0, max - used - maxReserve)

  const maxThreads = 200
  const threads = Math.min(Math.floor(free / cost), maxThreads)

  runLocal(ns, '/dist/collector.js', threads, target)
  await ns.sleep(1)
}

export async function main(ns: NS) {
  const [target, type, reserve] = ns.args as [string, string, number]

  const app = await createApp(ns)
  await app.openWindow(5)

  // Wait for essential processes to have spawned
  await ns.sleep(10)

  // Note: never utilise 100% because it causes trouble when reloading a script that became bigger.
  if (type === 'weaken') {
    await spawnCollector(app, ns, target, reserve)
    await fillAllocation(ns, ['/dist/weaken.js', target], 1, reserve)
  } else {
    await spawnCollector(app, ns, target, reserve)
    await fillAllocation(ns, ['/dist/grow.js', target], 0.45, reserve) // leave a lot of space for weaken on home
    await fillAllocation(ns, ['/dist/weaken.js', target], 1, reserve)
  }

  while (true) {
    await ns.sleep(1000)
  }
}
