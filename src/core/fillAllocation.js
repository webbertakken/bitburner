import { runLocal } from '/core/runLocal'

export const fillAllocation = async (ns, script, utilisation = 1, reserve = 0) => {
  const [scriptName, ...args] = script

  ns.print(
    `⚒️ Spawning ${script} ${args.join(' ')} with ${Math.round(utilisation * 100)}% utilisation`,
  )

  // Calculate threads
  const self = ns.getHostname()
  const max = ns.getServerMaxRam(self)
  const used = ns.getServerUsedRam(self)
  const free = Math.max(0, max - used - reserve)
  const cost = ns.getScriptRam(scriptName)
  const poolSize = Math.max(50, max / 18)
  const threads = Math.floor((free / cost) * utilisation)

  // Spawn full pools of threads
  const numInstances = Math.floor(threads / poolSize)
  for (let i = 0; i < numInstances; i++) {
    runLocal(ns, scriptName, poolSize, ...[...args, i])
  }

  // Spawn remaining threads
  const instanceRest = threads % poolSize
  if (instanceRest > 0) runLocal(ns, scriptName, instanceRest, ...[...args, numInstances])

  await ns.sleep(2)
}
