import { createApp } from '@/core/app'
import { NS } from '@ns'

export async function main(ns: NS) {
  const [killStart] = ns.args

  const app = await createApp(ns)
  await app.openWindow(1)
  ns.clearLog()

  // Close all windows
  const { pid: thisPid } = ns.getRunningScript()!
  const pids = ns
    .ps()
    .filter((x) => x.pid !== thisPid && (killStart || x.filename !== 'start.js'))
    .map((x) => x.pid)

  app.log(`😵 Killing ${pids.length} processes...`)

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
