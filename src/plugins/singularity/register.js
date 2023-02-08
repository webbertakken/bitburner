import { createApp } from '../../core/app.js';

/** @param {NS} ns */
export async function main(ns) {
  const app = await createApp(ns);
  try {
    ns.singularity.getUpgradeHomeRamCost();
    app.registerPlugin('singularity', {});
    ns.tprint('✔️ The singularity is enabled.');
  } catch {
    ns.tprint('✖️ The singularity is NOT enabled.');
  }
}
