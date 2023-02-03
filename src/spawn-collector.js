import { window, configure, getMaxThreads, getFormatters } from './utils/index.js'

const ramNeededForHack = 0.1

/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0]
  const f = getFormatters(ns)

  await configure(ns)
  await window(ns, 5)

  while (true) {
    const { threads: scriptThreads } = ns.getRunningScript()
    const ramMaxThreads = await getMaxThreads(ns, ramNeededForHack)
    const maxThreads = Math.min(scriptThreads, ramMaxThreads)
    const max = ns.getServerMaxMoney(target)
    const half = max / 2
    const trigger = max / 10

    ns.clearLog()
    ns.print(`Waiting for server to have more than half of maximum moneys...`)

    let current = ns.getServerMoneyAvailable(target)
    if (current >= half) {
      // Measure threads needed to take half
      let threads = Math.ceil(ns.hackAnalyzeThreads(target, half))

      // Money is already gone
      if (threads <= 0) continue

      // Not enough threads available
      if (threads > maxThreads) {
        ns.print(`WARNING: Not enough threads (need: ${threads} / max: ${maxThreads}).`)
        threads = maxThreads
      }

      while (true) {
        ns.clearLog()

        // Start the process of taking half when it's 10% full - anticipated to fill to 100% before the process completes.
        current = ns.getServerMoneyAvailable(target)
        if (current >= trigger) {
          let result = 0
          while (result === 0) result = await ns.hack(target, { threads })
          await ns.sleep(1500)
        } else {
          ns.print(
            `Waiting for money to reach ${f.money(trigger)}. Current: ${f.money(current)}/${f.money(
              max,
            )}`,
          )
        }

        await ns.sleep(1000)
      }
    }

    await ns.sleep(1000)
  }
}
