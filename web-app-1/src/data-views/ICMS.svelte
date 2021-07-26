<!-- 
{
  "name": "orig",
  "annotation": {
    "label": "Origem da mercadoria",
    "itens": [
      "Nacional",
      "Estrangeira - Importação direta",
      "Estrangeira - Adquirida no mercado interno"
    ]
  },
  "restriction": { "enumeration": ["0", "1", "2"] }
},
{
  "name": "CST",
  "annotation": { "label": "Código de situação tributária" },
  "restriction": { "enumeration": "90" }
},
{
  "name": "modBC",
  "annotation": {
    "label": "Modalidade de determinação da BC do ICMS",
    "itens": [
      "Margem Valor Agregado (%)",
      "Pauta (valor)",
      "Preço Tabelado Máximo (valor)",
      "Valor da Operação"
    ]
  },
  "restriction": { "enumeration": ["0", "1", "2", "3"] }
},
{
  "name": "vBC",
  "type": "TDec_1302",
  "annotation": { "label": "Valor da BC do ICMS" }
},
{
  "name": "pRedBC",
  "type": "TDec_0302a04Opc",
  "optional": true,
  "annotation": { "label": "Percentual de redução da BC" }
},
{
  "name": "pICMS",
  "type": "TDec_0302a04",
  "annotation": { "label": "Alíquota do ICMS" }
},
{
  "name": "vICMS",
  "type": "TDec_1302",
  "annotation": { "label": "Valor do ICMS" }
},
{
  "name": "vBCFCP",
  "type": "TDec_1302",
  "annotation": { "label": "Base de cálculo" }
},
{
  "name": "pFCP",
  "type": "TDec_0302a04Opc",
  "annotation": { "label": "Percentual" }
},
{
  "name": "vFCP",
  "type": "TDec_1302",
  "annotation": { "label": "Valor" }
},
{
  "name": "modBCST",
  "annotation": {
    "label": "Modalidade de determinação da BC do ICMS ST",
    "itens": [
      "Preço tabelado ou máximo sugerido",
      "Lista Negativa (valor)",
      "Lista Positiva (valor)",
      "Lista Neutra (valor)",
      "Margem Valor Agregado (%)",
      "Pauta (valor)",
      "Valor da Operação"
    ]
  },
  "restriction": {
    "enumeration": ["0", "1", "2", "3", "4", "5", "6"]
  }
},
{
  "name": "pMVAST",
  "type": "TDec_0302a04Opc",
  "optional": true,
  "annotation": {
    "label": "Percentual da Margem de Valor Adicionado ICMS ST"
  }
},
{
  "name": "pRedBCST",
  "type": "TDec_0302a04Opc",
  "optional": true,
  "annotation": {
    "label": "Percentual de redução da BC ICMS ST"
  }
},
{
  "name": "vBCST",
  "type": "TDec_1302",
  "annotation": { "label": "Valor da BC do ICMS ST" }
},
{
  "name": "pICMSST",
  "type": "TDec_0302a04",
  "annotation": { "label": "Alíquota do ICMS ST" }
},
{
  "name": "vICMSST",
  "type": "TDec_1302",
  "annotation": { "label": "Valor do ICMS ST" }
},
{
  "annotation": { "label": "FCP retido por ST" },
  "optional": true,
  "element": [
    {
      "name": "vBCFCPST",
      "type": "TDec_1302",
      "annotation": { "label": "Base de cálculo" }
    },
    {
      "name": "pFCPST",
      "type": "TDec_0302a04Opc",
      "annotation": { "label": "Percentual" }
    },
    {
      "name": "vFCPST",
      "type": "TDec_1302",
      "annotation": { "label": "Valor" }
    }
  ]
},
{
  "optional": true,
  "annotation": { "label": "Desoneração" },
  "element": [
    {
      "name": "vICMSDeson",
      "type": "TDec_1302",
      "annotation": { "label": "Valor do ICMS desonerado" }
    },
    {
      "name": "motDesICMS",
      "annotation": {
        "label": "Motivo da desoneração",
        "itens": [
          "Uso na agropecuária",
          "Outros",
          "Fomento agropecuário"
        ]
      },
      "restriction": { "enumeration": ["3", "9", "12"] }
    }
  ]
}
 -->