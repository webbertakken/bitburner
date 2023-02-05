import { getNodeInfo } from '/core/getNodeInfo'
import { getFormatters } from '/core/getFormatters'

const createScanner = (ns) => {
  const scanNetwork = (originNode) => {
    return ns.scan(originNode).map((nodeId) => getNodeInfo(ns, nodeId))
  }

  const scanRecursive = (originNode = 'home', maxDepth = 20) => {
    const registry = { discoveredNodes: [], discoveredIds: ['home'] }

    const scan = (originNode, depth = 0, parentPath = originNode) => {
      const nodes = scanNetwork(originNode)
      for (const node of nodes) {
        // Ids
        if (registry.discoveredIds.includes(node.id)) continue
        registry.discoveredIds.push(node.id)

        // Nodes
        const path = `${parentPath}.${node.id}`
        registry.discoveredNodes.push({ ...node, path })

        // Recursion
        if (depth < maxDepth) {
          scan(node.id, depth + 1, path)
        } else {
          ns.tprint(`🚧 Scan stopped at depth ${depth} for ${node.id}.\n🛣️ Path: ${path}`)
        }
      }
    }

    scan(originNode)

    return registry.discoveredNodes
  }

  return {
    scanNetwork,
    scanRecursive,
  }
}

export const main = async (ns) => {
  const f = getFormatters(ns)
  const scanner = createScanner(ns)

  ns.tprint('🔍 Scanning network')

  const results = scanner
    .scanRecursive()
    .sort((a, b) => b.maxMoneys - a.maxMoneys)
    .map((node) => {
      const hasRootAccess = node.hasRootAccess ? '✅' : '❌'
      const maxMoney = f.money(node.maxMoneys)
      const security = `${node.securityLevel}/${node.minSecurityLevel}`
      const memory = `${node.maxRam}GB`
      return `${hasRootAccess} ${node.id} (${memory}, ${security}) - ${maxMoney} - ${node.path}`
    })
    .join('\n')

  ns.tprint(results)
}
