import { createApp } from '@/core/app'
import { NS } from '@ns'

export async function main(ns: NS) {
  const app = await createApp(ns)

  ns.tprint(`\nšŖ Facts: `)
  for (const [key, value] of Object.entries(app.getFacts())) {
    ns.tprint(`š ${key} = ${JSON.stringify(value, null, 0).replace(/\n/g, '')}`)
  }
}
