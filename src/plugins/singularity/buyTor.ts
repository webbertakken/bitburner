import { NS } from '@ns';

export async function main(ns: NS) {
  if (ns.singularity.purchaseTor()) {
    ns.tprint('✔️ Tor purchased.');
  }
}
