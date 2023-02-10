import { NS } from '@ns'
import { createScanner } from '@/core/scanner'

export const lookup = (ns: NS, host: string): NodeInfo => {
  const possibleNode = createScanner(ns)
    .scanRecursively()
    .find((node) => node.id === host)

  if (!possibleNode) throw new Error(`❌ Could not find ${host}.`)

  return possibleNode
}

export const main = async (ns: NS) => {
  const [hostName] = ns.args as [string]

  ns.tprint(`🔍 Looking up ${hostName}`)
  const node = lookup(ns, hostName)
  ns.tprint(JSON.stringify(node, null, 2))

  const connect = `connect ` + node.path.split(' ').join('; connect ')
  ns.tprint(`🧑🏻‍💻 Commands:
    ${connect} ; ls ;
  `)
}
