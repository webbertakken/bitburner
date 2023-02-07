import { createApp } from '/core/app'

/**
 * Schedule expensive tasks that come from plugins.
 *
 * @param {NS} ns
 */
export async function main(ns) {
  const app = await createApp(ns)
  await app.openWindow(2)
  const f = app.formatters

  while (true) {
    const options = app.getOptions()
    const plugins = app.getPlugins()

    // Todo - Check whether 'home' machine can be upgraded.
    // Todo - Buy tor router

    // Todo - Buy software

    await ns.sleep(1000)
  }
}
