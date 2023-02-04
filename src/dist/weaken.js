/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0] || 'harakiri-sushi'
  while (true) await ns.weaken(target)
}
