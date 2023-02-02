import { openTail, configure } from './utils/index.js'

/** @param {NS} ns */
export async function main(ns) {
  // Tail own window
  await configure(ns)
  await openTail(ns, 1, 2)
  ns.clearLog()

  // Close all windows

  const { pid: thisPid } = ns.getRunningScript()
  const pids = ns.ps().filter(x => x.pid !== thisPid && x.filename !== 'start.js').map(x => x.pid)

  ns.disableLog('kill')
  ns.print(`Killing ${pids.length} processes...`)

  for (const pid of pids) {
    ns.closeTail(pid)
  }
  await ns.sleep(1000)

  // Kill all
  for (const pid of pids) {
    ns.kill(pid)
  }
  await ns.sleep(1000)

  // Close
  await ns.sleep(2000)
  ns.closeTail(thisPid)
}
