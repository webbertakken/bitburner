import { createScanner } from './scan';

export const lookup = (ns, host) => {
  return createScanner(ns)
    .scanRecursively()
    .find((node) => node.id === host);
};

export const main = async (ns) => {
  const [host] = ns.args;

  ns.tprint(`🔍 Looking up ${host}`);
  const node = lookup(ns, host);
  ns.tprint(JSON.stringify(node, null, 2));

  const connect = `connect ` + node.path.split(' ').join('; connect ');
  ns.tprint(`🧑🏻‍💻 Commands:
    ${connect} ; ls ;
  `);
};
