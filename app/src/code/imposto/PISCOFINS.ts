function atualizarPIS(prod: any, imposto: any) {
  const PIS = imposto.PIS
  const pis = Object.values(PIS)[0]
  calcular(prod, pis, 'PIS')
}

function atualizarPISST(prod: any, imposto: any) {
  const PISST = imposto.PISST
  if (PISST) calcular(prod, PISST, 'PIS')
}

function atualizarCOFINS(prod: any, imposto: any) {
  const COFINS = imposto.COFINS
  const cofins = Object.values(COFINS)[0]
  calcular(prod, cofins, 'COFINS')
}

function atualizarCOFINSST(prod: any, imposto: any) {
  const COFINSST = imposto.COFINSST
  if (COFINSST) calcular(prod, COFINSST, 'COFINS')
}

export function atualizarPISCOFINS(det: any) {
  const prod = det.prod
  const imposto = det.imposto
  atualizarPIS(prod, imposto)
  atualizarPISST(prod, imposto)
  atualizarCOFINS(prod, imposto)
  atualizarCOFINSST(prod, imposto)
}

export function calcular(prod: any, imposto: any, tipo: 'PIS' | 'COFINS') {
  const vProd = +prod['vProd'] || 0
  if (imposto['p' + tipo]) {
    const percentual = +imposto['p' + tipo]
    imposto['vBC'] = vProd
    imposto['v' + tipo] = (percentual * vProd) / 100
  } else imposto['vBC'] = ''
  if (imposto['vAliqProd']) {
    const vAliqProd = +imposto['vAliqProd']
    const qBCProd = +prod['qTrib'] || 0
    imposto['qBCProd'] = qBCProd
    imposto['v' + tipo] = vAliqProd * qBCProd
  } else imposto['qBCProd'] = ''
  if (!imposto['p' + tipo] && !imposto['vAliqProd']) imposto['v' + tipo] = ''
  return imposto
}

export const CST: [string, string][] = [
  ['01', 'Alíquota Normal (Cumulativo/Não Cumulativo)'],
  ['02', 'Alíquota Diferenciada'],
  ['03', 'Tributado por quantidade'],
  ['04', 'Operação com tributação monofásica (Alíquota Zero)'],
  ['05', 'Operação Tributável (ST)'],
  ['06', 'Operação Tributável - Alíquota Zero'],
  ['07', 'Operação Isenta da contribuição'],
  ['08', 'Operação sem incidência da contribuição'],
  ['09', 'Operação com suspensão da contribuição'],
  ['49', 'Outras Operações de Saída;'],
  [
    '50',
    'Operação com Direito a Crédito - Vinculada Exclusivamente a Receita Tributada no Mercado Interno;',
  ],
  [
    '51',
    'Operação com Direito a Crédito - Vinculada Exclusivamente a Receita Não Tributada no Mercado Interno;',
  ],
  [
    '52',
    'Operação com Direito a Crédito – Vinculada Exclusivamente a Receita de Exportação;',
  ],
  [
    '53',
    'Operação com Direito a Crédito - Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno;',
  ],
  [
    '54',
    'Operação com Direito a Crédito - Vinculada a Receitas Tributadas no Mercado Interno e de Exportação;',
  ],
  [
    '55',
    'Operação com Direito a Crédito - Vinculada a Receitas Não-Tributadas no Mercado Interno e de Exportação;',
  ],
  [
    '56',
    'Operação com Direito a Crédito - Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno, e de Exportação;',
  ],
  [
    '60',
    'Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita Tributada no Mercado Interno;',
  ],
  [
    '61',
    'Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita Não-Tributada no Mercado Interno;',
  ],
  [
    '62',
    'Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita de Exportação;',
  ],
  [
    '63',
    'Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno;',
  ],
  [
    '64',
    'Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas no Mercado Interno e de Exportação;',
  ],
  [
    '65',
    'Crédito Presumido - Operação de Aquisição Vinculada a Receitas Não-Tributadas no Mercado Interno e de Exportação;',
  ],
  [
    '66',
    'Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno, e de Exportação;',
  ],
  ['67', 'Crédito Presumido - Outras Operações;'],
  ['70', 'Operação de Aquisição sem Direito a Crédito;'],
  ['71', 'Operação de Aquisição com Isenção;'],
  ['72', 'Operação de Aquisição com Suspensão;'],
  ['73', 'Operação de Aquisição a Alíquota Zero;'],
  ['74', 'Operação de Aquisição; sem Incidência da Contribuição;'],
  ['75', 'Operação de Aquisição por Substituição Tributária;'],
  ['98', 'Outras Operações de Entrada;'],
  ['99', 'Outras Operações;'],
]
