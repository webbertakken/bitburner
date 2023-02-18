import { createApp } from '@/core/app'
import { NS } from '@ns'

export async function main(ns: NS) {
  const app = await createApp(ns)
  try {
    ns.gang.inGang()
    app.registerPlugin('gangs', {})
    ns.tprint('✔️ Gangs are enabled.')
  } catch {
    ns.tprint('✖️ Gangs are NOT enabled.')
  }
}
