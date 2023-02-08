import { createApp } from './core/app';
import { getNodeInfo } from './core/getNodeInfo';
import { runRemote } from './core/runRemote';

const SECONDS = 1000;

/** @param {NS} ns */
const createWorm = (app, ns) => {
  const registry = { isInitialRun: true };

  const scanSelf = async () => ({ hackingLevel: ns.getHackingLevel(), id: ns.getHostname() });

  const scanNetwork = async (host) => {
    return ns
      .scan(host)
      .filter((nodeId) => !registry.discovered.includes(nodeId))
      .map((nodeId) => getNodeInfo(ns, nodeId))
      .sort((a, b) => a.securityLevel - b.securityLevel);
  };

  const tryGetAccess = async (node) => {
    if (node.hasRootAccess) {
      // app.log(`✅ ${node.id} - (${node.maxRam}GB)`)
      return true;
    }

    if (node.reqHackingLevel > registry.self.hackingLevel) {
      // app.log(`❌ ${node.id} - (req hacking level: ${node.reqHackingLevel}).`)
      return false;
    }

    let portsLeft = node.reqPorts;
    if (portsLeft >= 1) {
      if (ns.fileExists('BruteSSH.exe')) {
        ns.brutessh(node.id);
        portsLeft--;
      }
      if (ns.fileExists('HTTPWorm.exe')) {
        ns.httpworm(node.id);
        portsLeft--;
      }

      if (ns.fileExists('FTPCrack.exe')) {
        ns.ftpcrack(node.id);
        portsLeft--;
      }

      if (ns.fileExists('relaySMTP.exe')) {
        ns.relaysmtp(node.id);
        portsLeft--;
      }

      if (ns.fileExists('SQLInject.exe')) {
        ns.sqlinject(node.id);
        portsLeft--;
      }
    }

    if (portsLeft >= 1) {
      // app.log(`❌ ${node.id} - ${portsLeft} ports left.`)
      return false;
    }

    ns.nuke(node.id);
    app.log(`✅ ${node.id} (${node.securityLevel}) - Successfully cracked.`);
    registry.hasNewNodes = true;
    registry.exploited.push(node.id);
    return true;
  };

  const deliverPayload = async (node) => {
    const { id: host } = node;

    const self = ns.getHostname();

    // Skip low memory
    if (ns.getServerMaxRam(host) < 8) return;

    // Skip problematic hosts
    const exclusions = ['home', 'CSEC', 'the-hub', 'zb-institute', 'solaris', 'univ-energy', 'global-pharm'];
    if (exclusions.includes(host)) return;

    // Copy scripts
    const scripts = [
      { script: '/core/app.js', remoteScript: '/core/app.js' },
      { script: '/core/fillAllocation.js', remoteScript: '/core/fillAllocation.js' },
      { script: '/core/getMaxThreads.js', remoteScript: '/core/getMaxThreads.js' },
      { script: '/core/runLocal.js', remoteScript: '/core/runLocal.js' },
      { script: '/core/getFormatters.js', remoteScript: '/core/getFormatters.js' },
      { script: '/dist/weaken.js', remoteScript: 'weaken.js' },
      { script: '/dist/grow.js', remoteScript: 'grow.js' },
      { script: '/dist/spawner.js', remoteScript: 'spawner.js', init: true },
      { script: '/dist/collector.js', remoteScript: 'collector.js' },
    ];

    for (const { script, remoteScript } of scripts) {
      const uploadSuccess = ns.scp(script, host, self);
      if (!uploadSuccess) throw new Error(`Failed to upload ${script} to ${host}`);
      if (remoteScript !== script) ns.mv(host, script, remoteScript);
    }

    // Run script
    ns.killall(host);
    await ns.sleep(1000);
    const { remoteScript } = scripts.find(({ init }) => init);
    runRemote(ns, remoteScript, host, 1, registry.target, registry.type || '');
    app.log(`📦 Deployed payload to ${host}`);
  };

  const exploitNetwork = async (nodeId = registry.self.id) => {
    const network = await scanNetwork(nodeId);
    // Deliver payloads
    for (const node of network) {
      registry.discovered.push(node.id);

      if (await tryGetAccess(node)) {
        registry.exploited.push(node.id);

        if (node.needsPayloadUpdate || registry.isInitialRun) {
          await deliverPayload(node);
        }
      }
      await ns.sleep(1);
    }

    // Recursive
    for (const node of network) {
      await exploitNetwork(node.id);
    }
  };

  return {
    run: async (target, type) => {
      registry.target = target;
      registry.type = type;
      registry.self = await scanSelf();
      registry.discovered = [];
      registry.exploited = [];
      registry.hasNewNodes = registry.isInitialRun || false;

      // Get access to target first
      while (!(await tryGetAccess(getNodeInfo(ns, registry.target)))) {
        ns.clearLog();
        app.log(`🏃 Running...`);
        app.log(`⚠️ Unable to attain access to ${registry.target}...`);
        app.log(`   No payloads will be deployed. Retrying every second...`);
        await ns.sleep(1000);
      }

      // Exploit network and attack target
      await exploitNetwork();

      if (registry.hasNewNodes) {
        app.log(`🎯 Exploited ${registry.exploited.length}/${registry.discovered.length} nodes.`);
      }

      registry.isInitialRun = false;
      await ns.sleep(12 * SECONDS);
    },
  };
};

/** @param {NS} ns */
export async function main(ns) {
  const app = await createApp(ns);
  await app.openWindow(3, 0, 2);

  const [target, type] = ns.args;
  const worm = createWorm(app, ns);

  app.log(`🏃 Running...`);

  while (true) {
    await worm.run(target, type);
    await ns.sleep(1000);
  }
}
