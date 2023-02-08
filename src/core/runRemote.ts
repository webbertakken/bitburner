import { NS } from '@ns';

export const runRemote = (ns: NS, remoteScript, remoteHost, threads, ...args) => {
  ns.disableLog('exec');
  const pid = ns.exec(remoteScript, remoteHost, threads, ...args);

  if (pid === 0) {
    ns.print(`❌: Failed to run ${remoteScript} on ${remoteHost}.`);
    ns.exit();
  }

  return pid;
};
