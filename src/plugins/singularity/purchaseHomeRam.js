import { createApp } from '../../core/app.js';

/** @param {NS} ns */
export async function main(ns) {
  const app = await createApp(ns);
  const t = app.formatters;
  if (ns.singularity.upgradeHomeRam()) {
    app.updateSetting('upgradeRamCost', null);
    const newRam = ns.getServerMaxRam('home');
    ns.tprint(`✔️ RAM upgraded to ${t.size(newRam)}.`);
  } else {
    ns.tprint('✖️ RAM upgrade failed.');
  }
}
