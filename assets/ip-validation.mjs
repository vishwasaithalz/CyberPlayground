/**
 * Strict, syntax-only IPv4/IPv6 validation for the local network lab.
 * This does not determine whether an address is publicly routable.
 */
function isValidIPv4(address) {
  const groups = address.split('.');
  return groups.length === 4 && groups.every(group =>
    /^(?:0|[1-9][0-9]{0,2})$/.test(group) && Number(group) <= 255
  );
}

function isValidIPv6(address) {
  if (!address.includes(':') || address.includes('%')) return false;

  const halves = address.split('::');
  if (halves.length > 2) return false;
  const compressed = halves.length === 2;
  const groups = [];
  for (const half of halves) {
    if (!half) continue;
    const section = half.split(':');
    if (section.some(group => !group)) return false;
    groups.push(...section);
  }

  let slots = 0;
  for (let i = 0; i < groups.length; i += 1) {
    const group = groups[i];
    if (group.includes('.')) {
      // A dotted IPv4 tail occupies exactly two 16-bit IPv6 groups.
      if (i !== groups.length - 1 || !isValidIPv4(group)) return false;
      slots += 2;
    } else {
      if (!/^[0-9a-fA-F]{1,4}$/.test(group)) return false;
      slots += 1;
    }
  }

  // The double colon must actually compress one or more groups.
  return compressed ? slots < 8 : slots === 8;
}

export function isValidIpAddress(input) {
  if (typeof input !== 'string' || input !== input.trim() || !input) return false;
  return input.includes(':') ? isValidIPv6(input) : isValidIPv4(input);
}
