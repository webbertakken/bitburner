/**
 * Setting that will be loaded at the start of the application.
 *
 * Overrides will be stored as json in runtime.txt
 */
export const settings: Settings = {
  // Helps progress as fast as possible, disable when you want to start saving
  maxSpendingMode: true,

  // Automatically upgrade home machine
  upgradeHome: true,

  // Automatically buy the cheapest server and upgrades
  buyHardware: true,

  // Spend money to generate more in long term
  buyHacknetNodes: false,
}
