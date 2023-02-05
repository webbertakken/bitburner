import { getFormatters } from '/core/getFormatters'

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
  ns.disableLog('kill')
}

/**
 * Everything in this method is free.
 *
 * @param {NS} ns
 */
export const createApp = async (ns) => {
  await configure(ns)

  return {
    formatters: getFormatters(ns),

    sleep: ns.sleep,

    window: async (row = 0, col = 0, rowSpan = 1) => {
      const width = 670
      const height = 220
      const spacer = 10

      // Close previous window
      ns.closeTail()

      // Open new window
      ns.tail()
      await ns.sleep(1) // Need to wait for window to actually spawn
      ns.moveTail(2190 - col * (width + spacer), 10 + row * (height + spacer))
      ns.resizeTail(width, rowSpan * height + (rowSpan - 1) * spacer)
    },
  }
}
