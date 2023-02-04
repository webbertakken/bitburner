import { configure, getNodeInfo, window } from './utils/index.js'

/** @param {NS} ns */
export async function main(ns) {
  await configure(ns)
  await window(ns, 1, 0, 2)

  const target = ns.args[0]
  const node = getNodeInfo(ns, target)

  while (true) {
    ns.clearLog()
    ns.print(
      `${node.id} (security: ${ns.getServerSecurityLevel(node.id)}/${ns.getServerMinSecurityLevel(
        node.id,
      )}, moneys ${ns.nFormat(ns.getServerMoneyAvailable(node.id), '($0,00 a)')}/${ns.nFormat(
        ns.getServerMaxMoney(node.id),
        '($0,00 a)',
      )}`,
    )
    ns.print('\n')
    ns.print(`weaken time: ${ns.tFormat(ns.getWeakenTime(node.id))}`)
    ns.print(`weaken effect: ${ns.weakenAnalyze(1, 1)} [x10: ${ns.weakenAnalyze(10, 1)}]`)
    ns.print('\n')
    ns.print(`hack time: ${ns.tFormat(ns.getHackTime(node.id))}`)
    ns.print(`hack effect: ${ns.tFormat(ns.hackAnalyze(node.id))}`)
    ns.print(`hack chance: ${ns.hackAnalyzeChance(node.id)}`)
    ns.print(
      `hack security effect: ${ns.hackAnalyzeSecurity(
        1,
        node.id,
      )} times 10: ${ns.hackAnalyzeSecurity(10, node.id)}`,
    )
    ns.print('\n')
    ns.print(`grow time: ${ns.tFormat(ns.getGrowTime(node.id))}`)
    ns.print(`grow effect: ${ns.growthAnalyze(node.id, 1.1, 1)}`)
    ns.print(
      `grow security effect: ${ns.growthAnalyzeSecurity(
        1,
        node.id,
      )} times 10: ${ns.growthAnalyzeSecurity(10, node.id)} times${Math.round(
        ns.growthAnalyze(node.id, 1.1, 1),
      )}: ${ns.growthAnalyzeSecurity(Math.round(ns.growthAnalyze(node.id, 1.1, 1)), node.id)}`,
    )
    ns.print('\n')

    await ns.sleep(1000)
  }
}
