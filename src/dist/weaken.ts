import { NS } from '@ns'

export async function main(ns: NS) {
  const [target] = ns.args as [string]
  while (true) await ns.weaken(target)
}
