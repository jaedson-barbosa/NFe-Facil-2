export function limparICMSUFDest({ ICMSUFDest }: any) {
  if (!ICMSUFDest) return
  delete ICMSUFDest.vBCUFDest
  delete ICMSUFDest.vBCFCPUFDest
  delete ICMSUFDest.pICMSInter
  delete ICMSUFDest.vFCPUFDest
  delete ICMSUFDest.vICMSUFDest
}

export function atualizarICMSUFDest(
  prod: any,
  { ICMSUFDest, IPI }: any,
  consumidorFinal: boolean,
  importado: boolean,
  ufOrigem: string,
  ufDestino: string
) {
  if (!ICMSUFDest) return
  const vProd = +prod.vProd || 0
  const vFrete = +prod.vFrete || 0
  const vSeg = +prod.vSeg || 0
  const vOutro = +prod.vOutro || 0
  const vDesc = +prod.vDesc || 0
  const vIPI = consumidorFinal ? +IPI?.IPITrib?.vIPI || 0 : 0
  const vBC = vProd + vFrete + vSeg + vOutro - vDesc + vIPI
  const sulSudesteExcetoES = ['MG', 'RJ', 'SP', 'PR', 'SC', 'RS']
  const pICMSInter = importado
    ? 4
    : sulSudesteExcetoES.includes(ufOrigem) &&
      !sulSudesteExcetoES.includes(ufDestino)
    ? 7
    : 12
  ICMSUFDest.pICMSInter = pICMSInter.toFixed(2)
  ICMSUFDest.vBCUFDest = ICMSUFDest.vBCFCPUFDest = vBC != undefined ? vBC : ''
  const pFCPUFDest = +ICMSUFDest.pFCPUFDest || 0
  ICMSUFDest.vFCPUFDest = (vBC * pFCPUFDest) / 100
  ICMSUFDest.vICMSUFDest = (vBC * (+ICMSUFDest.pICMSUFDest - pICMSInter)) / 100
}
