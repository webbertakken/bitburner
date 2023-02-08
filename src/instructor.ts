import { createApp } from '@/core/app.ts';

/**
 * Singularity based methods
 *
 * @param {NS} ns
 */
export async function main(ns) {
  const app = await createApp(ns);
  await app.openWindow(1);
  const f = app.formatters;

  const objectives = [
    { id: 1, title: 'Get BruteSSH.exe', validate: () => ns.fileExists('BruteSSH.exe') },
    { id: 2, title: 'Get FTPCrack.exe', validate: () => ns.fileExists('FTPCrack.exe') },
    { id: 3, title: 'Get relaySMTP.exe', validate: () => ns.fileExists('relaySMTP.exe') },
    { id: 4, title: 'Get HTTPWorm.exe', validate: () => ns.fileExists('HTTPWorm.exe') },
    { id: 5, title: 'Get SQLInject.exe', validate: () => ns.fileExists('SQLInject.exe') },
  ];

  for (const objective of objectives) {
    app.log(`📝 Objective ${objective.id}: ${objective.title}`);

    while (!objective.validate()) {
      await ns.sleep(15e3);
    }
  }
}
