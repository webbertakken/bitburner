import { getFormatters } from '@/core/getFormatters'
import { NS } from '@ns'
import { createScanner } from '@/core/scanner'

export const main = async (ns: NS) => {
  const f = getFormatters(ns)
  const scanner = createScanner(ns)

  ns.tprint('🔍 Scanning network')

  const file = (name: string) => {
    if (/\.lit$/.test(name)) return `📄 ${name}`
    return `🗃️ ${name}`
  }

  const results = scanner
    .scanRecursively()
    .sort((a, b) => b.maxMoneys - a.maxMoneys)
    .map((node) => {
      const hasRootAccess = node.hasRootAccess ? '✅' : '❌'
      const maxMoney = f.money(node.maxMoneys)
      const security = `${node.securityLevel}/${node.minSecurityLevel}`
      const memory = `${node.maxRam}GB`
      const files = node.files.length <= 0 ? '' : `files:\n +---${node.files.map(file).join('\n +---')}`
      return `${hasRootAccess} ${node.id} (${memory}, ${security}) - ${maxMoney} - ${node.path}. ${files}`
    })
    .join('\n')

  ns.tprint(results)
}
