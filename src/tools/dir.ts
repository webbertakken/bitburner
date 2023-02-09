import { NS } from '@ns'
import { get } from '@/core/get'
import { set } from '@/core/set'

export const dir = async (ns: NS) => {
  const host: string = (ns.args[0] as string) || ns.getHostname()

  const tree = {}
  for (const file of ns.ls(host)) {
    // Split at last slash
    const [path, fileName] = `/${file}`.replace(/\/+/, '/').split(/(?:\/(?!.*\/))/)

    // Files already present or empty array
    const current = get(tree, path, [])

    // Update tree with newly found files
    set(tree, path, [...current, fileName])
  }

  return tree
}

export const main = async (ns: NS) => {
  ns.tprint(JSON.stringify(dir(ns), null, 2))
}
