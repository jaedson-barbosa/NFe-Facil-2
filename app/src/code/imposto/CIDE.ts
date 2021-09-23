export function calcularCIDE(prod: any) {
  const comb = prod.comb
  if (!comb) return
  const cide = comb.CIDE
  if (!cide) return
  cide.qBCProd = prod.qCom
  cide.vCIDE = +prod.qCom * +cide.vAliqProd || 0
  return comb
}
