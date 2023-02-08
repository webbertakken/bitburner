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
