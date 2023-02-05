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

/** @param {NS} ns */
export const getFormatters = (ns) => ({})

export const createApp = async (ns) => {
  await configure(ns)

  return {
    formatters: {
      money: (amount) => `${ns.nFormat(amount, '$0.00a')}`.toUpperCase(),
      time: (time) => ns.tFormat(time),
      number: (amount) => ns.nFormat(amount, '0.00'),
      percentage: (amount) => ns.nFormat(amount, '0.00%'),
    },

    run: (script, threads, ...args) => {
      ns.disableLog('run')
      const pid = ns.run(script, threads, ...args)

      if (pid === 0) {
        ns.print(`❌: ${script} failed to run. Most likely out of RAM.`)
        ns.exit()
      }

      return pid
    },

    runRemote: (remoteScript, remoteHost, threads, ...args) => {
      ns.disableLog('exec')
      const pid = ns.exec(remoteScript, remoteHost, threads, ...args)

      if (pid === 0) {
        ns.print(`❌: Failed to run ${remoteScript} on ${host}.`)
        ns.exit()
      }

      return pid
    },

    getMaxThreads: async (scriptNameOrRamAmount, saveGb = 0) => {
      const self = ns.getHostname()
      const max = Math.max(0, ns.getServerMaxRam(self) - saveGb)
      const used = ns.getServerUsedRam(self)
      const free = max - used

      const cost =
        typeof scriptNameOrRamAmount === 'string'
          ? ns.getScriptRam(scriptNameOrRamAmount)
          : scriptNameOrRamAmount

      return Math.floor(free / cost)
    },

    getNodeInfo: (nodeId) => {
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
    },

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

    fillAllocation: async (script, utilisation = 1) => {
      const [scriptName, ...args] = script

      // Calculate threads
      const self = ns.getHostname()
      const maxRam = ns.getServerMaxRam(self)
      const usedRam = ns.getServerUsedRam(self)
      const freeRam = maxRam - usedRam
      const scriptCost = ns.getScriptRam(scriptName)
      const poolSize = Math.max(50, maxRam / 18)
      const threads = Math.floor(freeRam / scriptCost) * utilisation

      // Spawn full pools of threads
      const numInstances = Math.floor(threads / poolSize)
      for (let i = 0; i < numInstances; i++) {
        ns.run(scriptName, poolSize, ...[...args, i])
      }

      // Spawn remaining threads
      const instanceRest = threads % poolSize
      if (instanceRest > 0) ns.run(scriptName, instanceRest, ...[...args, numInstances + 1])
    },
  }
}
