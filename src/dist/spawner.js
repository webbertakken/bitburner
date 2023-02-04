import { createApp } from '/app'

/** @param {NS} ns */
export async function main(ns) {
  const app = await createApp(ns)

  const self = ns.getHostname()
  const target = ns.args[0]

  if (ns.getServerMaxRam(self) > 500) {
    ns.run('collector.js', 200, target)
  }

  await app.fillAllocation(['grow.js', target], 0.7)
  await app.fillAllocation(['weaken.js', target], 1)
}
