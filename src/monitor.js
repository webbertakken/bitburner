import { createApp } from '/core/app'
import { getNodeInfo } from '/core/getNodeInfo'

/** @param {NS} ns */
export async function main(ns) {
  const app = await createApp(ns)
  await app.openWindow(1, 0, 2)
  const f = app.formatters

  const [target] = ns.args
  const node = getNodeInfo(ns, target)

  while (true) {
    ns.clearLog()

    // Apps
    app.log(
      `🖥️ Apps available:
   ${ns.fileExists('BruteSSH.exe') ? '✅' : '❌'} ssh   ` +
        `${ns.fileExists('FTPCrack.exe') ? '✅' : '❌'} ftp   ` +
        `${ns.fileExists('relaySMTP.exe') ? '✅' : '❌'} smtp   ` +
        `${ns.fileExists('HTTPWorm.exe') ? '✅' : '❌'} http   ` +
        `${ns.fileExists('SQLInject.exe') ? '✅' : '❌'} sql
      `,
    )

    // Settings
    const currentSettings = Object.entries(app.getSettings())
      .sort(([, a], [, b]) => (typeof a).localeCompare(typeof b))
      .map(([name, value]) => {
        if (typeof value === 'boolean') return `${value ? '✅' : '❌'} ${name}`
        return `${name}="${value}"`
      })
      .map((item) => `\n   ${item}`)
      .join('')
    app.log(`⚙️ Settings:${currentSettings}\n\n`)

    // Target
    const targetMoney = f.money(ns.getServerMoneyAvailable(node.id))
    const targetMaxMoney = f.money(ns.getServerMaxMoney(node.id))
    const targetSecurity = f.number(ns.getServerSecurityLevel(node.id))
    const targetMinSecurity = f.number(ns.getServerMinSecurityLevel(node.id))
    const targetHackTime = f.time(ns.getHackTime(node.id))
    app.log(
      `🎯 Current target: ${node.id}
   💰 moneys ${targetMoney}/${targetMaxMoney}
   🔐 security: ${targetSecurity}/${targetMinSecurity}
   ⏱️ hack time: ${targetHackTime}
      `,
    )

    await ns.sleep(350)
  }
}
