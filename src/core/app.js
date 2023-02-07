import { getFormatters } from '/core/getFormatters'

const PLUGINS_FILE = 'plugins/registered.json'
const SETTINGS_FILE = 'runtime.json'

/**
 * Everything in this method is free.
 *
 * @param {NS} ns
 */
export const createApp = async (ns) => {
  await configure(ns)

  let windowSpawned = false
  const hasWindow = () => windowSpawned

  const getOptions = () => JSON.parse(ns.read(SETTINGS_FILE))
  const getOption = (option) => getOptions()[option]
  const updateOption = (option, value) =>
    ns.write(SETTINGS_FILE, JSON.stringify({ ...getOptions(), [option]: value }))

  const getPlugins = () => JSON.parse(ns.read(PLUGINS_FILE))
  const getPlugin = (plugin) => getPlugins()[plugin]
  const registerPlugin = (plugin, options) =>
    ns.write(PLUGINS_FILE, JSON.stringify({ ...getPlugins(), [plugin]: options }))

  const openWindow = async (row = 0, col = 0, rowSpan = 1) => {
    windowSpawned = true

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
  }

  return {
    hasWindow,
    log: (...args) => (hasWindow() ? ns.print(...args) : ns.tprint(...args)),
    formatters: getFormatters(ns),
    sleep: ns.sleep,
    openWindow,
    getPlugins,
    getPlugin,
    registerPlugin,
    getOptions,
    getOption,
    updateOption,
  }
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
  ns.disableLog('kill')
}
