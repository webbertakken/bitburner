import { fillAllocation } from '@/core/fillAllocation'
import { NS } from '@ns'

export async function main(ns: NS) {
  const self = ns.getHostname()
  const [target, type] = ns.args

  if (type === 'weaken') {
    await fillAllocation(ns, ['weaken.js', target])
    return
  }

  if (ns.getServerMaxRam(self) > 500) {
    ns.run('collector.js', 200, target)
  } else {
    await fillAllocation(ns, ['collector.js', target], 0.3)
  }

  await fillAllocation(ns, ['grow.js', target], 0.55)
  await fillAllocation(ns, ['weaken.js', target])
}
