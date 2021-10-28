const zero = {
  vBC: 0,
  vICMS: 0,
  vICMSDeson: 0,
  vFCPUFDest: 0,
  vICMSUFDest: 0,
  vICMSUFRemet: 0,
  vFCP: 0,
  vBCST: 0,
  vST: 0,
  vFCPST: 0,
  vFCPSTRet: 0,
  vProd: 0,
  vFrete: 0,
  vSeg: 0,
  vDesc: 0,
  vII: 0,
  vIPI: 0,
  vIPIDevol: 0,
  vPIS: 0,
  vCOFINS: 0,
  vOutro: 0,
  vNF: 0,
  vTotTrib: 0,
}

type TICMSTot = typeof zero

function addProd(p: TICMSTot, v: any): TICMSTot {
  const vIPIDevol = +v.impostoDevol?.IPI?.vIPIDevol || 0
  p.vIPIDevol += vIPIDevol
  p.vNF += vIPIDevol

  if (v.imposto.ICMS) {
    const icms = Object.values<any>(v.imposto.ICMS)[0]
    p.vBC += +icms.vBC || 0
    p.vICMS += +icms.vICMS || 0
    const vICMSDeson = +icms.vICMSDeson || 0
    p.vICMSDeson += vICMSDeson
    p.vFCPUFDest += +icms.vFCPUFDest || 0
    p.vICMSUFDest += +icms.vICMSUFDest || 0
    p.vICMSUFRemet += +icms.vICMSUFRemet || 0
    p.vFCP += +icms.vFCP || 0
    p.vBCST += +icms.vBCST || 0
    p.vST += +icms.vST || 0
    const vFCPST = +icms.vFCPST || 0
    p.vFCPST += vFCPST
    p.vFCPSTRet += +icms.vFCPSTRet || 0
    p.vNF += vFCPST - vICMSDeson
  }
  if (v.imposto.II) {
    const vII = +v.imposto.II.vII || 0
    p.vII += vII
    p.vNF += vII
  }
  if (v.imposto.IPI) {
    const vIPI = +v.imposto.IPI.IPITrib?.vIPI || 0
    p.vIPI += vIPI
    p.vNF += vIPI
  }
  if (v.imposto.PIS) {
    const pis = Object.values<any>(v.imposto.PIS)[0]
    p.vPIS += +pis.vPIS || 0
  }
  if (v.imposto.PISST?.indSomaPISST === "1") {
    p.vNF += v.imposto.PISST.vPIS
  }
  if (v.imposto.COFINS) {
    const cofins = Object.values<any>(v.imposto.COFINS)[0]
    p.vCOFINS += +cofins.vCOFINS || 0
  }
  if (v.imposto.COFINSST?.indSomaCOFINSST === "1") {
    p.vNF += v.imposto.COFINSST.vCOFINS
  }
  const vProd = +v.prod.indTot == 1 ? +v.prod.vProd : 0
  p.vProd += vProd
  const vFrete = +v.prod.vFrete || 0
  p.vFrete += vFrete
  const vSeg = +v.prod.vSeg || 0
  p.vSeg += vSeg
  const vDesc = +v.prod.vDesc || 0
  p.vDesc += vDesc
  const vOutro = +v.prod.vOutro || 0
  p.vOutro += vOutro
  p.vTotTrib += +v.imposto.vTotTrib || 0
  p.vNF += vProd - vDesc + vFrete + vSeg + vOutro
  return p
}

export function calcularICMSTot(det: any[], consumidorFinal: boolean): TICMSTot {
  const res: TICMSTot = det.reduce(addProd, { ...zero })
  if (!consumidorFinal) delete res.vTotTrib
  return res
}
