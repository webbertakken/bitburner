/** @param {NS} ns */
export async function main(ns) {
  const host = ns.getHostname()
  while(true) {
    await ns.weaken(host)
  }
}