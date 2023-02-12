import { NS } from '@ns'
import { createApp } from '@/core/app'
import { main as unlocks } from '@/controller/modules/unlocks'
import { main as worldDaemon } from '@/controller/modules/worldDaemon'
import { main as daedalus } from '@/controller/modules/daedalus'
import { main as factions } from '@/controller/modules/factions'
import { main as objectives } from '@/controller/modules/objectives'

const augmentations = async (ns: NS) => {
  // Todo - Chongqing
  //  - Neuregen Gene Modification (40% hack xp)
  //  - Neuralstimulator (12% hack xp) ----
  //  - DataJack (25% hack power)
  // Todo - Sector-12
  //  - Neuralstimulator (12% hack xp) ----
  //  - CashRoot Starter Kit (1M + BruteSSH.exe)
  // Todo - Tian Di Hui
  //  - Neuroreceptor Management Implant (passive faction work)
  //  - Social Negotiation Assistant (S.N.A) (15% faction rep)
  //  - ADR-V1 Pheromone Gene (10% faction rep)
}

export async function main(ns: NS) {
  const app = await createApp(ns)
  await app.openWindow(0, 1)
  const plugins = app.getPlugins()
  const self = 'home'

  app.log('🏃 Running...')

  while (true) {
    const { buyHardware, buyHacknetNodes } = app.getSettings()

    // Most automations require the singularity.
    // Requires Source-File 4 to run. A power up you in BitNode-4
    if (plugins.singularity) {
      await daedalus(ns)
      await worldDaemon(ns)
      await augmentations(ns)
      await factions(ns)
      await objectives(ns)
      await unlocks(ns)
    }

    if (buyHardware) {
      const pid = ns.exec('controller/modules/hardware.js', self)
      if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
    }
    if (buyHacknetNodes) {
      const pid = ns.exec('controller/modules/hacknet.js', self)
      if (pid > 0) while (ns.isRunning(pid)) await ns.sleep(1)
    }

    await ns.sleep(1000)
  }
}
