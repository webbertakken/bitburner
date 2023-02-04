const fillAllocation = async (ns, script, utilisation = 1) => {
  const [scriptName, ...args] = script

  // Calculate threads
  const self = ns.getHostname()
  const maxRam = ns.getServerMaxRam(self)
  const usedRam = ns.getServerUsedRam(self)
  const freeRam = maxRam - usedRam
  const scriptCost = ns.getScriptRam(scriptName)
  const poolSize = Math.max(50, maxRam / 18)
  const threads = Math.floor(freeRam / scriptCost) * utilisation

  // Spawn full pools of threads
  const numInstances = Math.floor(threads / poolSize)
  for (let i = 0; i < numInstances; i++) {
    ns.run(scriptName, poolSize, ...[...args, i])
  }

  // Spawn remaining threads
  const instanceRest = threads % poolSize
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
