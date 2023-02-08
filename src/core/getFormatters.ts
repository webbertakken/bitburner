import { NS } from '@ns'

export const getFormatters = (ns: NS) => ({
  money: (amount: number) => `${ns.nFormat(amount, '$0.00a')}`.toUpperCase(),
  time: (time: number) => ns.tFormat(time),
  number: (amount: number) => ns.nFormat(amount, '0.00'),
  percentage: (amount: number) => ns.nFormat(amount, '0.00%'),
  size: (amount: number) => ns.nFormat(amount, '0GB'),
})
