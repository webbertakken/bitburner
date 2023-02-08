import { createApp } from '../../core/app.js';

/** @param {NS} ns */
export async function main(ns) {
  const app = await createApp(ns);
  try {
    ns.ps();
    app.registerPlugin('base', {});
    ns.tprint('✔️ Base plugin registered.');
  } catch {
    // This should never happen
    ns.tprint('✖️ Base plugin NOT registered.');
  }
}
