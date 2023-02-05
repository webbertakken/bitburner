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

  ns.tprint(`🧑🏻‍💻 Commands:
    ${commands.join('\n    ')}
  `)
}
