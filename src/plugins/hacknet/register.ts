import { createApp } from '@/core/app.ts';
import { NS } from '@ns';

export async function main(ns: NS) {
  const app = await createApp(ns);
  try {
    ns.hacknet.numNodes();
    app.registerPlugin('hacknet', {});
    ns.tprint('✔️ Hacknet Nodes are enabled.');
  } catch {
    ns.tprint('✖️ Hacknet Nodes are NOT enabled.');
  }
}
