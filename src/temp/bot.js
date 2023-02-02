const SECONDS = 1000
/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('disableLog')
  ns.disableLog('sleep')
  ns.disableLog('getServerSecurityLevel')
  ns.disableLog('getServerRequiredHackingLevel')
  ns.disableLog('getServerMoneyAvailable')

  const interval = 1;
  ns.print(`Running every ${interval} seconds`)
  while (true) {
    ns.print('---')
    const hackingLevel = ns.getHackingLevel()
    ns.print(`Listing nodes below hackingLevel "${hackingLevel}"`)
    ns.print('---')

    // ["n00dles","foodnstuff","sigma-cosmetics","joesguns","hong-fang-tea","harakiri-sushi","iron-gym","darkweb","alpha8","alpha9"]
    const scanResults = await ns.scan()
    ns.print('\n')

    const safeNodes = []
    for (const node of scanResults) {
      // Required hacking skill for hack() and backdoor
      // Security
      const securityLevel = ns.getServerSecurityLevel(node)
      const reqHackingLevel = ns.getServerRequiredHackingLevel(node)
      const moneys = ns.getServerMoneyAvailable(node)

      if (securityLevel <= 10 && hackingLevel >= reqHackingLevel) {
        safeNodes.push({ name: node, securityLevel, reqHackingLevel, moneys });
        ns.print(`added ${node}`)
      } else {
        ns.print(`skipping ${node}`)
      }
    }
    ns.print('\n')

    safeNodes.sort((a, b) => b.moneys / b.securityLevel - a.moneys / a.securityLevel)
    ns.print('Writing nodes to "nodes.txt".')
    ns.write('nodes.txt', JSON.stringify(safeNodes, null, 2), 'w')
    ns.print('')

    // ns.connect(node)
    // ns.print(`connected to ${ns.getHostname()}`)
    // ns.connect('home')


    // for (const node of scanResults) {
    //   await ns.connect(node)
    //   await ns.run('BruteSSH.exe')
    //   await ns.run('NUKE.exe')
    //   await ns.sprintf(ns.getHostname())
    // }
    await ns.sleep(interval * SECONDS)
  }
}