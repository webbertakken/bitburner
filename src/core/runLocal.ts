import { NS, ScriptArg } from '@ns'

export const runLocal = async (ns: NS, script: string, threads = 1, ...args: ScriptArg[]) => {
  ns.disableLog('exec')

  const pid = ns.exec(script, 'home', threads, ...args)
  if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
  else ns.tprint(`❌: Failed to run ${script}. Most likely out of RAM.`)

  return pid
}

export const spawnLocal = (ns: NS, script: string, threads = 1, ...args: ScriptArg[]) => {
  ns.disableLog('exec')

  return ns.exec(script, 'home', threads, ...args)
}
