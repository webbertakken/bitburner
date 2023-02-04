import { createApp } from './app'

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
    },
    {
      goal: 'farm billions, get hacking level 500',
      target: 'harakiri-sushi',
      achieved: () => false,
    },
  ]

  // Run milestones
  for (const milestone of milestones) {
    const { goal, target } = milestone
    ns.print(`🚀 Running milestone: ${goal}`)
    ns.print(`🖥️ Target: ${target}`)

    // Check if milestone is already achieved
    if (await tryNotifyAchieved(milestone)) continue
    ns.print(`🏃 Running scripts...`)

    // Kill everything
    app.run('kill.js')
    await ns.sleep(2000)

    // Run home scripts.
    app.run('monitor.js', 1, target)
    app.run('farmer.js', 1)
    app.run('controller.js', 1)
    app.run('spawner-local.js', 1, target)
    app.run('worm.js', 1, target)

    // Wait for milestone to be achieved
    while (!(await tryNotifyAchieved(milestone))) {
      await ns.sleep(1000)
    }
  }
}
