import { NS } from '@ns'

export enum FactionWorkType {
  hacking = 'hacking',
  field = 'field',
  security = 'security',
}

const icons = {
  hacking: '🧑🏻‍💻',
  field: '🤵🏻',
  security: '🧑🏻‍🏭',
}

export async function main(ns: NS) {
  const [faction, type = FactionWorkType.hacking, focus = true] = ns.args as [
    string,
    FactionWorkType,
    boolean,
  ]
  try {
    ns.singularity.workForFaction(faction, type, focus)
    ns.tprint(`${icons[type]} Doing some ${type} work for ${faction}.`)
  } catch {
    ns.tprint(`❌ Failed to pick up ${type} work from ${faction}.`)
  }
}
