import { createApp } from '@/core/app'
import { NS, ScriptArg } from '@ns'

export async function main(ns: NS) {
  const app = await createApp(ns)

  // Usage information
  const availableSettings = Object.entries(app.getSettings())
    .map(([name, value]) => `${name}="${value}"`)
    .map((item) => `\n    ⚙️ configure ${item}`)
    .join('')
  if (ns.args.length === 0) {
    return ns.tprint(`\n🪒 Usage:\n configure <setting>="<value>"\n\n Examples (current settings):${availableSettings}`)
  }

  // Parsing
  const [setting, assignment] = (ns.args[0] as string).split('=')!
  let value: ScriptArg = [assignment, ...ns.args.slice(1)].join(' ')

  // Type casting
  if (!isNaN(Number(value))) value = Number(value)
  if (['true', 'false'].includes(value as string)) value = value === 'true'

  // Update
  app.updateSetting(setting, value)
  ns.tprint(`\n🪒 Updated setting ⚙️ ${setting} to ${value}`)
}
