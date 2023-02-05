import { fillAllocation } from '/core/fillAllocation'

/** @param {NS} ns */
export async function main(ns) {
  const self = ns.getHostname()
  const [target, type] = ns.args

  if (type === 'weaken') {
    await fillAllocation(ns, ['weaken.js', target])
    return
  }

  if (ns.getServerMaxRam(self) > 500) {
    ns.run('collector.js', 200, target)
  }

  await fillAllocation(ns, ['grow.js', target], 0.7)
  await fillAllocation(ns, ['weaken.js', target])
}
