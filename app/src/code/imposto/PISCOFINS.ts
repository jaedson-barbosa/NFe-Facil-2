export function calcular(prod: any, imposto: any, tipo: 'PIS' | 'COFINS') {
  const vProd = +(prod['vProd'] ?? 0)
  const pName = 'p' + tipo
  if (imposto[pName]) {
    const percentual = +imposto[pName]
    imposto['vBC'] = vProd
    return percentual * vProd / 100
  } else imposto['vBC'] = ''
  if (imposto['vAliqProd']) {
    const vAliqProd = +imposto['vAliqProd']
    const qBCProd = +(prod['qTrib'] ?? 0)
    imposto['qBCProd'] = qBCProd
    return vAliqProd * qBCProd
  } else imposto['qBCProd'] = ''
  return ''
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
