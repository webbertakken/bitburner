export enum State {
  Init = 'init',
  Daedalus = 'daedalus',
}

export enum DaedalusState {
  DisabledThisRun = 'disabledThisRun',
  None = 'none',
  UnlockPrerequisites = 'unlockPrerequisites',
  UnlockDonations = 'unlockDonations',
  BuyRedPill = 'buyRedPill',
  BoughtRedPill = 'boughtRedPill',
  InstalledRedPill = 'installedRedPill',
}

/**
 * Setting that will be loaded at the start of the application.
 *
 * Overrides will be stored as json in runtime.txt
 */
export const settings: Settings = {
  // Global state
  state: State.Init,

  // Sub-states
  daedalusState: DaedalusState.None,

  // Helps progress as fast as possible, disable when you want to start saving
  maxSpendingMode: true,

  // Automatically upgrade home machine
  upgradeHome: true,

  // Automatically buy the cheapest server and upgrades
  buyHardware: true,

  // Spend money to generate more in long term
  buyHacknetNodes: false,
}
