import { NS } from '@ns'

export type Milestone = {
  goal: string
  target: string
  type?: 'weaken'
  achieved: () => boolean
}

export const getMilestones = (ns: NS): Milestone[] => [
  {
    goal: 'get hacking level 150',
    target: 'n00dles',
    achieved: () =>
      ns.getHackingLevel() >= 100 && ns.hasRootAccess('foodnstuff') && ns.fileExists('BruteSSH.exe', 'home'),
  },
  {
    goal: 'weaken food n stuff',
    target: 'foodnstuff',
    type: 'weaken',
    achieved: () =>
      ns.getServerSecurityLevel('foodnstuff') === ns.getServerMinSecurityLevel('foodnstuff') ||
      (ns.getHackingLevel() >= 150 && ns.hasRootAccess('harakiri-sushi')),
  },
  {
    goal: 'get hacking level 150',
    target: 'foodnstuff',
    type: 'weaken',
    achieved: () => ns.getHackingLevel() >= 150 && ns.hasRootAccess('harakiri-sushi'),
  },
  {
    goal: 'prepare to farm harakiri-sushi',
    type: 'weaken',
    target: 'harakiri-sushi',
    achieved: () =>
      ns.getServerSecurityLevel('harakiri-sushi') === ns.getServerMinSecurityLevel('harakiri-sushi') ||
      (ns.getHackingLevel() >= 600 && ns.hasRootAccess('max-hardware')),
  },
  {
    goal: 'farm billions, get hacking level',
    target: 'harakiri-sushi',
    achieved: () => ns.getHackingLevel() >= 600 && ns.hasRootAccess('max-hardware'),
  },
  {
    goal: 'prepare to farm max-hardware',
    target: 'max-hardware',
    type: 'weaken',
    achieved: () =>
      ns.getServerSecurityLevel('max-hardware') === ns.getServerMinSecurityLevel('max-hardware') ||
      (ns.getHackingLevel() >= 950 && ns.hasRootAccess('zeus-med')),
  },
  {
    goal: 'farm many billions, get hacking level',
    target: 'max-hardware',
    achieved: () => ns.getHackingLevel() >= 950 && ns.hasRootAccess('zeus-med'),
  },
  {
    goal: 'prepare to farm zeus-med',
    type: 'weaken',
    target: 'zeus-med',
    achieved: () =>
      ns.getServerSecurityLevel('zeus-med') === ns.getServerMinSecurityLevel('zeus-med') ||
      (ns.getHackingLevel() > 3000 && ns.hasRootAccess('ecorp')),
  },
  {
    goal: 'get to hacking level xxx while spending everything',
    target: 'zeus-med',
    achieved: () => ns.getHackingLevel() > 3000 && ns.hasRootAccess('ecorp'),
  },
  {
    goal: 'weaken ecorp',
    type: 'weaken',
    target: 'ecorp',
    achieved: () => ns.getServerSecurityLevel('ecorp') === ns.getServerMinSecurityLevel('ecorp'),
  },
  {
    goal: 'farm ecorp, buy augments',
    target: 'ecorp',
    achieved: () => false,
  },
]
