import { lookup } from '/tools/lookup'

export const main = async (ns) => {
  ns.tprint(`🤔 Replicate quests.`)

  const hosts = ['CSEC', 'avmnite-02h', 'I.I.I.I', 'run4theh111z']

  const commands = []
  for (const host of hosts) {
    const node = lookup(ns, host)
    const connect = `connect ` + node.path.split(' ').join(' ; connect ') + ' ;'
    commands.push(`${connect} backdoor ;`)
  }

  ns.tprint(`
📦 Prerequisites:
    Tor Router
🧑🏻‍💻 Commands:
    connect darkweb ; buy -l ; buy FTPCrack.exe ; buy relaySMTP.exe ; buy HTTPWorm.exe ; buy SQLInject.exe ; buy DeepscanV1.exe ; buy DeepscanV2.exe ; buy ServerProfiler.exe ; buy AutoLink.exe ; buy Formulas.exe ; home ;
    ${commands.join('\n    ')}
  `)
}
