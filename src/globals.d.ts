type ScriptArg = string | number | boolean

type Setting = ScriptArg | null
type Settings = { [key: string]: Setting }

type Option = ScriptArg
type Options = { [key: string]: Option } | boolean
type Plugins = { [key: string]: Options }

type Fact = ScriptArg | ScriptArg[] | object | null
type Facts = { [key: string]: Fact }

type Formatter = (key: number) => string

type App = {
  hasWindow: () => boolean
  log: (...args: ScriptArg[]) => void
  formatters: { [key: string]: Formatter }
  sleep: NS['sleep']
  openWindow: (row?: number, col?: number, rowSpan?: number) => Promise<void>
  getPlugins: () => Plugins
  getPlugin: (name: string) => Options
  registerPlugin: (plugin: string, options: Options) => void
  getSettings: () => Settings
  getSetting: (option: string) => Setting
  updateSetting: (option: string, value: Setting) => void
  getFacts: () => Facts
  getFact: (name: string) => Fact
  updateFact: (name: string, value: Fact, silent?: boolean) => void
}

type NodeInfo = {
  id: string
  securityLevel: number
  minSecurityLevel: number
  reqHackingLevel: number
  reqPorts: number
  moneys: number
  formattedMoneys: string
  maxMoneys: number
  formattedMaxMoneys: string
  growth: number
  maxRam: number
  usedRam: number
  needsPayloadUpdate: boolean
  weakenTime: number
  growTime: number
  hackTime: number
  hackChance: number
  formattedHackTime: string
  hasRootAccess: boolean
  [key: string]: any
}
