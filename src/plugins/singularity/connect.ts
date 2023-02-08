import { NS } from '@ns'

export async function main(ns: NS) {
  const paths: string[] = ns.args.map((host) => `${host}`)

  try {
    let lastNode = 'home'
    ns.singularity.connect('home')
    for (const path of paths) {
      for (const node of path.split(' ')) {
        ns.tprint(`🔌 Connecting to ${node}...`)
        lastNode = node
        ns.singularity.connect(node)
      }
    }
    ns.tprint(`🔌 Connected to ${lastNode}.`)
  } catch (error) {
    ns.tprint(`❌ Failed to connect to ${paths.join(' > ')}.`)
  }
}
