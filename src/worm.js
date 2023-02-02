const SECONDS = 1000

const SPACER = 0.75 * SECONDS

/** @param {NS} ns */
const createWorm = (ns) => {
  ns.disableLog('getServerSecurityLevel')
  ns.disableLog('getServerMinSecurityLevel')
  ns.disableLog('getServerRequiredHackingLevel')
  ns.disableLog('getServerMoneyAvailable')
  ns.disableLog('getServerMaxMoney')
  ns.disableLog('getServerGrowth')
  ns.disableLog('getServerMaxRam')
  ns.disableLog('getServerUsedRam')
  ns.disableLog('getWeakenTime')
  ns.disableLog('getGrowTime')
  ns.disableLog('getHackTime')
  ns.disableLog('hackAnalyzeChance')
  ns.disableLog('brutessh')
  ns.disableLog('httpworm')
  ns.disableLog('ftpcrack')
  ns.disableLog('relaysmtp')
  ns.disableLog('getServerNumPortsRequired')


  const registry = {};

  const spacer = async () => await ns.sleep(SPACER);
  const scanSelf = async () => ({
    hackingLevel: ns.getHackingLevel()
  })

  const scanNetwork = async () => {
    return ns.scan().map(node => ({
      id: node,
      securityLevel: ns.getServerSecurityLevel(node),
      minSecurityLevel: ns.getServerMinSecurityLevel(node),
      reqHackingLevel: ns.getServerRequiredHackingLevel(node),
      reqPorts: ns.getServerNumPortsRequired(node),
      moneys: ns.getServerMoneyAvailable(node),
      formattedMoneys: ns.nFormat(ns.getServerMoneyAvailable(node), '(0.00 a)'),
      maxMoneys: ns.getServerMaxMoney(node),
      formattedMaxMoneys: ns.nFormat(ns.getServerMaxMoney(node), '(0.00 a)'),
      growth: ns.getServerGrowth(node),
      maxRam: ns.getServerMaxRam(node),
      usedRam: ns.getServerUsedRam(node),
      weakenTime: ns.getWeakenTime(node),
      growTime: ns.getGrowTime(node),
      hackTime: ns.getHackTime(node),
      hackChance: ns.hackAnalyzeChance(node),
      formattedHackTime: ns.nFormat(ns.getHackTime(node) / 1000, '(MM:ss)'),
      hasRootAccess: ns.hasRootAccess(node),
    })).sort((a, b) => a.securityLevel - b.securityLevel)
  }

  const getAccess = async (node) => {
    if (node.reqHackingLevel > registry.self.hackingLevel) {
      ns.print(`Can not hack "${node.id}".`)
      return
    }

    if (node.hasRootAccess) {
      ns.print(`✅ ${node.id} (${node.maxRam}GB)`)
      return
    }

    ns.print(`Hacking "${node.id}" (req ports: ${node.reqPorts}, hack time: ${node.formattedHackTime})`)

    if (ns.getServerNumPortsRequired(node.id) >= 1) {
      ns.brutessh(node.id)
    }

    if (ns.getServerNumPortsRequired(node.id) >= 1) {
      ns.httpworm(node.id)
    }

    if (ns.getServerNumPortsRequired(node.id) >= 1) {
      ns.ftpcrack(node.id)
    }

    if (ns.getServerNumPortsRequired(node.id) >= 1) {
      ns.relaysmtp(node.id)
    }

    if (ns.getServerNumPortsRequired(node.id) >= 1) {
      ns.sqlinject(node.id)
    }

    const portsLeft = ns.getServerNumPortsRequired(node.id)
    if (portsLeft === 0) {
      ns.nuke(node.id)
      ns.print(`Successfully cracked.`)
    } else {
      ns.print(`❌ ${node.id} - ${portsLeft} ports left.`)
    }
  }

  const getMoneys = async (node, highestMoney) => {
    ns.print(`---`)
    ns.print(`getting moneys from "${node.id}"`)
    ns.print(`---`)

    ns.print('chance = ', ns.hackAnalyzeChance(node.id), ', security = ', ns.hackAnalyzeSecurity(1, node.id))
    if (ns.hackAnalyzeChance(node.id) < 0.5) {
      ns.print(`Skipping ${node.id} because the initial chance of success is too low`)
    }

    if (ns.hackAnalyzeChance(node.id) < 0.9) {
      await ns.weaken(node.id)
    }

    if (ns.hackAnalyzeChance(node.id) < 0.9) {
      ns.print(`Skipping ${node.id} because the chance of success is too low`)
      return
    }

    if (!node.hasRootAccess) {
      ns.print(`Skipping ${node.id} because no root access.`)
      return
    }

    if (node.moneys <= 10_000) {
      ns.print(`Skipping ${node.id} because has no money.`)
      return
    }

    if (node.moneys < (highestMoney / 10)) {
      ns.print(`Skipping ${node.id} because it only has ${node.formattedMoneys} `)
      return
    }

    await ns.grow(node.id)

    for (let i=1 ; i < 3 ; i++) {
      if (ns.getHackTime(node.id) >= 60) {
        await ns.weaken(node.id)
      }
    }

    await ns.hack(node.id)
  }

  const getMoneys2 = async (node) => {
    ns.print(`${node.id} (security: ${node.securityLevel}/${node.minSecurityLevel}, moneys ${node.formattedMoneys}/${node.formattedMaxMoneys}`)
    ns.print('\n')
    ns.print(`weaken time: ${ns.tFormat(ns.getWeakenTime(node.id))}`)
    ns.print(`weaken effect: ${ns.weakenAnalyze(1, 1)} times10: ${ns.weakenAnalyze(10, 1)}`)
    ns.print('\n')
    ns.print(`hack time: ${ns.tFormat(ns.getHackTime(node.id))}`)
    ns.print(`hack effect: ${ns.hackAnalyze(node.id)}`)
    ns.print(`hack chance: ${ns.hackAnalyzeChance(node.id)}`)
    ns.print(`hack security effect: ${ns.hackAnalyzeSecurity(1, node.id)} times10: ${ns.hackAnalyzeSecurity(10, node.id)}`)
    ns.print('\n')
    ns.print(`grow time: ${ns.tFormat(ns.getGrowTime(node.id))}`)
    ns.print(`grow effect: ${ns.growthAnalyze(node.id, 1.1, 1)}`)
    ns.print(`grow security effect: ${ns.growthAnalyzeSecurity(1, node.id)} times10: ${ns.growthAnalyzeSecurity(10, node.id)} times${Math.round(ns.growthAnalyze(node.id, 1.1, 1))}: ${ns.growthAnalyzeSecurity(Math.round(ns.growthAnalyze(node.id, 1.1, 1)), node.id)}`)
    ns.print('\n')

    while(ns.getServerSecurityLevel(node.id) > ns.getServerMinSecurityLevel(node.id)) {
      await ns.weaken(node.id)
    }

    await ns.grow(node.id)
    await ns.hack(node.id)    
  }

  const run = async () => {
    ns.print(`Running worm...`)
    await spacer()

    registry.self = await scanSelf()
    await spacer()

    for (const node of await scanNetwork()) {
      await getAccess(node, registry)
      await ns.sleep(0.2 * SECONDS)
    }

    for (const node of (await scanNetwork()).sort(({ moneys: a }, { moneys: b }) => b - a)) {
      ns.print(`${node.id} (security: ${node.securityLevel}/${node.minSecurityLevel}, moneys ${node.formattedMoneys}/${node.formattedMaxMoneys}`)  
    }

    // let highestMoney = -1
    // for (const node of (await scanNetwork()).sort(({ moneys: a }, { moneys: b }) => b - a)) {
    //   if (highestMoney < 0) highestMoney = node.moneys
    //   await getMoneys2(node)
    // }

    ns.print(`Done. (rerun in 12)`)
    await ns.sleep(12 * SECONDS)
  }

  return { run }
}

/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('disableLog')
  ns.disableLog('sleep')

  const repeatingMessage = async (count) => {
    for (; count > 0; count--) {
      ns.clearLog()
      ns.print(`Rerunning in ${count}...`)
      await ns.sleep(1 * SECONDS)
    }

    ns.clearLog()
  }

  const worm = createWorm(ns);

  while (true) {
    await worm.run();
    await repeatingMessage(5)
  }
}