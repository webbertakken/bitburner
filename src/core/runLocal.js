export const runLocal = (ns, script, threads, ...args) => {
  ns.disableLog('run')
  const pid = ns.run(script, threads, ...args)

  if (pid === 0) {
    ns.tprint(`❌: ${script} failed to run. Most likely out of RAM.`)
    // ns.exit()
  }

  return pid
}
