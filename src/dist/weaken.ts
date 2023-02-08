import { NS } from '@ns';

export async function main(ns: NS) {
  const [target] = ns.args;
  while (true) await ns.weaken(target);
}
