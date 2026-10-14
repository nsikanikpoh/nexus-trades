// Compare complete origins, not forwarded Host headers controlled by a proxy.
export function isAllowedOrigin(origin, { appOrigin, production = false, host, protocol = 'http' } = {}) {
  if (!origin) return true; // Non-browser clients do not necessarily send Origin.
  let parsed;
  try {
    parsed = new URL(origin);
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.origin !== origin) return false;
  } catch { return false; }
  const allowed = new Set();
  if (appOrigin) {
    try { allowed.add(new URL(appOrigin).origin); } catch { return false; }
  } else if (host) {
    try { allowed.add(new URL(`${protocol}://${host}`).origin); } catch { return false; }
  }
  if (!production) {
    allowed.add('http://localhost:5173');
    allowed.add('http://127.0.0.1:5173');
  }
  return allowed.has(parsed.origin);
}
