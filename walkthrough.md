# Walkthrough

A quick walkthrough of manual steps that need to be repeated every time you install augments.

## Prerequisites

```bash
alias a=analyze
alias sa=scan-analyze
alias nslookup=run tools/nslookup.js
```

## Unlocks

1. go to Alpha ent.
2. buy tor router
3. connect to darknet

```bash
connect darknet
buy -a
```

## Factions

In order to join a faction, you need to backdoor the faction's server.

```bazaar
sa <1-5>
connect <server>
run NUKE.exe
backdoor
```

### Continental

| Faction     | Continent | Offers unlocks?              | Completed |
| :---------- | :-------- | ---------------------------- | :-------: |
| Sector-12   | Sector-12 | Yes (1m, BruteSSH.exe)       |    ✅     |
| Aevum       | Aevum     | DeepscanV1.exe, AutoLink.exe |    ✅     |
| Tian Di Hui | Ishima    | Remove non-focus penalty     |    ✅     |
| Chongqing   | Chongqing |                              |    ❌     |
| Ishima      | Ishima    |                              |    ❌     |
| New Tokyo   | New Tokyo |                              |    ❌     |
| Volhaven    | Volhaven  |                              |    ❌     |

### Progress based

| Faction        | Host         | Unlocks      | Offers unlocks?         | Completed |
| :------------- | :----------- | ------------ | ----------------------- | :-------: |
| Netburners     |              |              | Essential               |    ✅     |
| CyberSec       | CSEC         |              | No                      |    ✅     |
| NiteSec        | avmnite-02h  |              | Essential               |    ✅     |
| The Black Hand | I.I.I.I      | 500 hacking? | Milestones only         |    ✅     |
| BitRunners     | run4theh111z | 529 hacking  | FTPCrack.exe, relaySMTP |    ❌     |
