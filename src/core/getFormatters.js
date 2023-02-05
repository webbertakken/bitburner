/** @param {NS} ns */
export const getFormatters = (ns) => ({
  money: (amount) => `${ns.nFormat(amount, '$0.00a')}`.toUpperCase(),
  time: (time) => ns.tFormat(time),
  number: (amount) => ns.nFormat(amount, '0.00'),
  percentage: (amount) => ns.nFormat(amount, '0.00%'),
})