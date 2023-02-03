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
  ns.disableLog('weakenAnalyze')
  ns.disableLog('getWeakenTime')
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
export const getFormatters = (ns) => ({
  money: (amount) => `${ns.nFormat(amount, '$0.00a')}`.toUpperCase(),
  number: (amount) => ns.nFormat(amount, '0.00'),
  percentage: (amount) => ns.nFormat(amount, '0.00%'),
})
