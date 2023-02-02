const getNodes = () => {
  try {
    return JSON.parse(ns.read('nodes.txt'))
  } catch (error) {
    return [{ name: "n00dles", securityLevel: 1.8239999999999346, reqHackingLevel: 1, moneys: 802156.7112665075 }]
  }
}

/** @param {NS} ns */
export async function main(ns) {
  while (true) {

    const nodes = getNodes()

    let last = 0;
    for (const server of nodes.filter(a => a.moneys >= 100_000 && a.securityLevel < 5)) {
      const formattedMoneys = ns.nFormat(server.moneys, '($0.00a)');

      ns.print('---')
      ns.print(`Next server: ${server.name} (${formattedMoneys}, security: ${server.securityLevel.toFixed(1)})`)
      ns.print('---')

      if (!ns.hasRootAccess(server.name)) {
        ns.print('No root access, skipping...')
        continue
      }

      if (last > 0 && (server.moneys / 10) < last) {
        ns.print('More than 10 times less than last server, starting from the top...')
        break;
      }

      await ns.grow(server.name);
      await ns.weaken(server.name);
      await ns.hack(server.name);

      last = server.moneys;
    }
  }
}
