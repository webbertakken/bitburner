import { NS, ScriptArg } from '@ns'

const runBase = (ns: NS, script: string, host: string, threads = 1, ...args: ScriptArg[]) => {
  ns.disableLog('exec')
  return ns.exec(script, host, threads, ...args)
}

export const spawnLocal = (ns: NS, script: string, threads = 1, ...args: ScriptArg[]) => {
  return runBase(ns, script, 'home', threads, ...args)
}

export const spawnRemote = (ns: NS, remoteScript: string, remoteHost: string, threads = 1, ...args: ScriptArg[]) => {
  const pid = runBase(ns, remoteScript, remoteHost, threads, ...args)

  if (pid <= 0) {
    ns.tprint(`❌: Failed to spawn ${remoteScript} on ${remoteHost}.`)
    ns.exit() // Explicitly exit the method this is called from, so that the bug is visible
  }

  return pid
}

export const runRemote = async (ns: NS, script: string, host: string, threads = 1, ...args: ScriptArg[]) => {
  const pid = runBase(ns, script, 'home', threads, ...args)

  // Wait for the script to finish
  if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
  else ns.tprint(`❌: Failed to run ${script}. Most likely out of RAM.`)

  return pid
}

export const runLocal = async (ns: NS, script: string, threads = 1, ...args: ScriptArg[]) => {
  return runRemote(ns, script, 'home', threads, ...args)
}
