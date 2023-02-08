import { createApp } from '/core/app.js'

/** @param {NS} ns */
export async function main(ns) {
  const app = await createApp(ns)
  try {
    ns.hacknet.numNodes()
    app.registerPlugin('hacknet', {})
    ns.tprint('✔️ Hacknet Nodes are enabled.')
  } catch {
    ns.tprint('✖️ Hacknet Nodes are NOT enabled.')
  }
}
