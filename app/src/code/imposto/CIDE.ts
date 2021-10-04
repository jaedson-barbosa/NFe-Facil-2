export function calcularCIDE(prod: any) {
  const comb = prod.comb
  if (!comb) return prod
  const cide = comb.CIDE
  if (!cide) return prod
  const vAliqProd = +cide.vAliqProd
  if (cide.vAliqProd == '' || isNaN(vAliqProd)) {
    cide.qBCProd = cide.vCIDE = ''
    return prod
  }
  const qCom = +prod.qCom
  cide.qBCProd = qCom
  cide.vCIDE = qCom * vAliqProd
  return prod
}
