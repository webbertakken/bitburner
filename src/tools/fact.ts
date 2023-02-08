import { createApp } from '@/core/app'
import { NS, ScriptArg } from '@ns'

export async function main(ns: NS) {
  const app = await createApp(ns)

  // Parsing
  const [fact, assignment] = (ns.args[0] as string).split('=')!
  let value: ScriptArg = [assignment, ...ns.args.slice(1)].join(' ')

  // Type casting
  if (!isNaN(Number(value))) value = Number(value)
  if (['true', 'false'].includes(value as string)) value = value === 'true'

  // Update
  app.updateFact(fact, value)
  ns.tprint(`\n🪒 Updated setting ⚙️ ${fact} to ${value}`)
}
