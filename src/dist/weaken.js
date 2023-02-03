/** @param {NS} ns */
export async function main(ns) {
  const host = 'harakiri-sushi'
  while(true) {
    await ns.weaken(host)
  }
}
