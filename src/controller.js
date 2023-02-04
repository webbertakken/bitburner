import { configure, window, getFormatters } from './utils/index.js'

const hardware = async (ns) => {
  const f = getFormatters(ns)

  // Calculate spending
  const myMoney = ns.getPlayer().money
  const maxSpendingPerItem = myMoney * 0.01
  const maxServers = ns.getPurchasedServerLimit()
  const numPurchasedServers = ns.getPurchasedServers().length

  // First buy up to the maximum amount of servers
  if (numPurchasedServers < maxServers) {
    let scale = Math.pow(2, 10) // 1 TB
    const newServerCost = ns.getPurchasedServerCost(scale)
    if (newServerCost < maxSpendingPerItem) {
      const nextId = ns.getPurchasedServers().length % maxServers
      const hostname = `webber${nextId}`
      ns.print(`Buying new server "${hostname}" for ${f.money(newServerCost)}...`)
      ns.purchaseServer(hostname, scale)
    }

    return
  }

  // Then upgrade the servers when affordable
  ns.getPurchasedServers().forEach((hostname) => {
    const ram = ns.getServerMaxRam(hostname)
    const nextPower = Math.log2(ram) + 1
    const nextRam = Math.pow(2, nextPower)
    const nextCost = ns.getPurchasedServerUpgradeCost(hostname, nextRam)
    if (nextCost <= maxSpendingPerItem) {
      ns.print(`Upgrading "${hostname}" to ${nextRam}GB for ${f.money(nextCost)}...`)
      ns.upgradePurchasedServer(hostname, nextRam)
      return
    }
  })
}

/** @param {NS} ns */
export async function main(ns) {
  const f = getFormatters(ns)

  await configure(ns)
  await window(ns, 1, 1, 2)

  ns.print('Running...')

  // Show all prices once
  for (const scale of [Math.pow(2, 10), Math.pow(2, 14), Math.pow(2, 16)]) {
    const cost = ns.getPurchasedServerCost(scale)
    ns.print(`Cost for ${scale}GB: ${f.money(cost)}`)
  }

  while (true) {
    await hardware(ns)
    await ns.sleep(1000)
  }
}