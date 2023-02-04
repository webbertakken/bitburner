const fillAllocation = async (ns, script, utilisation = 1) => {
  const [scriptName, ...args] = script

  // Calculate threads
  const self = ns.getHostname()
  const free = ns.getServerMaxRam(self) - ns.getServerUsedRam(self)
  const cost = ns.getScriptRam(scriptName)
  const threads = Math.floor(free / cost) * utilisation

  // Spawn full pools with 50 threads
  const numInstances = Math.floor(threads / 50)
  for (let i = 0; i < numInstances; i++) {
    ns.run(scriptName, 50, ...[...args, i])
    await ns.sleep(500)
  }

  // Spawn remaining threads
  const instanceRest = threads % 50
  if (instanceRest > 0) ns.run(scriptName, instanceRest, ...[...args, numInstances + 1])
}

/** @param {NS} ns */
export async function main(ns) {
  const self = ns.getHostname()
  const target = ns.args[0]

  if (ns.getServerMaxRam(self) > 500) {
    ns.run('collector.js', 200, target)
  }

  await fillAllocation(ns, ['grow.js', target], 0.7)
  await fillAllocation(ns, ['weaken.js', target], 1)
}
