export function calcular(prod: any, imposto: any) {
  const vProd = +(prod['vProd'] ?? 0)
  const vFrete = +(prod['vFrete'] ?? 0)
  const vSeg = +(prod['vSeg'] ?? 0)
  const vOutro = +(prod['vOutro'] ?? 0)
  if (imposto['pIPI']) {
    const pIPI = +imposto['pIPI']
    const vBC = vProd + vFrete + vSeg + vOutro
    imposto['vBC'] = vBC
    return pIPI * vBC / 100
  } else imposto['vBC'] = undefined
  if (imposto['vUnid']) {
    const vUnid = +imposto['vUnid']
    const qUnid = +(prod['qTrib'] ?? 0)
    imposto['qUnid'] = qUnid
    return vUnid * qUnid
  } else imposto['qBCProd'] = undefined
  if (!imposto['pIPI'] && !imposto['vUnid']) return undefined
}

export const CST: [string, string][] = [
  ['00', 'Entrada com recuperação de crédito'],
  ['01', 'Entrada tributada com alíquota zero'],
  ['02', 'Entrada isenta'],
  ['03', 'Entrada não-tributada'],
  ['04', 'Entrada imune'],
  ['05', 'Entrada com suspensão'],
  ['49', 'Outras entradas'],
  ['50', 'Saída tributada'],
  ['51', 'Saída tributada com alíquota zero'],
  ['52', 'Saída isenta'],
  ['53', 'Saída não-tributada'],
  ['54', 'Saída imune'],
  ['55', 'Saída com suspensão'],
  ['99', 'Outras saídas'],
]
