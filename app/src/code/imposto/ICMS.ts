export function atualizarICMS(det: any, consumidorFinal: boolean) {
  const prod = det.prod
  const ICMS = det.imposto.ICMS
  const icms = Object.values(ICMS)[0]
  const IPI = det.imposto.IPI
  calcular(prod, icms, IPI, consumidorFinal)
}

export function calcular(
  prod: any,
  ICMS: any,
  ipi: any,
  consumidorFinal: boolean
) {
  const res = _calcular(prod, ICMS, ipi, consumidorFinal)
  if (res.vICMSOp) {
    ICMS.vICMSOp = res.vICMSOp
    ICMS.vICMSDif = res.vICMSDif
  } else ICMS.vICMSOp = ICMS.vICMSDif = ''
  if (res.vBCST) {
    ICMS.vBCST = res.vBCST
    ICMS.vICMSST = res.vICMSST
  } else ICMS.vBCST = ICMS.vICMSST = ''
  ICMS.vBC = res.vBC ? res.vBC : ''
  ICMS.vICMS = res.vICMS ? res.vICMS : ''
  return ICMS
}

function _calcular(
  prod: any,
  imposto: any,
  ipi: any,
  consumidorFinal: boolean
) {
  const vProd = +(prod.vProd ?? 0)
  const vFrete = +(prod.vFrete ?? 0)
  const vSeg = +(prod.vSeg ?? 0)
  const vOutro = +(prod.vOutro ?? 0)
  const vDesc = +(prod.vDesc ?? 0)
  const vIPI = consumidorFinal ? +(ipi?.IPITrib?.vIPI ?? 0) : 0
  const pRedBC = +(imposto.pRedBC ?? 0)
  const vBCOriginal = vProd + vFrete + vSeg + vOutro - vDesc + vIPI
  const vBC = vBCOriginal * (1 - pRedBC / 100)
  let retorno: any = {}
  if (imposto.pICMS) {
    const pICMS = +(imposto.pICMS ?? 0)
    const pDif = +(imposto.pDif ?? 0)
    if (pDif) {
      const vICMSOp = vBC * (pICMS / 100)
      const vICMSDif = vICMSOp * (pDif / 100)
      const vICMS = vICMSOp - vICMSDif
      retorno = { ...retorno, vBC, vICMSOp, vICMSDif, vICMS }
    } else {
      const vICMS = vBC * (pICMS / 100)
      retorno = { ...retorno, vBC, vICMS }
    }
  }
  if (imposto.pICMSST) {
    const pMVAST = +(imposto.pMVAST ?? 0)
    const pRedBCST = +(imposto.pRedBCST ?? 0)
    const vBCST = vBCOriginal * (1 + pMVAST / 100) * (1 - pRedBCST / 100)
    const pICMSST = +(imposto.pICMSST ?? 0)
    const vICMSST = vBCST * (pICMSST / 100)
    retorno = { ...retorno, vBCST, vICMSST }
  }
  return retorno
}

export let CST: [string, string][] = [
  ['00', 'Tributada integralmente'],
  ['10', 'Tributada e com cobrança por ST'],
  ['20', 'Com redução de base de cálculo'],
  ['30', 'Isenta ou não tributada e com cobrança por ST'],
  ['40', 'Isenta'],
  ['41', 'Não tributada'],
  ['50', 'Suspensão'],
  ['51', 'Diferimento'],
  ['60', 'Cobrado anteriormente por ST'],
  ['70', 'Com redução de base de cálculo e cobrança por ST'],
  ['90', 'Outras'],
  ['Part10', 'Partilhado entre UFs e com cobrança do por ST'],
  ['Part90', 'Partilhado entre UFs, outros'],
  ['ST41', 'ST para UF de destino não tributado no remetente'],
  ['ST60', 'ST para UF de destino cobrado por ST no remetente'],
]

export let CSOSN: [string, string][] = [
  ['101', 'Tributado com permissão de crédito'],
  ['102', 'Tributada sem permissão de crédito'],
  ['103', 'Isenção para faixa de receita bruta'],
  ['201', 'Tributada com permissão de crédito e com cobrança por ST'],
  ['202', 'Tributada sem permissão de crédito e com cobrança por ST'],
  ['203', 'Isenção para faixa de receita bruta e com cobrança por ST'],
  ['300', 'Imune'],
  ['400', 'Não tributada'],
  ['500', 'Cobrado anteriormente por ST ou por antecipação'],
  ['900', 'Outros'],
]

export let origem: [string, string][] = [
  ['0', 'Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8'],
  ['1', 'Estrangeira - Importação direta, exceto a indicada em 6'],
  ['2', 'Estrangeira - Adquirida no mercado interno, exceto a indicada em 7'],
  ['3', 'Nacional, conteudo superior 40% e inferior ou igual a 70%'],
  ['4', 'Nacional, processos produtivos básicos'],
  ['5', 'Nacional, importação inferior ou igual a 40%'],
  ['6', 'Estrangeira - Importação direta, sem similar nacional'],
  ['7', 'Estrangeira - Adquirida no mercado interno, sem similar nacional'],
  ['8', 'Nacional, importação superior a 70%'],
]

export function getMotDes(tipoICMS: string): [string, string][] {
  if (tipoICMS === '30') {
    return [
      ['6', 'Utilitários e motos da Amazônia Ocidental e ALC'],
      ['7', 'SUFRAMA'],
      ['9', 'Outros'],
    ]
  } else if (['40', '41', '50'].includes(tipoICMS)) {
    return [
      ['1', 'Táxi'],
      ['3', 'Uso na agropecuária'],
      ['4', 'Frotista ou locadora'],
      ['5', 'Diplomático ou consular'],
      ['6', 'Utilitários e motos da Amazônia Ocidental e ALC'],
      ['7', 'SUFRAMA'],
      ['8', 'Venda a órgão público'],
      ['9', 'Outros'],
      ['10', 'Deficiente condutor'],
      ['11', 'Deficiente não condutor'],
      ['16', 'Olimpíadas Rio 2016'],
      ['90', 'Solicitado pelo fisco'],
    ]
  } else {
    return [
      ['3', 'Uso na agropecuária'],
      ['9', 'Outros'],
      ['12', 'Fomento agropecuário'],
    ]
  }
}

export const modBC: [string, string][] = [
  ['0', 'Margem Valor Agregado (%)'],
  ['1', 'Pauta (valor)'],
  ['2', 'Preço Tabelado Máximo (valor)'],
  ['3', 'Valor da Operação'],
]

export const modBCST: [string, string][] = [
  ['0', 'Preço tabelado ou máximo sugerido'],
  ['1', 'Lista Negativa (valor)'],
  ['2', 'Lista Positiva (valor)'],
  ['3', 'Lista Neutra (valor)'],
  ['4', 'Margem Valor Agregado (%)'],
  ['5', 'Pauta (valor)'],
  ['6', 'Valor da Operação'],
]
