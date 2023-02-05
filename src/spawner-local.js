import { createApp } from '/core/app'
import { runLocal } from '/core/runLocal'
import { fillAllocation } from '/core/fillAllocation'

const threadsToHack = 200

/** @param {NS} ns */
const spawnCollector = async (ns, ...args) => {
  runLocal(ns, '/dist/collector.js', threadsToHack, ...args)
}

/** @param {NS} ns */
export async function main(ns) {
  const [target, savingMode] = ns.args

  const app = await createApp(ns)
  await app.window(5)

  // Note: never utilise 100% because it causes trouble when reloading a script that became bigger.
  if (!savingMode) {
    await spawnCollector(ns, target)
    await fillAllocation(ns, ['/dist/grow.js', target], 0.45) // leave a lot of space for weaken on home
    await fillAllocation(ns, ['/dist/weaken.js', target], 0.9)
  } else {
    await spawnCollector(ns, target, 1)
    await spawnCollector(ns, target, 2)
    await spawnCollector(ns, target, 3)
    await spawnCollector(ns, target, 4)
    await spawnCollector(ns, target, 5)
  }

  while (true) {
    await ns.sleep(1000)
  }
}
