export function removePrefix(obj: any) {
  if (typeof obj != 'object') return obj
  const e = Object.entries(obj)
  if (!e[0]) return obj
  if (e[0][0] == '$t') return e[0][1]
  e.forEach(([v0, v1]) => (obj[v0] = removePrefix(v1)))
  return obj
}