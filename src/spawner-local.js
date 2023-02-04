import { window, configure, getMaxThreads } from './utils/index.js'

const threadsToHack = 200

const fillAllocation = async (ns, scriptWithArgs, utilisation = 1) => {
  const [script, ...args] = scriptWithArgs

  ns.tprint(`Spawning ${script} ${args.join(' ')} with ${utilisation * 100}% utilisation`)

  // Calculate threads
  const maxThreads = await getMaxThreads(ns, script, 20)
  const threads = maxThreads * utilisation

  // Spawn most instances
  const numInstances = Math.floor(threads / 50)
  for (let i = 0; i < numInstances; i++) {
    ns.run(script, 50, ...[...args, i])
    await ns.sleep(500)
  }

  // Spawn exact amount of threads
  const instanceRest = threads % 50
  if (instanceRest > 0) {
    ns.run(script, instanceRest, ...[...args, numInstances])
  }

  await ns.sleep(50)
}

/** @param {NS} ns */
const spawnCollector = async (ns, target) => {
  ns.run('collector.js', threadsToHack, target)
}

/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0]

  await configure(ns)
  await window(ns, 5)

  // never utilise 100% because it causes trouble when reloading a script that because bigger
  await spawnCollector(ns, target)
  await fillAllocation(ns, ['/dist/grow.js', target], 0.45) // leave a lot of space for weaken on home
  await fillAllocation(ns, ['/dist/weaken.js', target], 0.9)

  while (true) {
    await ns.sleep(1000)
  }
}
