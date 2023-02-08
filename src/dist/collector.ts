import { createApp } from '@/core/app'
import { getMaxThreads } from '@/core/getMaxThreads'
import { NS } from '@ns'

const ramNeededForHack = 0.1

export async function main(ns: NS) {
  const app = await createApp(ns)
  const f = app.formatters

  const target = ns.args[0] as string
  const self = ns.getHostname()

  if (self === 'home') await app.openWindow(6)

  let notifiedServerWait = false
  while (true) {
    const { threads: scriptThreads } = ns.getRunningScript()!
    const ramMaxThreads = await getMaxThreads(ns, ramNeededForHack)
    const maxThreads = Math.min(scriptThreads, ramMaxThreads)
    const max = ns.getServerMaxMoney(target)
    const portionToHack = (max / 5) * 4
    const trigger = max / 10

    if (!notifiedServerWait) {
      ns.print(`⏳ Waiting for server to have ${f.money(portionToHack)} to hack available...`)
      notifiedServerWait = true
    }

    let current = ns.getServerMoneyAvailable(target)
    if (current >= portionToHack) {
      // Measure threads needed to take half
      let threads = Math.ceil(ns.hackAnalyzeThreads(target, portionToHack))

      // Money is already gone
      if (threads <= 0) continue

      // Not enough threads available
      if (threads > maxThreads) {
        app.log(`⚠️ ${self} Not enough threads (need: ${threads} / max: ${maxThreads}).`)
        threads = maxThreads
      }

      let notifiedWaiting = false
      while (true) {
        ns.clearLog()

        // Start the process of taking half when it's 10% full - anticipated to fill to 100% before the process completes.
        current = ns.getServerMoneyAvailable(target)
        if (current >= trigger) {
          let result = 0
          while (result === 0) result = await ns.hack(target, { threads })
          await ns.sleep(1500)
        } else if (!notifiedWaiting) {
          notifiedWaiting = true
          ns.print(
            `⏳ Waiting for money to reach ${f.money(trigger)}.` + ` Current: ${f.money(current)}/${f.money(max)}`,
          )
        }

        await ns.sleep(1000)
      }
    }

    await ns.sleep(1000)
  }
}
