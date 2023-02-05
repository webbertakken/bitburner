import { runLocal } from '/core/runLocal'

export const fillAllocation = async (ns, script, utilisation = 1) => {
  const [scriptName, ...args] = script

  ns.print(`⚒️ Spawning ${script} ${args.join(' ')} with ${utilisation * 100}% utilisation`)

  // Calculate threads
  const self = ns.getHostname()
  const maxRam = ns.getServerMaxRam(self)
  const usedRam = ns.getServerUsedRam(self)
  const leaveFree = self === 'home' ? 32 : 0
  const freeRam = maxRam - usedRam - leaveFree
  const scriptCost = ns.getScriptRam(scriptName)
  const poolSize = Math.max(50, maxRam / 18)
  const threads = Math.floor(freeRam / scriptCost) * utilisation

  // Spawn full pools of threads
  const numInstances = Math.floor(threads / poolSize)
  for (let i = 0; i < numInstances; i++) {
    runLocal(ns, scriptName, poolSize, ...[...args, i])
  }

  // Spawn remaining threads
  const instanceRest = threads % poolSize
  if (instanceRest > 0) runLocal(ns, scriptName, instanceRest, ...[...args, numInstances + 1])

  await ns.sleep(1)
}
