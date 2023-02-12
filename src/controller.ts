import { NS } from '@ns'
import { createApp } from '@/core/app'
import { DaedalusState, State } from '@/config/settings'

const factions = async (app: App, ns: NS) => {
  let factionInvitations = ['initial']
  while (factionInvitations && factionInvitations.length >= 1) {
    // Get faction invitations
    const pid1 = ns.run(`plugins/singularity/getFactionInvitations.js`, 1)
    if (pid1 <= 0) return
    while (ns.isRunning(pid1)) await ns.sleep(1)
    factionInvitations = (app.getFact('factionInvitations') as string[]) || []

    // Join factions
    if (factionInvitations.length >= 1) {
      const pid2 = ns.run(`plugins/singularity/joinFaction.js`, 1, factionInvitations[0])
      if (pid2 <= 0) return
      while (ns.isRunning(pid2)) await ns.sleep(1)

      // Work for faction
      const pid3 = ns.run(`plugins/singularity/workForFaction.js`, 1, factionInvitations[0])
      if (pid3 <= 0) return
      while (ns.isRunning(pid3)) await ns.sleep(1)
    }

    await ns.sleep(10)
  }
}

const objectives = async (app: App, ns: NS) => {
  const backdoors = ['CSEC', 'avmnite-02h', 'I.I.I.I', 'run4theh111z']

  // Reset objectives
  // for (const host of backdoors) {
  //   const factName = `backdoored ${host}`
  //   if (app.getFact(factName) === true) app.updateFact(factName, false)
  // }

  for (const host of backdoors) {
    const factName = `backdoored ${host}`

    const node = app.getFact(host) as NodeInfo
    if (!node) continue
    const { reqHackingLevel, path } = node

    if (app.getFact(factName) === true) continue
    if (ns.getHackingLevel() < reqHackingLevel || !ns.hasRootAccess(host)) continue

    const pid1 = ns.run(`plugins/singularity/connect.js`, 1, path)
    if (pid1 > 0) while (ns.isRunning(pid1)) await ns.sleep(1)

    const pid2 = ns.run(`plugins/singularity/backdoor.js`)
    if (pid2 > 0) {
      while (ns.isRunning(pid2)) await ns.sleep(1)
      app.updateFact(factName, true)
    }

    const pid3 = ns.run(`plugins/singularity/connect.js`)
    if (pid3 > 0) while (ns.isRunning(pid1)) await ns.sleep(1)
  }
}

const unlocks = async (app: App, ns: NS) => {
  const f = app.formatters

  const { maxSpendingMode, upgradeHome } = app.getSettings()
  let upgradeRamCost = app.getFact('upgradeRamCost')

  const plugins = app.getPlugins()

  // Requires This singularity function requires Source-File 4 to run. A power up you obtain later in the game.
  if (!plugins.singularity) return

  const ramFree = ns.getServerMaxRam('home') - ns.getServerUsedRam('home')
  if (upgradeHome && maxSpendingMode) {
    // Check RAM cost
    if (!upgradeRamCost) {
      const pid = ns.run(`plugins/singularity/getHomeRamCost.js`, 1)
      if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
      upgradeRamCost = app.getFact('upgradeRamCost')
    }

    // Upgrade RAM
    if (upgradeRamCost && ns.getPlayer().money >= upgradeRamCost) {
      if (ramFree >= 50) {
        const pid = ns.run(`plugins/singularity/purchaseHomeRam.js`, 1)
        if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
      } else {
        ns.tprint(`⚠️ Trying to upgrade ram, but can't because of irony.`)
      }
    }

    // Todo - Upgrade CPU
    // Todo - Get the free faction thingy
  }

  // TOR Router
  if (ns.getPlayer().money >= 200_000 && !ns.hasTorRouter()) {
    const pid = ns.run(`plugins/singularity/buyTor.js`)
    if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
  }

  // Programs
  if (ns.getPlayer().money >= 500_000 && !ns.fileExists('BruteSSH.exe', 'home')) {
    const pid = ns.run(`plugins/singularity/buySoftware.js`, 1, 'BruteSSH.exe')
    if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
  }

  if (ns.getPlayer().money >= 1.5e6 && !ns.fileExists('FTPCrack.exe', 'home')) {
    const pid = ns.run(`plugins/singularity/buySoftware.js`, 1, 'FTPCrack.exe')
    if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
  }

  if (ns.getPlayer().money >= 5e6 && !ns.fileExists('relaySMTP.exe', 'home')) {
    const pid = ns.run(`plugins/singularity/buySoftware.js`, 1, 'relaySMTP.exe')
    if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
  }

  if (ns.getPlayer().money >= 30e6 && !ns.fileExists('HTTPWorm.exe', 'home')) {
    const pid = ns.run(`plugins/singularity/buySoftware.js`, 1, 'HTTPWorm.exe')
    if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
  }

  if (ns.getPlayer().money >= 250e6 && !ns.fileExists('SQLInject.exe', 'home')) {
    const pid = ns.run(`plugins/singularity/buySoftware.js`, 1, 'SQLInject.exe')
    if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
  }

  if (ns.getPlayer().money >= 500_000 && !ns.fileExists('ServerProfiler.exe', 'home')) {
    const pid = ns.run(`plugins/singularity/buySoftware.js`, 1, 'ServerProfiler.exe')
    if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
  }

  if (ns.getPlayer().money >= 500_000 && !ns.fileExists('DeepscanV1.exe', 'home')) {
    const pid = ns.run(`plugins/singularity/buySoftware.js`, 1, 'DeepscanV1.exe')
    if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
  }

  if (ns.getPlayer().money >= 25e6 && !ns.fileExists('DeepscanV2.exe', 'home')) {
    const pid = ns.run(`plugins/singularity/buySoftware.js`, 1, 'DeepscanV2.exe')
    if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
  }

  if (ns.getPlayer().money >= 1e6 && !ns.fileExists('AutoLink.exe', 'home')) {
    const pid = ns.run(`plugins/singularity/buySoftware.js`, 1, 'AutoLink.exe')
    if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
  }

  if (ns.getPlayer().money >= 25e9 /* 5e9 */ && !ns.fileExists('Formulas.exe', 'home')) {
    const pid = ns.run(`plugins/singularity/buySoftware.js`, 1, 'Formulas.exe')
    if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
  }
}

const hardware = async (app: App, ns: NS) => {
  const f = app.formatters
  const { maxSpendingMode } = app.getSettings()

  while (true) {
    // Calculate spending
    const myMoney = ns.getPlayer().money

    // Note: 0.5 is enough, because you're spending 25 times the maxSpendingPerItem to double capacity.
    // For example, if your next upgrade would cost 1M, it would upgrade every time when you have 2M.
    // In this example you need 26M total instead of 25.1M if you would use a multiplier of 0.99.
    // This strategy allows buying other things of equal cost in between.
    // Note: 0.0099 means you'll only spend 1B if you have 101B. Making it easier to save round numbers.
    const spendingMultiplier = maxSpendingMode ? 0.5 : 0.0099
    const maxSpendingPerItem = myMoney * spendingMultiplier

    // First buy up to the maximum amount of servers
    const maxServers = ns.getPurchasedServerLimit()
    const numPurchasedServers = ns.getPurchasedServers().length
    if (numPurchasedServers < maxServers) {
      const scale = Math.pow(2, 4) // 16GB
      const newServerCost = ns.getPurchasedServerCost(scale)
      if (newServerCost < maxSpendingPerItem || (newServerCost <= 100e6 && myMoney >= 100e6)) {
        const nextId = ns.getPurchasedServers().length % maxServers
        const hostname = `webber${nextId}`
        app.log(`🆕 Buying new server "${hostname}" for ${f.money(newServerCost)}...`)
        ns.purchaseServer(hostname, scale)
      }

      return
    }

    // Then upgrade the servers when affordable
    const servers = ns.getPurchasedServers().sort((a, b) => ns.getServerMaxRam(a) - ns.getServerMaxRam(b))
    for (const hostname of servers) {
      const ram = ns.getServerMaxRam(hostname)
      const nextPower = Math.log2(ram) + 1
      const nextRam = Math.pow(2, nextPower)
      const nextCost = ns.getPurchasedServerUpgradeCost(hostname, nextRam)
      if (nextCost <= maxSpendingPerItem) {
        if (nextCost >= 1e9 && myMoney < 6e9 + nextCost) return // Keep at least 6B at some point
        app.log(`⏩ Upgrading "${hostname}" to ${nextRam}GB for ${f.money(nextCost)}...`)
        ns.upgradePurchasedServer(hostname, nextRam)
        break
      } else {
        return
      }
    }
  }
}

const hacknet = async (app: App, ns: NS) => {
  const f = app.formatters
  const h = ns.hacknet

  const myMoney = ns.getPlayer().money
  const maxSpendingPerItem = Math.min(myMoney, Math.max(106_000, myMoney * 0.001))
  const maxSpendingPerRam = Math.min(myMoney, Math.max(106_000, myMoney * 0.01))

  // Acquire more nodes
  if (h.numNodes() < h.maxNumNodes()) {
    const newNodeCost = h.getPurchaseNodeCost()
    if (newNodeCost < 10e6 && newNodeCost < maxSpendingPerItem) {
      app.log(`🆕 Buying new node (${h.numNodes()}) for ${f.money(newNodeCost)}...`)
      h.purchaseNode()
      return
    }
  }

  if (h.numNodes() === 0) return

  // Get all nodes
  const nodes = Array.from({ length: h.numNodes() }, (e, i) => ({
    ...h.getNodeStats(i),
    levelUpgradeCost: h.getLevelUpgradeCost(i, 10),
    ramUpgradeCost: h.getRamUpgradeCost(i, 1),
    coreUpgradeCost: h.getCoreUpgradeCost(i, 1),
    cacheUpgradeCost: h.getCacheUpgradeCost(i, 1),
    id: i,
  }))

  // Upgrade ram
  const cheapestRamUpgradeNode = nodes.sort((a, b) => a.ramUpgradeCost - b.ramUpgradeCost)[0]
  if (cheapestRamUpgradeNode.ramUpgradeCost < maxSpendingPerRam) {
    app.log(`⬆️ Upgrading 🐏 for ${f.money(cheapestRamUpgradeNode.ramUpgradeCost)}...`)
    h.upgradeRam(cheapestRamUpgradeNode.id, 1)
    return
  }

  // Upgrade level
  const cheapestLevelUpgradeNode = nodes.sort((a, b) => a.levelUpgradeCost - b.levelUpgradeCost)[0]
  if (cheapestLevelUpgradeNode.levelUpgradeCost < maxSpendingPerItem) {
    app.log(`⬆️ Upgrading 🎚️ for ${f.money(cheapestLevelUpgradeNode.levelUpgradeCost)}...`)
    h.upgradeLevel(cheapestLevelUpgradeNode.id, 10)
    return
  }

  // Upgrade core
  const cheapestCoreUpgradeNode = nodes.sort((a, b) => a.coreUpgradeCost - b.coreUpgradeCost)[0]
  if (cheapestCoreUpgradeNode.coreUpgradeCost < maxSpendingPerItem) {
    app.log(`⬆️ Upgrading 🧠 for ${f.money(cheapestCoreUpgradeNode.coreUpgradeCost)}...`)
    h.upgradeCore(cheapestCoreUpgradeNode.id, 1)
    return
  }
}

const augmentations = async (app: App, ns: NS) => {
  // Todo - Chongqing
  //  - Neuregen Gene Modification (40% hack xp)
  //  - Neuralstimulator (12% hack xp) ----
  //  - DataJack (25% hack power)
  // Todo - Sector-12
  //  - Neuralstimulator (12% hack xp) ----
  //  - CashRoot Starter Kit (1M + BruteSSH.exe)
}

const worldDaemon = async (app: App, ns: NS) => {
  const state = app.getSetting('state')
  if (state !== State.WorldDaemon || ns.getHackingLevel() < 9000) return

  // World daemon
  ns.tprint('🖲️ Go for world daemon')

  // Connect
  const { path } = app.getFact('The-Cave') as NodeInfo
  const worldDaemonPath = `${path} w0r1d_d43m0n`
  const pid1 = ns.run(`plugins/singularity/connect.js`, 1, worldDaemonPath)
  if (pid1 > 0) while (ns.isRunning(pid1)) await ns.sleep(1)

  // Nuke
  ns.brutessh('w0r1d_d43m0n')
  ns.relaysmtp('w0r1d_d43m0n')
  ns.ftpcrack('w0r1d_d43m0n')
  ns.httpworm('w0r1d_d43m0n')
  ns.sqlinject('w0r1d_d43m0n')
  ns.nuke('w0r1d_d43m0n')

  // Backdoor
  const pid2 = ns.run(`plugins/singularity/backdoor.js`)
  if (pid2 > 0) while (ns.isRunning(pid2)) await ns.sleep(1)
}

const daedalus = async (app: App, ns: NS) => {
  // Start going for Daedalus after 2500 hacking skill
  let state = app.getSetting('state')
  if (state !== State.Daedalus && ns.getHackingLevel() >= 2500) {
    state = State.Daedalus
    app.updateSetting('state', state)
  }

  // Don't do anything if Daedalus mode is disabled
  if (state !== State.Daedalus) return
  const daedalusState = app.getSetting('daedalusState')
  if (daedalusState === DaedalusState.DisabledThisRun || daedalusState === DaedalusState.Completed) return

  // Stuff that always runs when Daedalus mode is enabled
  const pid = ns.run(`plugins/singularity/getAugmentations.js`)
  if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)

  const pid2 = ns.run(`plugins/singularity/getFactionAugmentations.js`, 1, 'Daedalus')
  if (pid2 > 0) while (ns.isRunning(pid2)) await ns.sleep(1)

  const allDaedalusAugmentations = (app.getFact('allDaedalusAugmentations') as string[]) || []
  const allBoughtAugmentations = (app.getFact('allBoughtAugmentations') as string[]) || []
  const installedAugmentations = (app.getFact('installedAugmentations') as string[]) || []
  const numDaedalusAugments = allDaedalusAugmentations.filter((a) => allBoughtAugmentations.includes(a)).length

  // State machine for Daedalus states
  switch (daedalusState) {
    case DaedalusState.None: {
      if (installedAugmentations.includes('The Red Pill')) {
        ns.tprint('The Red Pill is installed, Daedalus mode is now enabled')
        app.updateSetting('daedalusState', DaedalusState.UnlockPrerequisites)
        break
      }

      if (Number(app.getFact('numInstalledAugmentations')) < 30) {
        app.updateSetting('daedalusState', DaedalusState.DisabledThisRun)
        break
      }

      if (ns.getPlayer().money < 10e9) {
        app.updateSetting('maxSpendingMode', true)
      } else {
        app.updateSetting('maxSpendingMode', false)
      }
      app.updateSetting('buyHardware', true)
      app.updateSetting('buyHacknetNodes', false)
      app.updateSetting('upgradeHome', false)
      app.updateSetting('daedalusState', DaedalusState.UnlockPrerequisites)
      break
    }
    case DaedalusState.UnlockPrerequisites: {
      // Before joining
      if (app.getFact('DaedalusJoined') !== true) {
        if (ns.getHackingLevel() <= 2500) return
        if (ns.getPlayer().money < 1e9) return
        app.updateSetting('maxSpendingMode', false)
        if (ns.getPlayer().money < 100e9) return
        return
      }

      // After joining
      const workingFor = app.getFact('workingFor')
      if (workingFor !== 'Daedalus') {
        const pid = ns.run(`plugins/singularity/workForFaction.js`)
        if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
      }
      app.updateSetting('maxSpendingMode', true)

      // Check if it was bought
      if (installedAugmentations.includes('The Red Pill')) {
        app.updateSetting('daedalusState', DaedalusState.InstalledRedPill)
      } else {
        app.updateSetting('daedalusState', DaedalusState.UnlockDonations)
      }

      break
    }
    case DaedalusState.UnlockDonations: {
      // If we have enough augments, go for red pill
      const pid = ns.run(`plugins/singularity/getFactionFavour.js`, 1, 'Daedalus')
      if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
      const daedalusFavour = Number(app.getFact('DaedalusFavour'))

      if (daedalusFavour >= 10 || numDaedalusAugments >= 2) {
        app.updateSetting('maxSpendingMode', true)
        app.updateSetting('daedalusState', DaedalusState.BuyRedPill)
        return
      }

      // Otherwise, buy augments
      app.updateSetting('maxSpendingMode', false)
      const reputation = Number(app.getFact('DaedalusReputation'))
      if (reputation >= 462_000) {
        // Todo - Buy
        // - Embedded Netburner Module Analyze Engine
        // - Embedded Netburner Module Direct Memory Access Upgrade
        // Todo - Use rest of the money for
        // - NeuroFlux Governor
        // Todo - Install augmentations
        // Todo - Restart instance

        // Finally, go for red pill (in case no restart happens)
        app.updateSetting('daedalusState', DaedalusState.BuyRedPill)
      } else {
        // Todo remove temporary measure
        // app.updateSetting('daedalusState', DaedalusState.BuyRedPill)
      }

      break
    }
    case DaedalusState.BuyRedPill: {
      if (app.getFact('daedalusRedPill') === true) {
        app.updateSetting('daedalusState', DaedalusState.BoughtRedPill)
        return
      }

      const donationAmount = 10e9

      const pid = ns.run(`plugins/singularity/getFactionReputation.js`, 1, 'Daedalus')
      if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
      const reputation = Number(app.getFact('DaedalusReputation'))

      // Donate until 2.5M reputation
      if (ns.getPlayer().money >= donationAmount && reputation < 2.5e6) {
        const pid = ns.run(`plugins/singularity/donateToFaction.js`, 1, 'Daedalus', donationAmount)
        if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
      }

      // Save 200B to buy Neuroflux Governors along with the red pill.
      // This should be fairly quick, as at this stage the money should be flowing in.
      if (reputation >= 2.5e6 && ns.getPlayer().money >= 200e9) {
        // Buy Red Pill
        ns.tprint('🧬 Buy red pill augmentation')
        const pid = ns.run(`plugins/singularity/buyFactionAugmentation.js`, 1, 'Daedalus', 'The Red Pill')
        if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)

        // Check if it was bought
        const pid1 = ns.run(`plugins/singularity/getAugmentations.js`)
        if (pid1 > 0) while (ns.isRunning(pid1)) await ns.sleep(1)
        const boughtAugmentations = (app.getFact('boughtAugmentations') as string[]) || []
        if (!boughtAugmentations.includes('The Red Pill')) {
          ns.tprint('❌ something went wrong trying to buy the red pill')
          return
        }

        // Buy Neuroflux Governors with the rest of the money
        ns.tprint('💡 Buying neuroflux governors with the rest of them money')
        while (true) {
          // Get price
          let pid = ns.run(`plugins/singularity/getAugmentationPrice.js`, 1, 'NeuroFlux Governor')
          if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
          const price = Number(app.getFact('priceOfNeuroFlux Governor'))

          // Get reputation requirement
          pid = ns.run(`plugins/singularity/getAugmentationRepReq.js`, 1, 'NeuroFlux Governor')
          if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
          const repReq = Number(app.getFact('repReqOfNeuroFlux Governor'))

          if (reputation >= repReq && ns.getPlayer().money >= price) {
            pid = ns.run(`plugins/singularity/buyFactionAugmentation.js`, 1, 'Daedalus', 'NeuroFlux Governor')
            if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
            ns.tprint('🧬 Bought neuroflux governor')
          } else {
            break
          }
        }

        app.updateSetting('daedalusState', DaedalusState.BoughtRedPill)
      }

      break
    }
    case DaedalusState.BoughtRedPill: {
      ns.tprint('🧬 Installing augmentations.')
      ns.tprint('♻️ Restarting instance.')
      app.updateSetting('needReset', true)
      app.updateFact('DaedalusJoined', false)
      const pid = ns.run(`plugins/singularity/installAugmentations.js`, 1)
      if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
      break
    }
    case DaedalusState.InstalledRedPill: {
      // Advance to World Daemon when possible
      if (ns.getHackingLevel() >= 9000) {
        app.updateSetting('state', State.WorldDaemon)
        return
      }

      // Get price of next upgrade
      let pid = ns.run(`plugins/singularity/getAugmentationPrice.js`, 1, 'NeuroFlux Governor')
      if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
      const price = Number(app.getFact('priceOfNeuroFlux Governor'))

      // Prefer upgrading home RAM if a few augments cost more.
      const nextRamCosts = Number(app.getFact('upgradeRamCost'))
      if (nextRamCosts > 0 && price * 8 >= nextRamCosts) return

      // Get current reputation
      pid = ns.run(`plugins/singularity/getFactionReputation.js`, 1, 'Daedalus')
      if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
      const reputation = Number(app.getFact('DaedalusReputation'))

      // Get reputation requirement
      pid = ns.run(`plugins/singularity/getAugmentationRepReq.js`, 1, 'NeuroFlux Governor')
      if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
      const repReq = Number(app.getFact('repReqOfNeuroFlux Governor'))

      // Buy Neuroflux Governor
      if (reputation >= repReq && ns.getPlayer().money >= price) {
        pid = ns.run(`plugins/singularity/buyFactionAugmentation.js`, 1, 'Daedalus', 'NeuroFlux Governor')
        if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
        ns.tprint('🧬 Bought neuroflux governor')
      }

      // Donate excess money
      const donationAmount = 10e9
      if (ns.getPlayer().money >= price + donationAmount) {
        const pid = ns.run(`plugins/singularity/donateToFaction.js`, 1, 'Daedalus', donationAmount)
        if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
      }

      // Restart after buying 10 neuroflux governors
      const boughtAugmentations = (app.getFact('boughtAugmentations') as string[]) || []
      if (boughtAugmentations.length >= 10) {
        ns.tprint('🧬 Installing augmentations.')
        ns.tprint('♻️ Restarting instance.')
        app.updateSetting('needReset', true)
        app.updateSetting('DaedalusJoined', false)
        const pid = ns.run(`plugins/singularity/installAugmentations.js`, 1)
        if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
        break
      }

      break
    }
  }
}

export async function main(ns: NS) {
  const app = await createApp(ns)
  await app.openWindow(0, 1)
  const f = app.formatters
  ns.disableLog('run')

  // Show all prices once
  app.log('Purchased server costs:')
  app.log('-----------------------')
  for (const scale of [Math.pow(2, 10), Math.pow(2, 14), Math.pow(2, 16)]) {
    const cost = ns.getPurchasedServerCost(scale)
    app.log(`🖥️ Server with ${scale}GB: ${f.money(cost)}`)
  }
  app.log('-----------------------')
  app.log('\n')
  app.log('🏃 Running...')

  // Todo - remove
  //  - hacknet (ns)	4.00GB
  //  - getPurchasedServers (fn)	2.25GB
  //  - purchaseServer (fn)	2.25GB

  let interval = -1
  while (true) {
    interval++

    const { buyHardware, buyHacknetNodes } = app.getSettings()

    await daedalus(app, ns)
    await worldDaemon(app, ns)
    await augmentations(app, ns)
    if (interval % 10 === 0) await factions(app, ns)
    await objectives(app, ns)
    await unlocks(app, ns)
    if (buyHardware) await hardware(app, ns)
    if (buyHacknetNodes) await hacknet(app, ns)

    await ns.sleep(1000)
  }
}
