export const runRemote = (ns, remoteScript, remoteHost, threads, ...args) => {
  ns.disableLog('exec')
  const pid = ns.exec(remoteScript, remoteHost, threads, ...args)

  if (pid === 0) {
    ns.print(`❌: Failed to run ${remoteScript} on ${host}.`)
    ns.exit()
  }

  return pid
}
