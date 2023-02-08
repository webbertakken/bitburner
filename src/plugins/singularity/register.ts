import { createApp } from '@/core/app.ts';
import { NS } from '@ns';

export async function main(ns: NS) {
  const app = await createApp(ns);
  try {
    ns.singularity.getUpgradeHomeRamCost();
    app.registerPlugin('singularity', {});
    ns.tprint('✔️ The singularity is enabled.');
  } catch {
    ns.tprint('✖️ The singularity is NOT enabled.');
  }
}
