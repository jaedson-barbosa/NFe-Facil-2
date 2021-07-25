const simpleType = [
  {
    "name": "Torig",
    "annotation": {
      "label": "Tipo Origem da mercadoria CST ICMS  origem da mercadoria",
      "itens": [
        "Nacional exceto as indicadas nos códigos 3, 4, 5 e 8",
        "Estrangeira - Importação direta",
        "Estrangeira - Adquirida no mercado interno",
        "Nacional, conteudo superior 40% e inferior ou igual a 70%",
        "Nacional, processos produtivos básicos",
        "Nacional, conteudo inferior 40%",
        "Estrangeira - Importação direta, com similar nacional, lista CAMEX",
        "Estrangeira - mercado interno, sem simular,lista CAMEX",
        "Nacional, Conteúdo de Importação superior a 70%"
      ]
    },
    "restriction": {
      "enumeration": ["0", "1", "2", "3", "4", "5", "6", "7", "8"]
    }
  },
  {
    "name": "TCodUfIBGE",
    "annotation": { "label": "Tipo Código da UF da tabela do IBGE" },
    "restriction": {
      "enumeration": [
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "31",
        "32",
        "33",
        "35",
        "41",
        "42",
        "43",
        "50",
        "51",
        "52",
        "53"
      ]
    }
  },
  {
    "name": "TCodMunIBGE",
    "annotation": { "label": "Tipo Código do Município da tabela do IBGE" },
    "restriction": { "pattern": "[0-9]{7}" }
  },
  {
    "name": "TChNFe",
    "annotation": { "label": "Tipo Chave da Nota Fiscal Eletrônica" },
    "restriction": { "maxLength": "44", "pattern": "[0-9]{44}" }
  },
  {
    "name": "TCnpj",
    "annotation": { "label": "Tipo Número do CNPJ" },
    "restriction": { "maxLength": "14", "pattern": "[0-9]{14}" }
  },
  {
    "name": "TCnpjOpc",
    "annotation": { "label": "Tipo Número do CNPJ Opcional" },
    "restriction": { "maxLength": "14", "pattern": "[0-9]{0}|[0-9]{14}" }
  },
  {
    "name": "TCpf",
    "annotation": { "label": "Tipo Número do CPF" },
    "restriction": { "maxLength": "11", "pattern": "[0-9]{11}" }
  },
  {
    "name": "TDec_0302a04",
    "annotation": {
      "label": "Tipo Decimal com até 3 dígitos inteiros, podendo ter de 2 até 4 decimais"
    },
    "restriction": {
      "decimal": 4,
      "pattern": "0|0\\.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(\\.[0-9]{2,4})?"
    }
  },
  {
    "name": "TDec_0302a04Opc",
    "annotation": {
      "label": "Tipo Decimal com até 3 dígitos inteiros e 2 até 4 decimais. Utilizados em TAGs opcionais, não aceita valor zero."
    },
    "restriction": {
      "decimal": 4,
      "pattern": "0\\.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(\\.[0-9]{2,4})?"
    }
  },
  {
    "name": "TDec_0302a04Max100",
    "annotation": {
      "label": "Tipo Decimal com 3 inteiros (no máximo 100), com até 4 decimais"
    },
    "restriction": {
      "decimal": 4,
      "pattern": "0(\\.[0-9]{2,4})?|[1-9]{1}[0-9]{0,1}(\\.[0-9]{2,4})?|100(\\.0{2,4})?"
    }
  },
  {
    "name": "TDec_1104",
    "annotation": {
      "label": "Tipo Decimal com 11 inteiros, podendo ter 4 decimais"
    },
    "restriction": {
      "decimal": 4,
      "pattern": "0|0\\.[0-9]{4}|[1-9]{1}[0-9]{0,10}(\\.[0-9]{4})?"
    }
  },
  {
    "name": "TDec_1104v",
    "annotation": {
      "label": "Tipo Decimal com 11 inteiros, podendo ter de 1 até 4 decimais"
    },
    "restriction": {
      "decimal": 4,
      "pattern": "0|0\\.[0-9]{1,4}|[1-9]{1}[0-9]{0,10}|[1-9]{1}[0-9]{0,10}(\\.[0-9]{1,4})?"
    }
  },
  {
    "name": "TDec_1110v",
    "annotation": {
      "label": "Tipo Decimal com 11 inteiros, podendo ter de 1 até 10 decimais"
    },
    "restriction": {
      "decimal": 10,
      "pattern": "0|0\\.[0-9]{1,10}|[1-9]{1}[0-9]{0,10}|[1-9]{1}[0-9]{0,10}(\\.[0-9]{1,10})?"
    }
  },
  {
    "name": "TDec_1203",
    "annotation": {
      "label": "Tipo Decimal com 12 inteiros, podendo ter  3 decimais"
    },
    "restriction": {
      "decimal": 3,
      "pattern": "0|0\\.[0-9]{3}|[1-9]{1}[0-9]{0,11}(\\.[0-9]{3})?"
    }
  },
  {
    "name": "TDec_1204",
    "annotation": { "label": "Tipo Decimal com 12 inteiros e 4 decimais" },
    "restriction": {
      "decimal": 4,
      "pattern": "0|0\\.[0-9]{1,4}|[1-9]{1}[0-9]{0,11}|[1-9]{1}[0-9]{0,11}(\\.[0-9]{4})?"
    }
  },
  {
    "name": "TDec_1204v",
    "annotation": {
      "label": "Tipo Decimal com 12 inteiros de 1 até 4 decimais"
    },
    "restriction": {
      "decimal": 4,
      "pattern": "0|0\\.[0-9]{1,4}|[1-9]{1}[0-9]{0,11}|[1-9]{1}[0-9]{0,11}(\\.[0-9]{1,4})?"
    }
  },
  {
    "name": "TDec_1302",
    "annotation": {
      "label": "Tipo Decimal com 15 dígitos, sendo 13 de corpo e 2 decimais"
    },
    "restriction": {
      "decimal": 2,
      "pattern": "0|0\\.[0-9]{2}|[1-9]{1}[0-9]{0,12}(\\.[0-9]{2})?"
    }
  },
  {
    "name": "TDec_1302Opc",
    "annotation": {
      "label": "Tipo Decimal com 15 dígitos, sendo 13 de corpo e 2 decimais, utilizado em tags opcionais"
    },
    "restriction": {
      "decimal": 2,
      "pattern": "0\\.[0-9]{1}[1-9]{1}|0\\.[1-9]{1}[0-9]{1}|[1-9]{1}[0-9]{0,12}(\\.[0-9]{2})?"
    }
  },
  {
    "name": "TIeDest",
    "annotation": {
      "label": "Tipo Inscrição Estadual do Destinatário // alterado para aceitar vazio ou ISENTO - maio/2010 v2.0"
    },
    "restriction": { "maxLength": "14", "pattern": "ISENTO|[0-9]{2,14}" }
  },
  {
    "name": "TIe",
    "annotation": {
      "label": "Tipo Inscrição Estadual do Emitente // alterado EM 24/10/08 para aceitar ISENTO"
    },
    "restriction": { "maxLength": "14", "pattern": "[0-9]{2,14}|ISENTO" }
  },
  {
    "name": "TNF",
    "annotation": { "label": "Tipo Número do Documento Fiscal" },
    "restriction": { "pattern": "[1-9]{1}[0-9]{0,8}" }
  },
  {
    "name": "TSerie",
    "annotation": { "label": "Tipo Série do Documento Fiscal" },
    "restriction": { "pattern": "0|[1-9]{1}[0-9]{0,2}" }
  },
  {
    "name": "TUf",
    "annotation": { "label": "Tipo Sigla da UF" },
    "restriction": {
      "enumeration": [
        "AC",
        "AL",
        "AM",
        "AP",
        "BA",
        "CE",
        "DF",
        "ES",
        "GO",
        "MA",
        "MG",
        "MS",
        "MT",
        "PA",
        "PB",
        "PE",
        "PI",
        "PR",
        "RJ",
        "RN",
        "RO",
        "RR",
        "RS",
        "SC",
        "SE",
        "SP",
        "TO",
        "EX"
      ]
    }
  },
  {
    "name": "TUfEmi",
    "annotation": {
      "label": "Tipo Sigla da UF de emissor // acrescentado em 24/10/08"
    },
    "restriction": {
      "enumeration": [
        "AC",
        "AL",
        "AM",
        "AP",
        "BA",
        "CE",
        "DF",
        "ES",
        "GO",
        "MA",
        "MG",
        "MS",
        "MT",
        "PA",
        "PB",
        "PE",
        "PI",
        "PR",
        "RJ",
        "RN",
        "RO",
        "RR",
        "RS",
        "SC",
        "SE",
        "SP",
        "TO"
      ]
    }
  },
  {
    "name": "TData",
    "annotation": { "label": "Tipo data AAAA-MM-DD" },
    "restriction": {
      "pattern": "(((20(([02468][048])|([13579][26]))-02-29))|(20[0-9][0-9])-((((0[1-9])|(1[0-2]))-((0[1-9])|(1\\d)|(2[0-8])))|((((0[13578])|(1[02]))-31)|(((0[1,3-9])|(1[0-2]))-(29|30)))))"
    }
  },
  {
    "name": "TDateTimeUTC",
    "annotation": {
      "label": "Data e Hora, formato UTC (AAAA-MM-DDThh:mm:ssTZD, onde TZD = +hh:mm ou -hh:mm)"
    },
    "restriction": {
      "pattern": "(((20(([02468][048])|([13579][26]))-02-29))|(20[0-9][0-9])-((((0[1-9])|(1[0-2]))-((0[1-9])|(1\\d)|(2[0-8])))|((((0[13578])|(1[02]))-31)|(((0[1,3-9])|(1[0-2]))-(29|30)))))T(20|21|22|23|[0-1]\\d):[0-5]\\d:[0-5]\\d([\\-,\\+](0[0-9]|10|11):00|([\\+](12):00))"
    }
  }
]

import clipboardy from 'clipboardy'

const json = '[' + clipboardy.readSync() + ']'
const itens = JSON.parse(json)
const res: string[] = []
for (let el of itens) {
  if (el.type) {
    const simple = simpleType.find(v => v.name == el.type)
    if (simple) {
      const itens = simple.annotation.itens
      if (itens) el.annotation.itens = itens
      el.restriction = simple.restriction
    }
  }
  const enumeration = el.restriction.enumeration as string[]
  const els: string[] = []
  els.push(`bind:val={r["${el.name}"]}`)
  if (el.optional) els.push('opt')
  els.push(`lab="${el.annotation.label}"`)
  const aux = el.annotation.aux
  if (aux) els.push(`aux="${aux}"`)
  if (enumeration) {
    if (typeof enumeration == 'string') {
      res.push(`<Select ${els.join(' ')} />`)
      continue
    }
    const labels = el.annotation.itens as string[]
    els.push(`els={[${enumeration.map((v, i) => `["${v}","${labels ? labels[i] : v}"]`).join(',')}]}`)
    res.push(`<Select ${els.join(' ')} />`)
  } else {
    const pat = el.restriction.pattern
    if (pat) els.push(`pat={"${pat}"}`)
    const min = el.restriction.minLength
    if (min) els.push(`min={${min}}`)
    const max = el.restriction.maxLength
    if (max) els.push(`max={${max}}`)
    if (el.type == 'TCpf') els.push('mask="cpf"')
    if (el.type == 'TCnpj') els.push('mask="cnpj"')
    if (el.name == 'CEP') els.push('mask="zipcode"')
    res.push(`<InputT ${els.join(' ')} />`)
  }
}
const data = res.join(' ')
clipboardy.writeSync(data);
console.log('Convertido')
