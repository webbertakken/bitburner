import { createApp } from '@/core/app.js';
import { runLocal } from '@/core/runLocal.js';
import { NS } from '@ns';

/**
 * Reset the plugin registry, then let each plugin register itself.
 *
 * Plugins must provide a settings object or false when disabled.
 */
export async function main(ns: NS) {
  const app = await createApp(ns);

  // Plugins
  const plugins = [
    { name: 'base', defaultSettings: false },
    { name: 'hacknet', defaultSettings: false },
    { name: 'singularity', defaultSettings: false },
  ];

  // Register defaults
  for (const { name, defaultSettings } of plugins) {
    app.registerPlugin(name, defaultSettings);
  }

  // Register plugins
  for (const { name } of plugins) {
    runLocal(ns, `plugins/${name}/register.js`);
  }

  await ns.sleep(1);
}
