import { window, configure } from './utils/index.js'

/** @param {NS} ns */
export async function main(ns) {
  // Tail own window
  await configure(ns)
  await window(ns, 0)
  ns.clearLog()

  // Kill everything
  ns.run('kill.js')
  await ns.sleep(5000)

  // Run home scripts.
  ns.run('monitor.js')
  ns.run('worm.js')
  ns.run('farmer.js')
  ns.run('controller.js')
  ns.run('spawner-local.js')
}
