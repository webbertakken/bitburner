import { openTail, configure, getMaxThreads } from './utils/index.js'

const threadsToHack = 200

/** @param {NS} ns */
const maxUtilise = async (ns) => {
  const maxAllocated = .95
  const script = '/dist/grow.js'

  // Calculate threads
  const maxThreads = await getMaxThreads(ns, script)
  const threads = maxThreads * maxAllocated

  // Spawn most instances
  const instanceNum = Math.floor(threads / 50)
  for (let i = 0; i < instanceNum ; i++) {
    ns.run(script, 50)  
  }

  // Spawn exact amount of threads
  const instanceRest = threads % 50
  if (instanceRest > 0) {
    ns.run(script, instanceRest)
  }
}

/** @param {NS} ns */
const spawnCollector = async (ns, target) => {
  ns.run('spawn-collector.js', threadsToHack, target)
}

/** @param {NS} ns */
export async function main(ns) {
  const target = 'harakiri-sushi'

  await configure(ns)
  await openTail(ns, 4)

  await spawnCollector(ns, target)
  await maxUtilise(ns)

  while(true) {
    await ns.sleep(1000)
  }
}