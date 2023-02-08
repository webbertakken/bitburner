import { NS } from '@ns';

export async function main(ns: NS) {
  const [software] = ns.args;
  if (ns.singularity.purchaseProgram(software)) {
    ns.tprint(`✔️ ${software} purchased.`);
  }
}
