import { createApp } from '/core/app'
import { runLocal } from '/core/runLocal'
import { getMilestones } from './strategy.js'
import { settings } from './settings.js'

/** @param {NS} ns */
export async function main(ns) {
  const app = await createApp(ns, settings)
  await app.openWindow(0)
  const self = 'home'
  ns.clearLog()

  // Notify
  const tryNotifyAchieved = async (milestone) => {
    if (!(await milestone.achieved())) return false
    ns.print(`🎉 Milestone achieved.\n\n`)
    return true
  }

  ns.nuke('n00dles')

  // Run milestones
  for (const milestone of getMilestones(ns)) {
    const { goal, target, type = 'none' } = milestone
    app.log(`🚀 Running milestone: ${goal}`)
    app.log(`🖥️ Target: ${target}`)

    // Check if milestone is already achieved
    if (await tryNotifyAchieved(milestone)) continue
    app.log(`🏃 Running scripts...`)

    // Kill everything
    runLocal(ns, 'tools/kill.js')
    await ns.sleep(1000)
    // runLocal(ns, 'tools/getBitNodeMultipliers.js', 1) // Source-File 5
    await ns.sleep(1000)

    // Reserve RAM so that the scheduler can run scripts.
    let reserve = 0
    if (ns.getServerMaxRam(self) >= 128) {
      reserve = 32
      // runLocal(ns, 'scheduler.js', 1)
    }

    // Run home scripts.
    runLocal(ns, 'monitor.js', 1, target)
    runLocal(ns, 'controller.js', 1)
    runLocal(ns, 'spawner-local.js', 1, target, type, reserve)
    runLocal(ns, 'worm.js', 1, target, type)

    // Wait for milestone to be achieved
    while (!(await tryNotifyAchieved(milestone))) {
      await ns.sleep(1000)
    }
  }
}
