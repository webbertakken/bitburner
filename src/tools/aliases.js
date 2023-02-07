import { createApp } from '/core/app'

/** @param {NS} ns */
export async function main(ns) {
  const app = await createApp(ns)

  ns.tprint(`
    🪒 Aliases:
      alias aliases="run tools/aliases.js" ;
      alias start="run start.js" ;
      alias restart="kill ; start" ;
      alias kill="run tools/kill.js" ;
      alias configure="run tools/configure.js" ;
  `)
}
