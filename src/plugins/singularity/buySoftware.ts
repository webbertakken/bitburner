/** @param {NS} ns */
export async function main(ns) {
  const [software] = ns.args
  if (ns.singularity.purchaseProgram(software)) {
    ns.tprint(`✔️ ${software} purchased.`)
  }
}
