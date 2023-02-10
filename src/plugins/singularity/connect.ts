import { NS } from '@ns'

export async function main(ns: NS) {
  try {
    // Path can be provided as a single space-separated string, or as multiple arguments.
    const paths: string[] = ns.args.join(' ').split(' ').filter(Boolean)

    // Connect to home first.
    paths.unshift('home')

    // Can only connect to neighbours, so iterate through the path and connect to each node.
    for (const path of paths) {
      const result = ns.singularity.connect(path)
      if (!result) throw new Error(`Unable to resolve ${path}.`)
    }

    ns.tprint(`🔌 Connected to ${paths[paths.length - 1]}.`)
  } catch (error: any) {
    ns.tprint(`❌ Failed to connect. ${error.message}`)
  }
}
