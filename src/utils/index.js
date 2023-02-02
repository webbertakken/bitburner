/** @param {NS} ns */
export const window = async (ns, nth = 0, span = 1) => {
  ns.closeTail()
  await ns.sleep(50)
  const { pid } = ns.getRunningScript() || { pid: 0 }
  ns.tail(pid)
  await ns.sleep(50)
  ns.moveTail(2150, 80 + nth * 230, pid)
  await ns.sleep(50)
  ns.resizeTail(700, span * 220 + (span - 1) * 10, pid)
}

/** @param {NS} ns */
export const configure = async (ns) => {
  ns.disableLog('disableLog')
  ns.disableLog('sleep');
}

/** @param {NS} ns */
export const getMaxThreads = async(ns, scriptNameOrRamAmount) => {
  const self = ns.getHostname()
  const max = ns.getServerMaxRam(self)
  const used = ns.getServerUsedRam(self)
  const free = max - used;

  const cost = typeof scriptNameOrRamAmount === 'string' ? ns.getScriptRam(scriptNameOrRamAmount) : scriptNameOrRamAmount

  return Math.floor(free / cost)
}

/** @param {NS} ns */
export const mFormat = async(ns, amount) => {
  return ns.nFormat(amount, '($0,00 a)')
}
