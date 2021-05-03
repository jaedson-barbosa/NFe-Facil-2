import { getName } from './getName';

export function getDocumentation(v: any): string {
  const name = getName(v);
  const fromScheme = v['xs:annotation']?.['xs:documentation'];
  if (name) {
    const custom = customHeaders.find((v) => name === v.name)?.header;
    const nameParts = name.split('|');
    return (
      custom ??
      fromScheme ??
      customHeaders.find((v) => {
        const customParts = v.name.split('|');
        return customParts.every((k) => nameParts.includes(k));
      })?.header ??
      ''
    );
  }
  return fromScheme ?? '';
}

const customHeaders: { name: string; header: string }[] = [
  { name: 'fone', header: 'Telefone' },
  {
    name: 'CFOP',
    header: 'Código Fiscal de Operações e Prestações - CFOP',
  },
  { name: 'CNPJ|CPF', header: 'Documento usado' },
  {
    name: 'cRegTrib',
    header:
      'Código do regime especial de tributação\n1=Microempresa Municipal; 2=Estimativa; 3=Sociedade de Profissionais; 4=Cooperativa; 5=Microempresário Individual (MEI); 6=Microempresário e Empresa de Pequeno Porte',
  },
  {
    name: 'indSomaPISST',
    header: `Indica se o valor do PISST compõe o valor total da NF-e
0=Valor do PISST não compõe o valor total da NF-e
1=Valor do PISST compõe o valor total da NF-e`,
  },
  {
    name: 'indSomaCOFINSST',
    header: `Indica se o valor da COFINS ST compõe o valor total da NF-e
0=Valor da COFINSST não compõe o valor total da NF-e
1=Valor da COFINSST compõe o valor total da NF-e`,
  },
  { name: 'veicTransp|reboque', header: 'Veículo' },
  { name: 'lacres', header: 'Lacres' },
  { name: 'pag', header: 'Informações de Pagamento' },
  {
    name: 'cBenef',
    header: 'Código de Benefício Fiscal na UF aplicado ao item',
  },
  {
    name: 'indTot',
    header: `O valor do item:
0 – Não compõe o valor total da NF-e
1 – Compõe o valor total da NF-e`,
  },
  {
    name: 'CEST|indEscala|CNPJFab',
    header: `Código Especificador da Substituição Tributária`,
  },
  {
    name: 'indEscala',
    header: `Indicador de Produção em escala relevante
S - Produzido em escala relevante
N – Produzido em escala não relevante`,
  },
  {
    name: 'cProdANVISA',
    header: 'Código de Produto da ANVISA',
  },
  {
    name: 'xMotivoIsencao',
    header: 'Motivo da isenção da ANVISA',
  },
  {
    name: 'ICMSUFDest',
    header: 'Dados do ICMS Interestadual',
  },
  { name: 'IPI|ISSQN', header: 'Tributação para serviços' },
  {
    name: 'ICMS|IPI|II',
    header: 'Tributação para produtos',
  },
  {
    name: 'IPI',
    header: 'Imposto sobre produtos industrializados',
  },
  {
    name: 'impostoDevol',
    header: 'Informação do imposto devolvido',
  },
  {
    name: 'pFCP|vFCP',
    header: 'Fundo de combate à pobreza',
  },
  {
    name: 'pFCPST|vFCPST',
    header: 'Fundo de combate à pobreza retido por substituição tributária',
  },
  {
    name: 'pFCPSTRet|vFCPSTRet',
    header:
      'Fundo de combate à pobreza retido anteriormente por substituição tributária',
  },
  {
    name: 'vICMSDeson|motDesICMS',
    header: 'Valor do ICMS/Motiva da desoneração',
  },
  {
    name: 'pRedBCEfet|vBCEfet',
    header: 'Informações do ICMS Efetivo',
  },
  { name: 'pICMS|vICMS', header: 'Informações do ICMS' },
  {
    name: 'pICMSST|vICMSST',
    header: 'Informações do ICMS ST',
  },
  {
    name: 'vBCSTRet|pST|vICMSSubstituto|vICMSSTRet',
    header: 'Informações do ICMS ST cobrado anteriormente',
  },
  {
    name: 'pCredSN|vCredICMSSN',
    header: 'Informações de crédito do ICMS',
  },
  {
    name: 'vBC|pIPI',
    header: 'Cálculo de IPI por alíquota',
  },
  {
    name: 'vBC|pPIS',
    header: 'Cálculo de PIS por alíquota',
  },
  {
    name: 'vBC|pCOFINS',
    header: 'Cálculo de COFINS por alíquota',
  },
  {
    name: 'qUnid|vUnid',
    header: 'Cálculo de IPI por valor de unidade',
  },
  {
    name: 'qBCProd|vAliqProd',
    header: 'Cálculo de por valor de unidade',
  },
  { name: 'IPITrib', header: 'IPI tributado' },
  { name: 'IPINT', header: 'IPI não tributado' },
  { name: 'IPITrib|IPINT', header: 'Tipo de IPI' },
  { name: 'cAgreg', header: 'Código de agregação' },
  { name: 'det', header: 'Produtos ou serviços' },
  {
    name: 'rastro',
    header: 'Detalhamento de produto sujeito a rastreabilidade',
  },
]
