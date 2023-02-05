import { createApp } from '/core/app'
import { runLocal } from '/core/runLocal'

/** @param {NS} ns */
export async function main(ns) {
  const app = await createApp(ns)
  await app.window(0)

  ns.clearLog()

  // Notify
  const tryNotifyAchieved = async (milestone) => {
    if (await milestone.achieved()) {
      ns.print(`🎉 Milestone achieved.\n\n`)
      return true
    }

    return false
  }

  // Strategy
  const milestones = [
    {
      goal: 'get hacking level 150',
      target: 'n00dles',
      achieved: () => ns.getHackingLevel() >= 150,
      maxSpendingMode: true,
    },
    {
      goal: 'farm billions, get hacking level',
      target: 'harakiri-sushi',
      achieved: () => ns.getHackingLevel() >= 400,
      maxSpendingMode: true,
    },
    {
      goal: 'farm many billions, get hacking level',
      target: 'max-hardware',
      achieved: () => ns.getHackingLevel() >= 950,
      maxSpendingMode: true,
    },
    {
      goal: 'prepare to farm',
      type: 'weaken',
      target: 'zeus-med',
      achieved: () =>
        ns.getServerSecurityLevel('zeus-med') === ns.getServerMinSecurityLevel('zeus-med'),
      maxSpendingMode: true,
    },
    {
      goal: 'spend everything on augments',
      target: 'zeus-med',
      achieved: () => false,
      maxSpendingMode: false,
      savingMode: true,
    },
  ]

  // Run milestones
  for (const milestone of milestones) {
    const { goal, target, type = 'none', maxSpendingMode = false, savingMode = false } = milestone
    ns.print(`🚀 Running milestone: ${goal}`)
    ns.print(`🖥️ Target: ${target}`)

    // Check if milestone is already achieved
    if (await tryNotifyAchieved(milestone)) continue
    ns.print(`🏃 Running scripts...`)

    // Kill everything
    runLocal(ns, 'kill.js')
    await ns.sleep(2000)

    // Run home scripts.
    runLocal(ns, 'monitor.js', 1, target)
    runLocal(ns, 'farmer.js', 1)
    runLocal(ns, 'controller.js', 1, maxSpendingMode)
    runLocal(ns, 'spawner-local.js', 1, target, type)
    runLocal(ns, 'worm.js', 1, target, type)

    // Wait for milestone to be achieved
    while (!(await tryNotifyAchieved(milestone))) {
      await ns.sleep(1000)
    }
  }
}
