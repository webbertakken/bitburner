import { createApp } from '@/core/app'
import { runLocal, spawnLocal } from '@/core/runLocal'
import { getMilestones, Milestone } from '@/config/strategy'
import { NS } from '@ns'
import { settings } from '@/config/settings'

export async function main(ns: NS) {
  const app = await createApp(ns, settings)
  await app.openWindow(0)
  const self = 'home'
  ns.clearLog()

  // Notify
  const tryNotifyAchieved = async (milestone: Milestone) => {
    if (!(await milestone.achieved())) return false
    ns.print(`🎉 Milestone achieved.\n\n`)
    return true
  }

  ns.nuke('n00dles')

  // Run milestones
  for (const milestone of getMilestones(ns)) {
    const { goal, target, type = 'none' } = milestone

    // Visual feedback
    app.log(`🚀 Running milestone: ${goal}`)
    app.log(`🖥️ Target: ${target}`)
    if (await tryNotifyAchieved(milestone)) continue
    app.log(`🏃 Running scripts...`)

    // Reserve RAM so that the controller can run scripts.
    let reserve = 8
    if (ns.getServerMaxRam(self) >= 128) reserve = 32
    if (ns.getServerMaxRam(self) >= 256) reserve = 64
    if (ns.getServerMaxRam(self) >= 512) reserve = 128

    // Prepare
    await runLocal(ns, 'tools/kill.js')
    await runLocal(ns, 'plugins/register.js')

    // Run logic
    spawnLocal(ns, 'monitor.js', 1, target)
    spawnLocal(ns, 'worm.js', 1, target, type)
    spawnLocal(ns, 'controller/controller.js', 1)
    spawnLocal(ns, 'spawner-local.js', 1, target, type, reserve)

    // Wait for milestone to be achieved
    while (!(await tryNotifyAchieved(milestone))) {
      await ns.sleep(1000)
    }
  }
}
