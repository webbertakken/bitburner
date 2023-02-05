import { getNodeInfo } from '/core/getNodeInfo'
import { getFormatters } from '/core/getFormatters'

export const createScanner = (ns) => {
  const whitelist = ['weaken.js', 'grow.js', 'spawner.js', 'collector.js']

  const scan = (originNode) => {
    return ns.scan(originNode).map((nodeId) => ({
      ...getNodeInfo(ns, nodeId),
      files: ns
        .ls(nodeId)
        .filter((file) => /^(?!\/core\/)/.test(file) && !whitelist.includes(file)),
    }))
  }

  const scanRecursively = (originNode = 'home', maxDepth = 100) => {
    const registry = { discoveredNodes: [], discoveredIds: ['home'] }

    const recursiveScan = (originNode, depth = 0, parentPath = originNode) => {
      const nodes = scan(originNode)
      for (const node of nodes) {
        // Ids
        if (registry.discoveredIds.includes(node.id)) continue
        registry.discoveredIds.push(node.id)

        // Nodes
        const path = `${parentPath} ${node.id}`
        registry.discoveredNodes.push({ ...node, path })

        // Recursion
        if (depth < maxDepth) {
          recursiveScan(node.id, depth + 1, path)
        } else {
          ns.tprint(`🚧 Scan stopped at depth ${depth} for ${node.id}.\n🛣️ Path: ${path}`)
        }
      }
    }

    recursiveScan(originNode)

    return registry.discoveredNodes
  }

  return {
    scan,
    scanRecursively,
  }
}

export const main = async (ns) => {
  const f = getFormatters(ns)
  const scanner = createScanner(ns)

  ns.tprint('🔍 Scanning network')

  const file = (name) => {
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
      const files =
        node.files.length <= 0 ? '' : `files:\n +---${node.files.map(file).join('\n +---')}`
      return `${hasRootAccess} ${node.id} (${memory}, ${security}) - ${maxMoney} - ${node.path}. ${files}`
    })
    .join('\n')

  ns.tprint(results)
}
