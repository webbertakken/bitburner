import { createApp } from '@/core/app.ts';
import { NS } from '@ns';

export async function main(ns: NS) {
  const app = await createApp(ns);

  ns.tprint(`
    🪒 Aliases:
      alias start="run start.js" ;
      alias kill="run tools/kill.js" ;
      alias restart="kill true ; run start.js true" ;
      alias reset="kill true ; start" ;
      alias configure="run tools/configure.js" ;
      alias aliases="run tools/aliases.js" ;
  `);
}
