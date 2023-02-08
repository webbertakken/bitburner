# Bitburner 

AI that will take over the world in a game called Bitburner.

## Architecture

Inside the game you `run start.js`, which will bootstrap all logic.

It will open terminals for:

- The bootstrapper (start.ts)
- Monitor (monitor.js) - this will indicate what's going on in the game.
- Worm (worm.js) - auto discovers nodes on the internet and will attempt to add them to your botnet.
- Spawner (spawner-local.js) - will fully utilise any resources on the home machine.
- Collector (collector.js) - will collect money from your servers.
- Controller (rent-stuff.js) - will use your money to rent and upgrade servers to run workloads and grow your botnet. 

## Setup

Install dependencies

```bash
yarn
```

Copy the values from `bitburner-theme.json` (custom dracula based hacker theme) into the game's theme editor.

## Usage

1. Run the server `yarn dev`
2. Inside bitburner connect using "Remote API" using port `12525`
3. You should see the following

```bash
Connection made!
{ jsonrpc: '2.0', result: 'OK', id: 0 }
```

Now when you change or delete files it will be reflected in the game.
