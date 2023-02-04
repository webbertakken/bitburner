import { window, configure, getMaxThreads } from './utils/index.js'

const threadsToHack = 200

const fillAllocation = async (ns, script, utilisation = 1) => {
  // Calculate threads
  const maxThreads = await getMaxThreads(ns, script, 20)
  const threads = maxThreads * utilisation

  // Spawn most instances
  const instanceNum = Math.floor(threads / 50)
  for (let i = 0; i < instanceNum; i++) {
    ns.run(script, 50)
  }

  // Spawn exact amount of threads
  const instanceRest = threads % 50
  if (instanceRest > 0) {
    ns.run(script, instanceRest)
  }

  await ns.sleep(50)
}

/** @param {NS} ns */
const spawnCollector = async (ns, target) => {
  ns.run('collector.js', threadsToHack, target)
}

/** @param {NS} ns */
export async function main(ns) {
  const target = 'harakiri-sushi'

  await configure(ns)
  await window(ns, 5)

  // never utilise 100% because it causes trouble when reloading a script that because bigger
  await spawnCollector(ns, target)
  await fillAllocation(ns, '/dist/grow.js', 0.7)
  await fillAllocation(ns, '/dist/weaken.js', 0.9)

  while (true) {
    await ns.sleep(1000)
  }
}
