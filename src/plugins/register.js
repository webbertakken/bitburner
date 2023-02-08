import { createApp } from '/core/app.js'
import { runLocal } from '/core/runLocal.js'

/**
 * Reset the plugin registry, then let each plugin register itself.
 *
 * Plugins must provide a settings object or false when disabled.
 *
 * @param {NS} ns */
export async function main(ns) {
  const app = await createApp(ns)

  // Plugins
  const plugins = [
    { name: 'base', defaultSettings: false },
    { name: 'hacknet', defaultSettings: false },
    { name: 'singularity', defaultSettings: false },
  ]

  // Register defaults
  for (const { name, defaultSettings } of plugins) {
    app.registerPlugin(name, defaultSettings)
  }

  // Register plugins
  for (const { name } of plugins) {
    runLocal(ns, `plugins/${name}/register.js`)
  }

  await ns.sleep(1)
}
