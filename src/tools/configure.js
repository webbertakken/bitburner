import { createApp } from '/core/app'

/** @param {NS} ns */
export async function main(ns) {
  const app = await createApp(ns)

  // Usage information
  const availableSettings = Object.entries(app.getSettings())
    .map(([name, value]) => `${name}="${value}"`)
    .map((item) => `\n    ⚙️ configure ${item}`)
    .join('')
  if (ns.args.length === 0) {
    return ns.tprint(
      `\n🪒 Usage:\n configure <setting>\="<value>"\n\n Examples (current settings):${availableSettings}`,
    )
  }

  // Parsing
  let [setting, value] = ns.args[0].split('=')
  value = [value, ...ns.args.slice(1)].join(' ')

  // Type casting
  if (!isNaN(value)) value = Number(value)
  if (['true', 'false'].includes(value)) value = value === 'true'

  // Update
  app.updateSetting(setting, value)
  ns.tprint(`\n🪒 Updated setting ⚙️ ${setting} to ${value}`)
}
