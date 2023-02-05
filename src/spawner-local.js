import { createApp } from './app'

const threadsToHack = 200

const fillAllocation = async (app, ns, scriptWithArgs, utilisation = 1) => {
  const [script, ...args] = scriptWithArgs

  ns.print(`⚒️ Spawning ${script} ${args.join(' ')} with ${utilisation * 100}% utilisation`)

  // Calculate threads
  const maxThreads = await app.getMaxThreads(script, 20)
  const threads = maxThreads * utilisation

  // Spawn most instances
  const numInstances = Math.floor(threads / 50)
  for (let i = 0; i < numInstances; i++) {
    app.run(script, 50, ...args, i)
    await ns.sleep(50)
  }

  // Spawn exact amount of threads
  const instanceRest = threads % 50
  if (instanceRest > 0) {
    app.run(script, instanceRest, ...args, numInstances)
  }

  await ns.sleep(50)
}

/** @param {NS} ns */
const spawnCollector = async (app, ...args) => {
  app.run('/dist/collector.js', threadsToHack, ...args)
}

/** @param {NS} ns */
export async function main(ns) {
  const [target, savingMode] = ns.args

  const app = await createApp(ns)
  await app.window(5)

  // never utilise 100% because it causes trouble when reloading a script that because bigger

  if (!savingMode) {
    await spawnCollector(app, target)
    await fillAllocation(app, ns, ['/dist/grow.js', target], 0.45) // leave a lot of space for weaken on home
    await fillAllocation(app, ns, ['/dist/weaken.js', target], 0.9)
  } else {
    await spawnCollector(app, target, 1)
    await spawnCollector(app, target, 2)
    await spawnCollector(app, target, 3)
    await spawnCollector(app, target, 4)
    await spawnCollector(app, target, 5)
  }

  while (true) {
    await ns.sleep(1000)
  }
}
