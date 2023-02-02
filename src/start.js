import { openTail, configure } from './utils/index.js'

/** @param {NS} ns */
export async function main(ns) {
  // Tail own window
  await configure(ns)
  await openTail(ns, 0)
  ns.clearLog()

  // Kill everything
  ns.run('kill.js')
  await ns.sleep(5000)

  // Run home scripts.
  ns.run('monitor.js')
  ns.run('nuker.js')
  ns.run('rent-stuff.js')
  ns.run('spawner-local.js')
}
