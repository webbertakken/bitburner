import { NS } from '@ns';

export const getNodeInfo = (ns: NS, nodeId) => {
  const maxRam = ns.getServerMaxRam(nodeId);
  const usedRam = ns.getServerUsedRam(nodeId);

  // Utilised more than 60% of RAM
  // Accurate enough for both small server with little RAM  and big servers that double in size
  let needsPayloadUpdate = maxRam >= 8 && usedRam / maxRam <= 0.6;

  return {
    id: nodeId,
    securityLevel: ns.getServerSecurityLevel(nodeId),
    minSecurityLevel: ns.getServerMinSecurityLevel(nodeId),
    reqHackingLevel: ns.getServerRequiredHackingLevel(nodeId),
    reqPorts: ns.getServerNumPortsRequired(nodeId),
    moneys: ns.getServerMoneyAvailable(nodeId),
    formattedMoneys: ns.nFormat(ns.getServerMoneyAvailable(nodeId), '(0.00 a)'),
    maxMoneys: ns.getServerMaxMoney(nodeId),
    formattedMaxMoneys: ns.nFormat(ns.getServerMaxMoney(nodeId), '(0.00 a)'),
    growth: ns.getServerGrowth(nodeId),
    maxRam,
    usedRam,
    needsPayloadUpdate,
    weakenTime: ns.getWeakenTime(nodeId),
    growTime: ns.getGrowTime(nodeId),
    hackTime: ns.getHackTime(nodeId),
    hackChance: ns.hackAnalyzeChance(nodeId),
    formattedHackTime: ns.nFormat(ns.getHackTime(nodeId) / 1000, '(MM:ss)'),
    hasRootAccess: ns.hasRootAccess(nodeId),
  };
};
