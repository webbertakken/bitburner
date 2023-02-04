import { window, configure } from './utils/index.js'

const SECONDS = 1000
const SPACER = 0.75 * SECONDS

/** @param {NS} ns */
const createWorm = (ns) => {
  const registry = {}

  const spacer = async () => await ns.sleep(SPACER)

  const scanSelf = async () => ({ hackingLevel: ns.getHackingLevel() })

  const scanNetwork = async () => {
    return ns
      .scan()
      .map((node) => {
        const maxRam = ns.getServerMaxRam(node)
        const usedRam = ns.getServerUsedRam(node)

        // Utilised more than 60% of RAM
        // Accurate enough for both small server with little RAM  and big servers that double in size
        let needsPayloadUpdate = maxRam >= 8 && usedRam / maxRam <= 0.6

        return {
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
          maxRam,
          usedRam,
          needsPayloadUpdate,
          weakenTime: ns.getWeakenTime(node),
          growTime: ns.getGrowTime(node),
          hackTime: ns.getHackTime(node),
          hackChance: ns.hackAnalyzeChance(node),
          formattedHackTime: ns.nFormat(ns.getHackTime(node) / 1000, '(MM:ss)'),
          hasRootAccess: ns.hasRootAccess(node),
        }
      })
      .sort((a, b) => a.securityLevel - b.securityLevel)
  }

  const tryGetAccess = async (node) => {
    if (node.hasRootAccess) {
      ns.print(`✅ ${node.id} - (${node.maxRam}GB)`)
      return true
    }

    if (node.reqHackingLevel > registry.self.hackingLevel) {
      ns.print(`❌ ${node.id} - (req hacking level: ${node.reqHackingLevel}).`)
      return false
    }

    ns.print(
      `Hacking "${node.id}" (req ports: ${node.reqPorts}, hack time: ${node.formattedHackTime})`,
    )

    if (ns.getServerNumPortsRequired(node.id) >= 1 && ns.fileExists('BruteSSH.exe')) {
      ns.brutessh(node.id)
    }

    if (ns.getServerNumPortsRequired(node.id) >= 1 && ns.fileExists('HTTPWorm.exe')) {
      ns.httpworm(node.id)
    }

    if (ns.getServerNumPortsRequired(node.id) >= 1 && ns.fileExists('FTPCrack.exe')) {
      ns.ftpcrack(node.id)
    }

    if (ns.getServerNumPortsRequired(node.id) >= 1 && ns.fileExists('relaySMTP.exe')) {
      ns.relaysmtp(node.id)
    }

    if (ns.getServerNumPortsRequired(node.id) >= 1 && ns.fileExists('SQLInject.exe')) {
      ns.sqlinject(node.id)
    }

    const portsLeft = ns.getServerNumPortsRequired(node.id)
    if (portsLeft > 0) {
      ns.print(`❌ ${node.id} - ${portsLeft} ports left.`)
      return false
    }

    ns.nuke(node.id)
    ns.print(`✅ ${node.id} - Successfully cracked.`)
    return true
  }

  const deliverPayload = async (node) => {
    const { id: host } = node

    const self = ns.getHostname()

    ns.print('\n')
    ns.print(`--- ${host} ---`)

    // Copy scripts
    const scripts = [
      { script: '/dist/weaken.js', remoteScript: 'weaken.js' },
      { script: '/dist/grow.js', remoteScript: 'grow.js' },
      { script: '/dist/spawner.js', remoteScript: 'spawner.js', init: true },
      { script: '/utils/index.js', remoteScript: '/utils/index.js' },
      { script: 'collector.js', remoteScript: 'collector.js' },
    ]

    for (const { script, remoteScript } of scripts) {
      ns.scp(script, host, self)
      if (remoteScript !== script) ns.mv(host, script, remoteScript)
    }

    // Run script
    ns.disableLog('killall')
    ns.killall(host)
    ns.print('stopping all processes...')
    await ns.sleep(100)

    const { remoteScript } = scripts.find(({ init }) => init)
    ns.exec(remoteScript, host, 1, registry.target)
  }

  const run = async (target) => {
    ns.print(`Running worm...`)
    await spacer()

    registry.target = target
    registry.self = await scanSelf()
    await spacer()

    for (const node of await scanNetwork()) {
      if ((await tryGetAccess(node)) && node.needsPayloadUpdate) {
        await deliverPayload(node)
      }
      await ns.sleep(0.25 * SECONDS)
    }

    ns.print(`Done. (rerun in 12)`)
    await ns.sleep(12 * SECONDS)
  }

  return { run }
}

/** @param {NS} ns */
export async function main(ns) {
  await configure(ns)
  await window(ns, 3, 0, 2)

  const target = ns.args[0] || 'harakiri-sushi'
  const worm = createWorm(ns)

  while (true) {
    await worm.run(target)
    await ns.sleep(1000)
  }
}
