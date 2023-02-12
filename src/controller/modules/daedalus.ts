import { NS } from '@ns'
import { DaedalusState, State } from '@/config/settings'
import { createApp } from '@/core/app'
import { runLocal } from '@/core/run'

export const main = async (ns: NS) => {
  const app = await createApp(ns)

  // Start going for Daedalus after 2500 hacking skill
  let state = app.getSetting('state')
  if (state !== State.Daedalus && ns.getHackingLevel() >= 2500) {
    state = State.Daedalus
    app.updateSetting('state', state)
  }

  // Don't do anything if Daedalus mode is disabled
  if (state !== State.Daedalus) return
  const daedalusState = app.getSetting('daedalusState')
  if (daedalusState === DaedalusState.DisabledThisRun || daedalusState === DaedalusState.Completed) return

  // Stuff that always runs when Daedalus mode is enabled
  await runLocal(ns, `plugins/singularity/getAugmentations.js`)
  await runLocal(ns, `plugins/singularity/getFactionAugmentations.js`, 1, 'Daedalus')

  const allDaedalusAugmentations = (app.getFact('allDaedalusAugmentations') as string[]) || []
  const allBoughtAugmentations = (app.getFact('allBoughtAugmentations') as string[]) || []
  const installedAugmentations = (app.getFact('installedAugmentations') as string[]) || []
  const numDaedalusAugments = allDaedalusAugmentations.filter((a) => allBoughtAugmentations.includes(a)).length

  // State machine for Daedalus states
  switch (daedalusState) {
    case DaedalusState.None: {
      if (installedAugmentations.includes('The Red Pill')) {
        ns.tprint('The Red Pill is installed, Daedalus mode is now enabled')
        app.updateSetting('daedalusState', DaedalusState.UnlockPrerequisites)
        break
      }

      if (Number(app.getFact('numInstalledAugmentations')) < 30) {
        app.updateSetting('daedalusState', DaedalusState.DisabledThisRun)
        break
      }

      if (ns.getPlayer().money < 10e9) {
        app.updateSetting('maxSpendingMode', true)
      } else {
        app.updateSetting('maxSpendingMode', false)
      }
      app.updateSetting('buyHardware', true)
      app.updateSetting('buyHacknetNodes', false)
      app.updateSetting('upgradeHome', false)
      app.updateSetting('daedalusState', DaedalusState.UnlockPrerequisites)
      break
    }
    case DaedalusState.UnlockPrerequisites: {
      // Before joining
      if (app.getFact('DaedalusJoined') !== true) {
        if (ns.getHackingLevel() <= 2500) return
        if (ns.getPlayer().money < 1e9) return
        app.updateSetting('maxSpendingMode', false)
        if (ns.getPlayer().money < 100e9) return
        return
      }

      // After joining
      const workingFor = app.getFact('workingFor')
      if (workingFor !== 'Daedalus') {
        await runLocal(ns, `plugins/singularity/workForFaction.js`)
      }
      app.updateSetting('maxSpendingMode', true)

      // Check if it was bought
      if (installedAugmentations.includes('The Red Pill')) {
        app.updateSetting('daedalusState', DaedalusState.InstalledRedPill)
      } else {
        app.updateSetting('daedalusState', DaedalusState.UnlockDonations)
      }

      break
    }
    case DaedalusState.UnlockDonations: {
      // If we have enough augments, go for red pill
      await runLocal(ns, `plugins/singularity/getFactionFavour.js`, 1, 'Daedalus')
      const daedalusFavour = Number(app.getFact('DaedalusFavour'))

      if (daedalusFavour >= 10 || numDaedalusAugments >= 2) {
        app.updateSetting('maxSpendingMode', true)
        app.updateSetting('daedalusState', DaedalusState.BuyRedPill)
        return
      }

      // Otherwise, buy augments
      app.updateSetting('maxSpendingMode', false)
      const reputation = Number(app.getFact('DaedalusReputation'))
      if (reputation >= 462_000) {
        // Todo - Buy
        // - Embedded Netburner Module Analyze Engine
        // - Embedded Netburner Module Direct Memory Access Upgrade
        // Todo - Use rest of the money for
        // - NeuroFlux Governor
        // Todo - Install augmentations
        // Todo - Restart instance

        // Finally, go for red pill (in case no restart happens)
        app.updateSetting('daedalusState', DaedalusState.BuyRedPill)
      } else {
        // Todo remove temporary measure
        // app.updateSetting('daedalusState', DaedalusState.BuyRedPill)
      }

      break
    }
    case DaedalusState.BuyRedPill: {
      if (app.getFact('daedalusRedPill') === true) {
        app.updateSetting('daedalusState', DaedalusState.BoughtRedPill)
        return
      }

      const donationAmount = 10e9

      await runLocal(ns, `plugins/singularity/getFactionReputation.js`, 1, 'Daedalus')
      const reputation = Number(app.getFact('DaedalusReputation'))

      // Donate until 2.5M reputation
      if (ns.getPlayer().money >= donationAmount && reputation < 2.5e6) {
        await runLocal(ns, `plugins/singularity/donateToFaction.js`, 1, 'Daedalus', donationAmount)
      }

      // Save 200B to buy Neuroflux Governors along with the red pill.
      // This should be fairly quick, as at this stage the money should be flowing in.
      if (reputation >= 2.5e6 && ns.getPlayer().money >= 200e9) {
        // Buy Red Pill
        ns.tprint('🧬 Buy red pill augmentation')
        await runLocal(ns, `plugins/singularity/buyFactionAugmentation.js`, 1, 'Daedalus', 'The Red Pill')

        // Check if it was bought
        await runLocal(ns, `plugins/singularity/getAugmentations.js`)
        const boughtAugmentations = (app.getFact('boughtAugmentations') as string[]) || []
        if (!boughtAugmentations.includes('The Red Pill')) {
          ns.tprint('❌ something went wrong trying to buy the red pill')
          return
        }

        // Buy Neuroflux Governors with the rest of the money
        ns.tprint('💡 Buying neuroflux governors with the rest of them money')
        while (true) {
          // Get price
          await runLocal(ns, `plugins/singularity/getAugmentationPrice.js`, 1, 'NeuroFlux Governor')
          const price = Number(app.getFact('priceOfNeuroFlux Governor'))

          // Get reputation requirement
          await runLocal(ns, `plugins/singularity/getAugmentationRepReq.js`, 1, 'NeuroFlux Governor')
          const repReq = Number(app.getFact('repReqOfNeuroFlux Governor'))

          if (reputation >= repReq && ns.getPlayer().money >= price) {
            await runLocal(ns, `plugins/singularity/buyFactionAugmentation.js`, 1, 'Daedalus', 'NeuroFlux Governor')
            ns.tprint('🧬 Bought neuroflux governor')
          } else {
            break
          }
        }

        app.updateSetting('daedalusState', DaedalusState.BoughtRedPill)
      }

      break
    }
    case DaedalusState.BoughtRedPill: {
      ns.tprint('🧬 Installing augmentations.')
      ns.tprint('♻️ Restarting instance.')
      app.updateSetting('needsReset', true)
      await runLocal(ns, `plugins/singularity/installAugmentations.js`, 1)
      break
    }
    case DaedalusState.InstalledRedPill: {
      // Advance to World Daemon when possible
      if (ns.getHackingLevel() >= 9000) {
        app.updateSetting('state', State.WorldDaemon)
        return
      }

      // Get price of next upgrade
      await runLocal(ns, `plugins/singularity/getAugmentationPrice.js`, 1, 'NeuroFlux Governor')
      const price = Number(app.getFact('priceOfNeuroFlux Governor'))

      // Prefer upgrading home RAM if a few augments cost more.
      const nextRamCosts = Number(app.getFact('upgradeRamCost'))
      if (nextRamCosts > 0 && price * 8 >= nextRamCosts) return

      // Get current reputation
      await runLocal(ns, `plugins/singularity/getFactionReputation.js`, 1, 'Daedalus')
      const reputation = Number(app.getFact('DaedalusReputation'))

      // Get reputation requirement
      await runLocal(ns, `plugins/singularity/getAugmentationRepReq.js`, 1, 'NeuroFlux Governor')
      const repReq = Number(app.getFact('repReqOfNeuroFlux Governor'))

      // Buy Neuroflux Governor
      if (reputation >= repReq && ns.getPlayer().money >= price) {
        if (await runLocal(ns, `plugins/singularity/buyFactionAugmentation.js`, 1, 'Daedalus', 'NeuroFlux Governor')) {
          ns.tprint('🧬 Bought neuroflux governor')
        }
      }

      // Donate excess money
      const donationAmount = 10e9
      if (ns.getPlayer().money >= price + donationAmount) {
        await runLocal(ns, `plugins/singularity/donateToFaction.js`, 1, 'Daedalus', donationAmount)
      }

      // Restart after buying 10 neuroflux governors
      const boughtAugmentations = (app.getFact('boughtAugmentations') as string[]) || []
      if (boughtAugmentations.length >= 10) {
        ns.tprint('🧬 Installing augmentations.')
        ns.tprint('♻️ Restarting instance.')
        app.updateSetting('needsReset', true)
        await runLocal(ns, `plugins/singularity/installAugmentations.js`, 1)
        break
      }

      break
    }
  }
}
