/** @param {NS} ns */
export async function main(ns) {
  if (ns.singularity.purchaseTor()) {
    ns.tprint('✔️ Tor purchased.')
  }
}
