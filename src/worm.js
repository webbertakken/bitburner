import { createApp } from './app'

const SECONDS = 1000

/** @param {NS} ns */
const createWorm = (app, ns) => {
  const registry = { isInitialRun: true }

  const scanSelf = async () => ({ hackingLevel: ns.getHackingLevel(), id: ns.getHostname() })

  const scanNetwork = async (host) => {
    return ns
      .scan(host)
      .filter((nodeId) => !registry.discovered.includes(nodeId))
      .map(app.getNodeInfo)
      .sort((a, b) => a.securityLevel - b.securityLevel)
  }

  const tryGetAccess = async (node) => {
    if (node.hasRootAccess) {
      // ns.print(`✅ ${node.id} - (${node.maxRam}GB)`)
      return true
    }

    if (node.reqHackingLevel > registry.self.hackingLevel) {
      // ns.print(`❌ ${node.id} - (req hacking level: ${node.reqHackingLevel}).`)
      return false
    }

    let portsLeft = node.reqPorts
    if (portsLeft >= 1) {
      if (ns.fileExists('BruteSSH.exe')) {
        ns.brutessh(node.id)
        portsLeft--
      }
      if (ns.fileExists('HTTPWorm.exe')) {
        ns.httpworm(node.id)
        portsLeft--
      }

      if (ns.fileExists('FTPCrack.exe')) {
        ns.ftpcrack(node.id)
        portsLeft--
      }

      if (ns.fileExists('relaySMTP.exe')) {
        ns.relaysmtp(node.id)
        portsLeft--
      }

      if (ns.fileExists('SQLInject.exe')) {
        ns.sqlinject(node.id)
        portsLeft--
      }
    }

    if (portsLeft >= 1) {
      // ns.print(`❌ ${node.id} - ${portsLeft} ports left.`)
      return false
    }

    ns.nuke(node.id)
    ns.print(`✅ ${node.id} - Successfully cracked.`)
    registry.hasNewNodes = true
    registry.exploited.push(node.id)
    return true
  }

  const deliverPayload = async (node) => {
    const { id: host } = node

    const self = ns.getHostname()

    // Skip problematic hosts
    const exclusions = ['CSEC', 'the-hub', 'zb-institute', 'solaris']
    if (exclusions.includes(host)) return

    // Copy scripts
    const scripts = [
      { script: '/dist/weaken.js', remoteScript: 'weaken.js' },
      { script: '/dist/grow.js', remoteScript: 'grow.js' },
      { script: '/dist/spawner.js', remoteScript: 'spawner.js', init: true },
      { script: 'app.js', remoteScript: 'app.js' },
      { script: '/dist/collector.js', remoteScript: 'collector.js' },
    ]

    for (const { script, remoteScript } of scripts) {
      const uploadSuccess = ns.scp(script, host, self)
      if (!uploadSuccess) throw new Error(`Failed to upload ${script} to ${host}`)
      if (remoteScript !== script) ns.mv(host, script, remoteScript)
    }

    // Run script
    ns.killall(host)
    await ns.sleep(1000)
    const { remoteScript } = scripts.find(({ init }) => init)
    app.runRemote(remoteScript, host, 1, registry.target)
    ns.print(`📦 Deployed payload to ${host}`)
  }

  const exploitNetwork = async (nodeId = registry.self.id) => {
    const network = await scanNetwork(nodeId)
    // Deliver payloads
    for (const node of network) {
      registry.discovered.push(node.id)

      if (await tryGetAccess(node)) {
        registry.exploited.push(node.id)

        if (node.needsPayloadUpdate) {
          await deliverPayload(node)
        }
      }
      await ns.sleep(1)
    }

    // Recursive
    for (const node of network) {
      await exploitNetwork(node.id)
    }
  }

  return {
    run: async (target) => {
      registry.target = target
      registry.self = await scanSelf()
      registry.discovered = []
      registry.exploited = []
      registry.hasNewNodes = registry.isInitialRun || false

      // Get access to target first
      while (!(await tryGetAccess(app.getNodeInfo(registry.target)))) {
        ns.clearLog()
        ns.print(`🏃 Running...`)
        ns.print(`⚠️ Unable to attain access to ${registry.target}...`)
        ns.print(`   No payloads will be deployed. Retrying every second...`)
        await ns.sleep(1000)
      }

      // Exploit network and attack target
      await exploitNetwork()

      if (registry.hasNewNodes) {
        ns.print(`🎯 Exploited ${registry.exploited.length}/${registry.discovered.length} nodes.`)
      }

      registry.isInitialRun = false
      await ns.sleep(12 * SECONDS)
    },
  }
}

/** @param {NS} ns */
export async function main(ns) {
  const app = await createApp(ns)
  await app.window(3, 0, 2)

  const target = ns.args[0]
  const worm = createWorm(app, ns)

  ns.print(`🏃 Running...`)

  while (true) {
    await worm.run(target)
    await ns.sleep(1000)
  }
}
