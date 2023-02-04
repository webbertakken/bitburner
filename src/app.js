/** @param {NS} ns */
export const window = async (ns, row = 0, col = 0, rowSpan = 1) => {
  const width = 670
  const height = 220
  const spacer = 10

  // Close previous window
  ns.closeTail()

  // Open new window
  const { pid } = ns.getRunningScript() || { pid: 0 }
  ns.tail(pid)
  await ns.sleep(1) // Need to wait for window to actually spawn
  ns.moveTail(2190 - col * (width + spacer), 10 + row * (height + spacer), pid)
  ns.resizeTail(width, rowSpan * height + (rowSpan - 1) * spacer, pid)
}

/** @param {NS} ns */
export const configure = async (ns) => {
  ns.disableLog('disableLog')
  ns.disableLog('enableLog')
  ns.disableLog('sleep')
  ns.disableLog('getHostname')
  ns.disableLog('getServerMaxRam')
  ns.disableLog('getServerUsedRam')
  ns.disableLog('getScriptRam')
  ns.disableLog('getServerMoneyAvailable')
  ns.disableLog('getServerMaxMoney')
  ns.disableLog('getServerSecurityLevel')
  ns.disableLog('getServerBaseSecurityLevel')
  ns.disableLog('getServerMinSecurityLevel')
  ns.disableLog('getServerGrowth')
  ns.disableLog('getServerRequiredHackingLevel')
  ns.disableLog('getServerNumPortsRequired')
  ns.disableLog('growthAnalyze')
  ns.disableLog('growthAnalyzeSecurity')
  ns.disableLog('getGrowTime')
  ns.disableLog('hackAnalyzeSecurity')
  ns.disableLog('hackAnalyzeChance')
  ns.disableLog('hackAnalyze')
  ns.disableLog('getHackTime')
  ns.disableLog('getHackingLevel')
  ns.disableLog('weakenAnalyze')
  ns.disableLog('getWeakenTime')
  ns.disableLog('brutessh')
  ns.disableLog('httpworm')
  ns.disableLog('ftpcrack')
  ns.disableLog('relaysmtp')
  ns.disableLog('sqlinject')
  ns.disableLog('scan')
  ns.disableLog('scp')
  ns.disableLog('nuke')
  ns.disableLog('killall')
}

/** @param {NS} ns */
export const getFormatters = (ns) => ({
  money: (amount) => `${ns.nFormat(amount, '$0.00a')}`.toUpperCase(),
  number: (amount) => ns.nFormat(amount, '0.00'),
  percentage: (amount) => ns.nFormat(amount, '0.00%'),
})

export const createApp = async (ns) => {
  await configure(ns)

  // update globals
  console.log = ns.print

  return {
    run: (script, threads, ...args) => {
      ns.disableLog('run')
      const pid = ns.run(script, threads, ...args)

      if (pid === 0) {
        ns.print(`ERROR: ${script} failed to run. Most likely out of RAM.`)
        ns.exit()
      }

      return pid
    },
    sleep: async (ms) => ns.sleep(ms),
    window: async (row, col, rowSpan) => await window(ns, row, col, rowSpan),
  }
}

/** @param {NS} ns */
export const getMaxThreads = async (ns, scriptNameOrRamAmount, saveGb = 0) => {
  const self = ns.getHostname()
  const max = Math.max(0, ns.getServerMaxRam(self) - saveGb)
  const used = ns.getServerUsedRam(self)
  const free = max - used

  const cost =
    typeof scriptNameOrRamAmount === 'string'
      ? ns.getScriptRam(scriptNameOrRamAmount)
      : scriptNameOrRamAmount

  return Math.floor(free / cost)
}

/** @param {NS} ns */
export const getNodeInfo = (ns, nodeId) => {
  const maxRam = ns.getServerMaxRam(nodeId)
  const usedRam = ns.getServerUsedRam(nodeId)

  // Utilised more than 60% of RAM
  // Accurate enough for both small server with little RAM  and big servers that double in size
  let needsPayloadUpdate = maxRam >= 8 && usedRam / maxRam <= 0.6

  return {
    id: nodeId,
    securityLevel: ns.getServerSecurityLevel(nodeId),
    minSecurityLevel: ns.getServerMinSecurityLevel(nodeId),
    reqHackingLevel: ns.getServerRequiredHackingLevel(nodeId),
    reqPorts: ns.getServerNumPortsRequired(nodeId),
    moneys: ns.getServerMoneyAvailable(nodeId),
    formattedMoneys: ns.nFormat(ns.getServerMoneyAvailable(nodeId), '(0.00 a)'),
    maxMoneys: ns.getServerMaxMoney(nodeId),
    formattedMaxMoneys: ns.nFormat(ns.getServerMaxMoney(nodeId), '(0.00 a)'),
    growth: ns.getServerGrowth(nodeId),
    maxRam,
    usedRam,
    needsPayloadUpdate,
    weakenTime: ns.getWeakenTime(nodeId),
    growTime: ns.getGrowTime(nodeId),
    hackTime: ns.getHackTime(nodeId),
    hackChance: ns.hackAnalyzeChance(nodeId),
    formattedHackTime: ns.nFormat(ns.getHackTime(nodeId) / 1000, '(MM:ss)'),
    hasRootAccess: ns.hasRootAccess(nodeId),
  }
}
