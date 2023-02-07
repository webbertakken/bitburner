import { getFormatters } from '/core/getFormatters'

const PLUGINS_FILE = 'plugins/registered.txt'
const SETTINGS_FILE = 'runtime.txt'

/**
 * Everything in this method is free.
 *
 * It is important to keep the cost of app at zero, so that even the smallest scripts can keep using it.
 * That way we keep a consistent API for all scripts while not suffering ram deprivation in early game.
 *
 * @param {NS} ns
 * @param {Object} initialSettings - Settings to use before reading from disk
 */
export const createApp = async (ns, initialSettings = null) => {
  // Cache settings
  const getSettings = () => JSON.parse(ns.read(SETTINGS_FILE) || {})
  const getSetting = (option) => getSettings()[option]
  const initSettings = (settings) => ns.write(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'w')
  const updateSetting = (option, value) => {
    ns.write(SETTINGS_FILE, JSON.stringify({ ...getSettings(), [option]: value }, null, 2), 'w')
  }

  // Cache plugins
  const getPlugins = () => JSON.parse(ns.read(PLUGINS_FILE) || '{}')
  const getPlugin = (plugin) => getPlugins()[plugin]
  const registerPlugin = (plugin, options) => {
    ns.write(PLUGINS_FILE, JSON.stringify({ ...getPlugins(), [plugin]: options }, null, 2), 'w')
  }

  // Window
  let windowSpawned = false
  const hasWindow = () => windowSpawned
  const openWindow = async (row = 0, col = 0, rowSpan = 1) => {
    const width = 670
    const height = 220
    const spacer = 10

    // Close previous window
    ns.closeTail()

    // Open new window
    ns.tail()
    windowSpawned = true
    await ns.sleep(1) // Need to wait a frame window to actually spawn
    ns.moveTail(2190 - col * (width + spacer), 10 + row * (height + spacer))
    ns.resizeTail(width, rowSpan * height + (rowSpan - 1) * spacer)
  }

  // Initialise
  await configure(ns)

  // Only needs to be performed in the bootstrapping script, getSettings reads from disk after that.
  if (initialSettings) initSettings(initialSettings)

  // Public API
  return {
    hasWindow,
    log: (...args) => (hasWindow() ? ns.print(...args) : ns.tprint(...args)),
    formatters: getFormatters(ns),
    sleep: ns.sleep,
    openWindow,
    getPlugins,
    getPlugin,
    registerPlugin,
    getSettings,
    getSetting,
    updateSetting,
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
