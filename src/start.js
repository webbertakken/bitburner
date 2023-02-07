import { createApp } from '/core/app'
import { runLocal } from '/core/runLocal'

/** @param {NS} ns */
export async function main(ns) {
  const app = await createApp(ns)
  await app.openWindow(0)
  const self = 'home'

  // Should always be true, unless you're ready to buy augments.
  const maxSpendingMode = false
  app.registerSetting('maxSpendingMode', maxSpendingMode)

  ns.clearLog()

  // Notify
  const tryNotifyAchieved = async (milestone) => {
    if (await milestone.achieved()) {
      ns.print(`🎉 Milestone achieved.\n\n`)
      return true
    }

    return false
  }

  ns.nuke('n00dles')

  // Strategy
  const milestones = [
    {
      goal: 'get hacking level 150',
      target: 'n00dles',
      achieved: () => ns.hasRootAccess('foodnstuff'),
    },
    {
      goal: 'weaken food n stuff',
      target: 'foodnstuff',
      type: 'weaken',
      achieved: () =>
        ns.getServerSecurityLevel('foodnstuff') === ns.getServerMinSecurityLevel('foodnstuff') ||
        (ns.getHackingLevel() >= 150 && ns.hasRootAccess('harakiri-sushi')),
    },
    {
      goal: 'get hacking level 150',
      target: 'foodnstuff',
      type: 'weaken',
      achieved: () => ns.getHackingLevel() >= 150 && ns.hasRootAccess('harakiri-sushi'),
    },
    {
      goal: 'farm billions, get hacking level',
      target: 'harakiri-sushi',
      achieved: () => ns.getHackingLevel() >= 400 && ns.hasRootAccess('max-hardware'),
    },
    {
      goal: 'farm many billions, get hacking level',
      target: 'max-hardware',
      achieved: () => ns.getHackingLevel() >= 950 && ns.hasRootAccess('zeus-med'),
    },
    {
      goal: 'prepare to farm',
      type: 'weaken',
      target: 'zeus-med',
      achieved: () =>
        ns.getServerSecurityLevel('zeus-med') === ns.getServerMinSecurityLevel('zeus-med') ||
        (ns.getPlayer().money > 500e9 && ns.hasRootAccess('ecorp')),
    },
    {
      goal: 'get to hacking level xxx while spending everything',
      target: 'zeus-med',
      achieved: () => ns.getPlayer().money > 500e9 && ns.hasRootAccess('ecorp'),
    },
    {
      goal: 'weaken ecorp',
      type: 'weaken',
      target: 'ecorp',
      achieved: () => ns.getServerSecurityLevel('ecorp') === ns.getServerMinSecurityLevel('ecorp'),
    },
    {
      goal: 'farm ecorp, buy augments',
      target: 'ecorp',
      achieved: () => false,
    },
  ]

  // Run milestones
  for (const milestone of milestones) {
    const { goal, target, type = 'none' } = milestone
    app.log(`🚀 Running milestone: ${goal}`)
    app.log(`🖥️ Target: ${target}`)

    // Check if milestone is already achieved
    if (await tryNotifyAchieved(milestone)) continue
    app.log(`🏃 Running scripts...`)

    // Kill everything
    runLocal(ns, 'kill.js')
    await ns.sleep(1000)
    // runLocal(ns, 'tools/getBitNodeMultipliers.js', 1) // Source-File 5
    await ns.sleep(1000)

    // Reserve RAM so that the scheduler can run scripts.
    let reserve = 0
    if (ns.getServerMaxRam(self) >= 128) {
      reserve = 32
      runLocal(ns, 'scheduler.js', 1)
    }

    // Run home scripts.
    runLocal(ns, 'monitor.js', 1, target)
    runLocal(ns, 'farmer.js', 1)
    runLocal(ns, 'controller.js', 1, maxSpendingMode)
    runLocal(ns, 'spawner-local.js', 1, target, type, reserve)
    runLocal(ns, 'worm.js', 1, target, type)

    // Wait for milestone to be achieved
    while (!(await tryNotifyAchieved(milestone))) {
      await ns.sleep(1000)
    }
  }
}
