import { NS } from '@ns'

export async function main(ns: NS) {
  const path: string[] = ['home', ...ns.args.map((host) => `${host}`)]
  const lastNode = path[path.length - 1]

  try {
    for (const node of path) ns.singularity.connect(node)
    ns.tprint(`🔌 Connected to ${lastNode}.`)
  } catch (error) {
    ns.tprint(`❌ Failed to connect to ${lastNode}.`)
  }
}
