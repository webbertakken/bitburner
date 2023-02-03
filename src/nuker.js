import { window, configure } from './utils/index.js'

/** @param {NS} ns */
export async function main(ns) {
  await configure(ns)

  const self = ns.getHostname()
  const host = 'harakiri-sushi'
  const targetHost = 'harakiri-sushi'

  // Tail own window
  await window(ns, 3)


  ns.print('\n')
  ns.print(`--- ${host} ---`)

  // Get access
  if (!ns.hasRootAccess(host)) ns.nuke(host)

  // Copy script
  const script = '/dist/weaken.js'
  const remoteScript = 'weaken.js'
  ns.scp(script, host, self)
  ns.mv(host, script, remoteScript)

  // Run script
  ns.disableLog('killall')
  ns.killall(host)
  ns.print('stopping all processes...')
  await ns.sleep(2500)

  const max = ns.getServerMaxRam(host)
  const used = ns.getServerUsedRam(host)
  const free = max - used;
  const needed = ns.getScriptRam(remoteScript, host)
  const threads = Math.floor(free / needed)
  ns.exec(remoteScript, host, threads, targetHost)

  while (true) {
    // nothing
    await ns.sleep(1000)
  }
}
