var formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function getMoeda(v: string | number) {
  const n = +v
  return formatter.format(n)
}

export function getInteiroStr(v: number, nInteiros: number) {
  return v.toLocaleString('pt-BR', { minimumIntegerDigits: nInteiros })
}
