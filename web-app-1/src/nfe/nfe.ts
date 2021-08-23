export default {
  ide: {
    name: 'ide',
    annotation: { label: 'Identificação da NF-e' },
    element: [
      {
        name: 'cUF',
        readonly: true,
        type: 'TCodUfIBGE',
        annotation: {
          label: 'Código da UF do emitente do Documento Fiscal',
        },
      },
      {
        name: 'cNF',
        readonly: true,
        annotation: {
          label: 'Código numérico que compõe a Chave de Acesso',
        },
        restriction: { pattern: '[0-9]{8}' },
      },
      {
        name: 'natOp',
        annotation: { label: 'Natureza da Operação' },
        restriction: { minLength: '1', maxLength: '60' },
      },
      {
        name: 'mod',
        readonly: true,
        annotation: {
          label: 'Código do modelo do Documento Fiscal',
          itens: ['NF-e', 'NFC-e.'],
        },
        restriction: { enumeration: ['55', '65'] },
      },
      {
        name: 'serie',
        readonly: true,
        type: 'TSerie',
        annotation: { label: 'Série do Documento Fiscal' },
      },
      {
        name: 'nNF',
        type: 'TNF',
        annotation: {
          label: 'Número do Documento Fiscal',
          aux: 'Determinado pelo servidor durante a transmissão.',
        },
      },
      {
        name: 'dhEmi',
        readonly: true,
        type: 'TDateTimeUTC',
        annotation: { label: 'Data e Hora de emissão do Documento Fiscal' },
      },
      {
        name: 'dhSaiEnt',
        type: 'TDateTimeUTC',
        optional: true,
        annotation: { label: 'Data e Hora de saída/entrada da mercadoria' },
      },
      {
        name: 'tpNF',
        annotation: {
          label: 'Tipo do Documento Fiscal',
          itens: ['Saída', 'Entrada'],
        },
        restriction: { enumeration: ['1', '0'] },
      },
      {
        name: 'idDest',
        annotation: {
          label: 'Identificador de Local de destino da operação',
          itens: ['Interna', 'Interestadual', 'Exterior'],
        },
        restriction: { enumeration: ['1', '2', '3'] },
      },
      {
        name: 'cMunFG',
        type: 'TCodMunIBGE',
        annotation: { label: 'Código do município de ocorrência' },
      },
      {
        name: 'tpImp',
        readonly: true,
        annotation: {
          label: 'Formato de impressão do DANFE',
          itens: [
            'Sem DANFE',
            'DANFe Retrato',
            'DANFe Paisagem',
            'DANFe Simplificado',
            'DANFe NFC-e',
            'DANFe NFC-e em mensagem eletrônica',
          ],
        },
        restriction: { enumeration: ['0', '1', '2', '3', '4', '5'] },
      },
      {
        name: 'tpEmis',
        readonly: true,
        annotation: {
          label: 'Forma de emissão da NF-e',
          itens: [
            'Normal',
            'Contingência FS',
            'Contingência SCAN',
            'Contingência DPEC',
            'Contingência FSDA',
            'Contingência SVC - AN',
            'Contingência SVC - RS',
            'Contingência off-line NFC-e',
          ],
        },
        restriction: {
          enumeration: ['1', '2', '3', '4', '5', '6', '7', '9'],
        },
      },
      {
        name: 'cDV',
        readonly: true,
        annotation: { label: 'Digito Verificador da Chave de Acesso' },
        restriction: { pattern: '[0-9]{1}' },
      },
      {
        name: 'tpAmb',
        annotation: {
          label: 'Identificação do Ambiente',
          itens: ['Produção', 'Homologação'],
        },
        restriction: { enumeration: ['1', '2'] },
      },
      {
        name: 'finNFe',
        annotation: {
          label: 'Finalidade da emissão',
          itens: ['Normal', 'Complementar', 'Ajuste', 'Devolução/Retorno'],
        },
        restriction: { enumeration: ['1', '2', '3', '4'] },
      },
      {
        name: 'indFinal',
        annotation: {
          label: 'Operação com consumidor final',
          itens: ['Sim', 'Não'],
        },
        restriction: { enumeration: ['1', '0'] },
      },
      {
        name: 'indPres',
        annotation: {
          label: 'Presença do comprador',
          itens: [
            'Não se aplica (complementar ou ajuste)',
            'Operação presencial',
            'Não presencial, internet',
            'Não presencial, teleatendimento',
            'NFC-e entrega em domicílio',
            'Operação presencial, fora do estabelecimento',
            'Não presencial, outros',
          ],
        },
        restriction: { enumeration: ['0', '1', '2', '3', '4', '5', '9'] },
      },
      {
        name: 'indIntermed',
        optional: true,
        annotation: {
          label: 'Indicador de intermediador ou marketplace',
          aux: 'Só deve ser informado em operações não presenciais.',
          itens: [
            'Operação em site ou plataforma própria',
            'Operação em site ou plataforma de terceiros',
          ],
        },
        restriction: { enumeration: ['0', '1'] },
      },
      {
        name: 'procEmi',
        readonly: true,
        annotation: {
          label: 'Processo de emissão',
          itens: [
            'Com aplicativo do contribuinte',
            'Avulsa pelo Fisco',
            'Avulsa através do site do Fisco',
            'Com aplicativo fornecido pelo Fisco',
          ],
        },
        restriction: { enumeration: ['0', '1', '2', '3'] },
      },
      {
        name: 'verProc',
        readonly: true,
        annotation: { label: 'Versão do aplicativo utilizado na emissão' },
        restriction: { minLength: '1', maxLength: '20' },
      },
      {
        name: 'NFref',
        optional: true,
        choice: true,
        maxOccurs: '500',
        annotation: { label: 'Infromações da NF referenciada' },
        element: [
          {
            name: 'refNFe',
            type: 'TChNFe',
            annotation: { label: 'Chave de acesso da NF-e' },
          },
          {
            name: 'refNF',
            annotation: { label: 'NF modelo 1/1A ou NF modelo 2' },
            element: [
              {
                name: 'cUF',
                type: 'TCodUfIBGE',
                annotation: {
                  label: 'Código da UF do emitente do Documento Fiscal',
                },
              },
              {
                name: 'AAMM',
                annotation: { label: 'Ano e mês da emissão_Formato: AAMM' },
                restriction: {
                  pattern: '[0-9]{2}[0]{1}[1-9]{1}|[0-9]{2}[1]{1}[0-2]{1}',
                },
              },
              {
                name: 'CNPJ',
                type: 'TCnpj',
                annotation: {
                  label: 'CNPJ do emitente do documento fiscal referenciado',
                },
              },
              {
                name: 'mod',
                annotation: {
                  label: 'Código do modelo do Documento Fiscal',
                  itens: ['NF modelo 1/1A', 'NF modelo 02'],
                },
                restriction: { enumeration: ['01', '02'] },
              },
              {
                name: 'serie',
                type: 'TSerie',
                annotation: {
                  label: 'Série do Documento Fiscal, 0 se inexistente',
                },
              },
              {
                name: 'nNF',
                type: 'TNF',
                annotation: { label: 'Número do Documento Fiscal' },
              },
            ],
          },
          {
            name: 'refNFP',
            annotation: { label: 'NF de produtor rural' },
            element: [
              {
                name: 'cUF',
                type: 'TCodUfIBGE',
                annotation: {
                  label: 'Código da UF do emitente do Documento Fiscal',
                },
              },
              {
                name: 'AAMM',
                annotation: { label: 'Ano e mês de emissão_Formato: AAMM' },
                restriction: {
                  pattern: '[0-9]{2}[0]{1}[1-9]{1}|[0-9]{2}[1]{1}[0-2]{1}',
                },
              },
              {
                name: 'IE',
                type: 'TIeDest',
                annotation: { label: 'IE do emitente da NF' },
              },
              {
                name: 'mod',
                annotation: {
                  label: 'Código do modelo do Documento Fiscal',
                  itens: ['NF de produtor', 'NF Avulsa'],
                },
                restriction: { enumeration: ['04', '01'] },
              },
              {
                name: 'serie',
                type: 'TSerie',
                annotation: {
                  label: 'Série do Documento Fiscal, 0 se inexistente',
                },
              },
              {
                name: 'nNF',
                type: 'TNF',
                annotation: { label: 'Número do Documento Fiscal' },
              },
              {
                choice: true,
                annotation: { label: 'Documento usado' },
                element: [
                  {
                    name: 'CNPJ',
                    type: 'TCnpj',
                    annotation: { label: 'CNPJ do emitente da NF' },
                  },
                  {
                    name: 'CPF',
                    type: 'TCpf',
                    annotation: { label: 'CPF do emitente da NF' },
                  },
                ],
              },
            ],
          },
          {
            name: 'refCTe',
            type: 'TChNFe',
            annotation: { label: 'Chave de acesso do CT-e' },
          },
          {
            name: 'refECF',
            annotation: { label: 'Cupom Fiscal' },
            element: [
              {
                name: 'mod',
                annotation: {
                  label: 'Modelo do Documento Fiscal',
                  itens: [
                    'Emitido por máquina registradora (não ECF)',
                    'Cupom Fiscal PDV',
                    'Cupom Fiscal emitido por ECF',
                  ],
                },
                restriction: { enumeration: ['2B', '2C', '2D'] },
              },
              {
                name: 'nECF',
                annotation: { label: 'Número de ordem sequencial do ECF' },
                restriction: { pattern: '[0-9]{1,3}' },
              },
              {
                name: 'nCOO',
                annotation: {
                  label: 'Número do COO (Contador de Ordem de Operação)',
                },
                restriction: { pattern: '[0-9]{1,6}' },
              },
            ],
          },
        ],
      },
    ],
  },
  emit: {
    name: 'emit',
    annotation: { label: 'Identificação do emitente' },
    element: [
      { name: 'CNPJ', type: 'TCnpj', annotation: { label: 'CNPJ' } },
      {
        name: 'xNome',
        annotation: { label: 'Razão social ou nome do emitente' },
        restriction: { maxLength: '60', minLength: '2' },
      },
      {
        name: 'xFant',
        optional: true,
        annotation: { label: 'Nome fantasia' },
        restriction: { maxLength: '60', minLength: '1' },
      },
      {
        name: 'enderEmit',
        annotation: { label: 'Endereço' },
        element: [
          {
            name: 'xLgr',
            annotation: { label: 'Logradouro' },
            restriction: { maxLength: '60', minLength: '2' },
          },
          {
            name: 'nro',
            annotation: { label: 'Número' },
            restriction: { maxLength: '60', minLength: '1' },
          },
          {
            name: 'xCpl',
            optional: true,
            annotation: { label: 'Complemento' },
            restriction: { maxLength: '60', minLength: '1' },
          },
          {
            name: 'xBairro',
            annotation: { label: 'Bairro' },
            restriction: { maxLength: '60', minLength: '2' },
          },
          {
            name: 'cMun',
            type: 'TCodMunIBGE',
            annotation: { label: 'Código do município' },
          },
          {
            name: 'xMun',
            annotation: { label: 'Nome do município' },
            restriction: { maxLength: '60', minLength: '2' },
          },
          {
            name: 'UF',
            type: 'TUfEmi',
            annotation: { label: 'Sigla da UF' },
          },
          {
            name: 'CEP',
            annotation: { label: 'CEP' },
            restriction: { pattern: '[0-9]{8}' },
          },
          {
            name: 'cPais',
            optional: true,
            annotation: { label: 'Código do país' },
            restriction: { enumeration: '1058' },
          },
          {
            name: 'xPais',
            optional: true,
            annotation: { label: 'Nome do país' },
            restriction: { enumeration: 'BRASIL' },
          },
          {
            name: 'fone',
            optional: true,
            annotation: {
              label: 'Telefone',
              aux: 'Preencher com Código DDD + número do telefone',
            },
            restriction: { pattern: '[0-9]{6,14}' },
          },
        ],
      },
      {
        name: 'IE',
        type: 'TIe',
        annotation: { label: 'Inscrição Estadual' },
      },
      {
        name: 'IEST',
        optional: true,
        annotation: {
          label: 'Inscricao Estadual do Substituto Tributário',
        },
        restriction: { maxLength: '14', pattern: '[0-9]{2,14}' },
      },
      {
        optional: true,
        annotation: { label: 'Informações de interesse da Prefeitura' },
        element: [
          {
            name: 'IM',
            annotation: { label: 'Inscrição Municipal' },
            restriction: { minLength: '1', maxLength: '15' },
          },
          {
            name: 'CNAE',
            optional: true,
            annotation: { label: 'CNAE Fiscal' },
            restriction: { pattern: '[0-9]{7}' },
          },
        ],
      },
      {
        name: 'CRT',
        annotation: {
          label: 'Código de Regime Tributário',
          itens: [
            'Simples Nacional',
            'Simples Nacional, excesso de sublimite de receita bruta',
            'Regime Normal',
          ],
        },
        restriction: { enumeration: ['1', '2', '3'] },
      },
    ],
  },
  dest: {
    name: 'dest',
    annotation: { label: 'Identificação do Destinatário' },
    choice: true,
    element: [
      {
        annotation: { label: 'Pessoa jurídica' },
        element: [
          {
            name: 'CNPJ',
            type: 'TCnpj',
            annotation: { label: 'CNPJ' },
          },
          {
            name: 'xNome',
            annotation: { label: 'Razão Social ou nome do destinatário' },
            restriction: { maxLength: '60', minLength: '2' },
          },
          {
            name: 'enderDest',
            annotation: { label: 'Endereço' },
            element: [
              {
                name: 'xLgr',
                annotation: { label: 'Logradouro' },
                restriction: { maxLength: '60', minLength: '2' },
              },
              {
                name: 'nro',
                annotation: { label: 'Número' },
                restriction: { maxLength: '60', minLength: '1' },
              },
              {
                name: 'xCpl',
                optional: true,
                annotation: { label: 'Complemento' },
                restriction: { maxLength: '60', minLength: '1' },
              },
              {
                name: 'xBairro',
                annotation: { label: 'Bairro' },
                restriction: { maxLength: '60', minLength: '2' },
              },
              {
                name: 'cMun',
                type: 'TCodMunIBGE',
                annotation: { label: 'Código do município' },
              },
              {
                name: 'xMun',
                annotation: { label: 'Nome do município' },
                restriction: { maxLength: '60', minLength: '2' },
              },
              {
                name: 'UF',
                type: 'TUfEmi',
                annotation: { label: 'Sigla da UF' },
              },
              {
                name: 'CEP',
                annotation: { label: 'CEP' },
                restriction: { pattern: '[0-9]{8}' },
              },
              {
                name: 'cPais',
                optional: true,
                annotation: { label: 'Código do país' },
                restriction: { enumeration: '1058' },
              },
              {
                name: 'xPais',
                optional: true,
                annotation: { label: 'Nome do país' },
                restriction: { enumeration: 'BRASIL' },
              },
              {
                name: 'fone',
                optional: true,
                annotation: {
                  label: 'Telefone',
                  aux: 'Preencher com Código DDD + número do telefone',
                },
                restriction: { pattern: '[0-9]{6,14}' },
              },
            ],
          },
          {
            name: 'indIEDest',
            annotation: {
              label: 'Indicador da IE do destinatário:',
            },
            restriction: { enumeration: ['1', '2', '9'] },
          },
          {
            name: 'IE',
            optional: true,
            annotation: { label: 'Inscrição Estadual' },
            restriction: {
              maxLength: '14',
              pattern: '[0-9]{2,14}',
            },
          },
          {
            name: 'ISUF',
            optional: true,
            annotation: { label: 'Inscrição na SUFRAMA' },
            restriction: { pattern: '[0-9]{8,9}' },
          },
          {
            name: 'IM',
            optional: true,
            annotation: {
              label: 'Inscrição Municipal do tomador do serviço',
            },
            restriction: { minLength: '1', maxLength: '15' },
          },
          {
            name: 'email',
            optional: true,
            annotation: { label: 'E-mail do destinatário' },
            restriction: { minLength: '1', maxLength: '60' },
          },
        ],
      },
      {
        annotation: { label: 'Pessoa física - brasileiro' },
        element: [
          { name: 'CPF', type: 'TCpf', annotation: { label: 'CPF' } },
          {
            name: 'xNome',
            annotation: { label: 'Nome do destinatário' },
            restriction: { maxLength: '60', minLength: '2' },
          },
          {
            name: 'enderDest',
            annotation: { label: 'Endereço' },
            element: [
              {
                name: 'xLgr',
                annotation: { label: 'Logradouro' },
                restriction: { maxLength: '60', minLength: '2' },
              },
              {
                name: 'nro',
                annotation: { label: 'Número' },
                restriction: { maxLength: '60', minLength: '1' },
              },
              {
                name: 'xCpl',
                optional: true,
                annotation: { label: 'Complemento' },
                restriction: { maxLength: '60', minLength: '1' },
              },
              {
                name: 'xBairro',
                annotation: { label: 'Bairro' },
                restriction: { maxLength: '60', minLength: '2' },
              },
              {
                name: 'cMun',
                type: 'TCodMunIBGE',
                annotation: { label: 'Código do município' },
              },
              {
                name: 'xMun',
                annotation: { label: 'Nome do município' },
                restriction: { maxLength: '60', minLength: '2' },
              },
              {
                name: 'UF',
                type: 'TUfEmi',
                annotation: { label: 'Sigla da UF' },
              },
              {
                name: 'CEP',
                annotation: { label: 'CEP' },
                restriction: { pattern: '[0-9]{8}' },
              },
              {
                name: 'cPais',
                optional: true,
                annotation: { label: 'Código do país' },
                restriction: { enumeration: '1058' },
              },
              {
                name: 'xPais',
                optional: true,
                annotation: { label: 'Nome do país' },
                restriction: { enumeration: 'BRASIL' },
              },
              {
                name: 'fone',
                optional: true,
                annotation: {
                  label: 'Telefone',
                  aux: 'Preencher com Código DDD + número do telefone',
                },
                restriction: { pattern: '[0-9]{6,14}' },
              },
            ],
          },
          {
            name: 'indIEDest',
            annotation: { label: 'Indicador da IE do destinatário' },
            restriction: { enumeration: '9' },
          },
          {
            name: 'email',
            optional: true,
            annotation: { label: 'E-mail do destinatário' },
            restriction: { minLength: '1', maxLength: '60' },
          },
        ],
      },
      {
        annotation: { label: 'Pessoa física - estrangeiro' },
        element: [
          {
            name: 'idEstrangeiro',
            annotation: { label: 'Identificação do destinatário' },
            restriction: { pattern: '([!-ÿ]{0}|[!-ÿ]{5,20})?' },
          },
          {
            name: 'xNome',
            annotation: { label: 'Nome do destinatário' },
            restriction: { maxLength: '60', minLength: '2' },
          },
          {
            name: 'enderDest',
            annotation: { label: 'Endereço' },
            element: [
              {
                name: 'xLgr',
                annotation: { label: 'Logradouro' },
                restriction: { maxLength: '60', minLength: '2' },
              },
              {
                name: 'nro',
                annotation: { label: 'Número' },
                restriction: { maxLength: '60', minLength: '1' },
              },
              {
                name: 'xCpl',
                optional: true,
                annotation: { label: 'Complemento' },
                restriction: { maxLength: '60', minLength: '1' },
              },
              {
                name: 'xBairro',
                annotation: { label: 'Bairro' },
                restriction: { maxLength: '60', minLength: '2' },
              },
              {
                name: 'cMun',
                annotation: { label: 'Código do município' },
                restriction: { enumeration: '9999999' },
              },
              {
                name: 'xMun',
                annotation: { label: 'Nome do município' },
                restriction: { enumeration: 'EXTERIOR' },
              },
              {
                name: 'UF',
                annotation: { label: 'Sigla da UF' },
                restriction: { enumeration: 'EX' },
              },
              {
                name: 'CEP',
                optional: true,
                annotation: { label: 'CEP' },
                restriction: { pattern: '[0-9]{8}' },
              },
              {
                name: 'cPais',
                optional: true,
                annotation: { label: 'Código de Pais' },
                restriction: { pattern: '[0-9]{1,4}' },
              },
              {
                name: 'xPais',
                optional: true,
                annotation: { label: 'Nome do país' },
                restriction: { maxLength: '60', minLength: '2' },
              },
              {
                name: 'fone',
                optional: true,
                annotation: {
                  label: 'Telefone',
                  aux: 'Código do país + código da localidade + número',
                },
                restriction: { pattern: '[0-9]{6,14}' },
              },
            ],
          },
          {
            name: 'indIEDest',
            annotation: { label: 'Indicador da IE do destinatário' },
            restriction: { enumeration: '9' },
          },
          {
            name: 'email',
            optional: true,
            annotation: { label: 'E-mail do destinatário' },
            restriction: { minLength: '1', maxLength: '60' },
          },
        ],
      },
    ],
  },
  retirada: {
    name: 'retirada',
    optional: true,
    annotation: {
      label: 'Local de retirada (diferente do endereço do remetente)',
    },
    element: [
      {
        choice: true,
        annotation: { label: 'Documento usado' },
        element: [
          {
            name: 'CNPJ',
            type: 'TCnpjOpc',
            annotation: { label: 'CNPJ' },
          },
          { name: 'CPF', type: 'TCpf', annotation: { label: 'CPF' } },
        ],
      },
      {
        name: 'xNome',
        optional: true,
        annotation: {
          label: 'Razão Social ou Nome do Expedidor/Recebedor',
        },
        restriction: { maxLength: '60', minLength: '2' },
      },
      {
        name: 'xLgr',
        annotation: { label: 'Logradouro' },
        restriction: { maxLength: '60', minLength: '2' },
      },
      {
        name: 'nro',
        annotation: { label: 'Número' },
        restriction: { maxLength: '60', minLength: '1' },
      },
      {
        name: 'xCpl',
        optional: true,
        annotation: { label: 'Complemento' },
        restriction: { maxLength: '60', minLength: '1' },
      },
      {
        name: 'xBairro',
        annotation: { label: 'Bairro' },
        restriction: { maxLength: '60', minLength: '2' },
      },
      {
        name: 'cMun',
        type: 'TCodMunIBGE',
        annotation: { label: 'Código do município' },
      },
      {
        name: 'xMun',
        annotation: { label: 'Nome do município' },
        restriction: { maxLength: '60', minLength: '2' },
      },
      { name: 'UF', type: 'TUf', annotation: { label: 'Sigla da UF' } },
      {
        name: 'CEP',
        optional: true,
        annotation: { label: 'CEP' },
        restriction: { pattern: '[0-9]{8}' },
      },
      {
        name: 'cPais',
        optional: true,
        annotation: { label: 'Código do país' },
        restriction: { enumeration: '1058' },
      },
      {
        name: 'xPais',
        optional: true,
        annotation: { label: 'Nome do país' },
        restriction: { enumeration: 'BRASIL' },
      },
      {
        name: 'fone',
        optional: true,
        annotation: { label: 'Telefone' },
        restriction: { pattern: '[0-9]{6,14}' },
      },
      {
        name: 'email',
        optional: true,
        annotation: { label: 'Informar o e-mail do expedidor/Recebedor' },
        restriction: { minLength: '1', maxLength: '60' },
      },
      {
        name: 'IE',
        type: 'TIe',
        optional: true,
        annotation: { label: 'Inscrição Estadual (v2.0)' },
      },
    ],
  },
  entrega: {
    name: 'entrega',
    optional: true,
    annotation: {
      label: 'Local de entrega (diferente do endereço do destinatário)',
    },
    element: [
      {
        choice: true,
        annotation: { label: 'Documento usado' },
        element: [
          {
            name: 'CNPJ',
            type: 'TCnpjOpc',
            annotation: { label: 'CNPJ' },
          },
          { name: 'CPF', type: 'TCpf', annotation: { label: 'CPF' } },
        ],
      },
      {
        name: 'xNome',
        optional: true,
        annotation: {
          label: 'Razão Social ou Nome do Expedidor/Recebedor',
        },
        restriction: { maxLength: '60', minLength: '2' },
      },
      {
        name: 'xLgr',
        annotation: { label: 'Logradouro' },
        restriction: { maxLength: '60', minLength: '2' },
      },
      {
        name: 'nro',
        annotation: { label: 'Número' },
        restriction: { maxLength: '60', minLength: '1' },
      },
      {
        name: 'xCpl',
        optional: true,
        annotation: { label: 'Complemento' },
        restriction: { maxLength: '60', minLength: '1' },
      },
      {
        name: 'xBairro',
        annotation: { label: 'Bairro' },
        restriction: { maxLength: '60', minLength: '2' },
      },
      {
        name: 'cMun',
        type: 'TCodMunIBGE',
        annotation: { label: 'Código do município' },
      },
      {
        name: 'xMun',
        annotation: { label: 'Nome do município' },
        restriction: { maxLength: '60', minLength: '2' },
      },
      { name: 'UF', type: 'TUf', annotation: { label: 'Sigla da UF' } },
      {
        name: 'CEP',
        optional: true,
        annotation: { label: 'CEP' },
        restriction: { pattern: '[0-9]{8}' },
      },
      {
        name: 'cPais',
        optional: true,
        annotation: { label: 'Código do país' },
        restriction: { enumeration: '1058' },
      },
      {
        name: 'xPais',
        optional: true,
        annotation: { label: 'Nome do país' },
        restriction: { enumeration: 'BRASIL' },
      },
      {
        name: 'fone',
        optional: true,
        annotation: { label: 'Telefone' },
        restriction: { pattern: '[0-9]{6,14}' },
      },
      {
        name: 'email',
        optional: true,
        annotation: { label: 'Informar o e-mail do expedidor/Recebedor' },
        restriction: { minLength: '1', maxLength: '60' },
      },
      {
        name: 'IE',
        type: 'TIe',
        optional: true,
        annotation: { label: 'Inscrição Estadual (v2.0)' },
      },
    ],
  },
  autXML: {
    name: 'autXML',
    optional: true,
    maxOccurs: '10',
    annotation: {
      label: 'Pessoas autorizadas para o download do XML da NF-e',
    },
    choice: true,
    element: [
      {
        name: 'CNPJ',
        type: 'TCnpj',
        annotation: { label: 'CNPJ Autorizado' },
      },
      {
        name: 'CPF',
        type: 'TCpf',
        annotation: { label: 'CPF Autorizado' },
      },
    ],
  },
  det: {
    name: 'det',
    maxOccurs: '990',
    annotation: { label: 'Produtos' },
    element: [
      {
        name: 'nItem',
        annotation: {
          label: 'Número do item na NF',
          aux: 'Valor gerenciado pelo emissor',
        },
        restriction: { enumeration: '0' },
      },
      {
        name: 'prod',
        annotation: { label: 'Dados dos produtos e serviços da NF-e' },
        element: [
          {
            name: 'cProd',
            annotation: {
              label: 'Código do produto ou serviço',
              aux: 'Preencher com CFOP caso se trate de itens não relacionados com mercadorias/produto e que o contribuinte não possua codificação própria (Formato: CFOP9999)',
            },
            restriction: { maxLength: '60', minLength: '1' },
          },
          {
            name: 'cEAN',
            annotation: {
              label: 'GTIN do produto, antigo código EAN ou código de barras',
            },
            restriction: {
              pattern: 'SEM GTIN|[0-9]{0}|[0-9]{8}|[0-9]{12,14}',
            },
          },
          {
            name: 'xProd',
            annotation: { label: 'Descrição do produto ou serviço' },
            restriction: { maxLength: '120', minLength: '1' },
          },
          {
            name: 'NCM',
            annotation: {
              label: 'Código NCM',
              aux: 'É permitida a informação do gênero (posição do capítulo do NCM) quando a operação não for de comércio exterior (importação/exportação) ou o produto não seja tributado pelo IPI. Em caso de item de serviço ou item que não tenham produto (Ex. transferência de crédito, crédito do ativo imobilizado, etc.), informar o código 00',
            },
            restriction: { pattern: '[0-9]{2}|[0-9]{8}' },
          },
          {
            name: 'NVE',
            optional: true,
            maxOccurs: '8',
            annotation: {
              label: 'Nomenclatura de Valor aduaneio e Estatístico',
            },
            restriction: { pattern: '[A-Z]{2}[0-9]{4}' },
          },
          {
            annotation: {
              label: 'Código Especificador da Substituição Tributária',
            },
            optional: true,
            element: [
              {
                name: 'CEST',
                annotation: {
                  label: 'CEST (Codigo especificador da Substuicao Tributaria)',
                  aux: 'Identifica a mercadoria sujeita aos regimes de substituicao tributária e de antecipação do recolhimento do imposto',
                },
                restriction: { pattern: '[0-9]{7}' },
              },
              {
                name: 'indEscala',
                annotation: {
                  label: 'Prozido em escala relevante',
                  itens: ['Sim', 'Não'],
                },
                optional: true,
                restriction: { enumeration: ['S', 'N'] },
              },
              {
                name: 'CNPJFab',
                type: 'TCnpj',
                optional: true,
                annotation: {
                  label:
                    'CNPJ do Fabricante da Mercadoria, obrigatório para produto em escala NÃO relevante.',
                },
              },
            ],
          },
          {
            name: 'cBenef',
            annotation: {
              label: 'Código de Benefício Fiscal na UF aplicado ao item',
            },
            optional: true,
            restriction: { pattern: '([!-ÿ]{8}|[!-ÿ]{10}|SEM CBENEF)?' },
          },
          {
            name: 'EXTIPI',
            optional: true,
            annotation: { label: 'Código EX TIPI' },
            restriction: { pattern: '[0-9]{2,3}' },
          },
          {
            name: 'CFOP',
            annotation: {
              label: 'CFOP (Código Fiscal de Operações e Prestações)',
            },
            restriction: { pattern: '[1,2,3,5,6,7]{1}[0-9]{3}' },
          },
          {
            name: 'uCom',
            annotation: { label: 'Unidade comercial' },
            restriction: { maxLength: '6', minLength: '1' },
          },
          {
            name: 'qCom',
            type: 'TDec_1104v',
            annotation: { label: 'Quantidade Comercial  do produto' },
          },
          {
            name: 'vUnCom',
            type: 'TDec_1110v',
            annotation: { label: 'Valor unitário de comercialização' },
          },
          {
            name: 'vProd',
            annotation: { label: 'Valor bruto do produto ou serviço' },
            restriction: {
              enumeration: 'return (+r.qCom * +r.vUnCom).toFixed(2)',
            },
          },
          {
            name: 'cEANTrib',
            annotation: {
              label:
                'GTIN da unidade tributável, antigo código EAN ou código de barras',
            },
            restriction: {
              pattern: 'SEM GTIN|[0-9]{0}|[0-9]{8}|[0-9]{12,14}',
            },
          },
          {
            name: 'uTrib',
            annotation: { label: 'Unidade Tributável' },
            restriction: { maxLength: '6', minLength: '1' },
          },
          {
            name: 'qTrib',
            type: 'TDec_1104v',
            annotation: { label: 'Quantidade Tributável' },
          },
          {
            name: 'vUnTrib',
            type: 'TDec_1110v',
            annotation: { label: 'Valor unitário de tributação' },
          },
          {
            name: 'vFrete',
            type: 'TDec_1302Opc',
            optional: true,
            annotation: { label: 'Valor Total do Frete' },
          },
          {
            name: 'vSeg',
            type: 'TDec_1302Opc',
            optional: true,
            annotation: { label: 'Valor Total do Seguro' },
          },
          {
            name: 'vDesc',
            type: 'TDec_1302Opc',
            optional: true,
            annotation: { label: 'Valor do Desconto' },
          },
          {
            name: 'vOutro',
            type: 'TDec_1302Opc',
            optional: true,
            annotation: { label: 'Outras despesas acessórias' },
          },
          {
            name: 'indTot',
            annotation: {
              label: 'O valor do item compõe o valor total da NF-e',
              itens: ['Sim', 'Não'],
            },
            restriction: { enumeration: ['1', '0'] },
          },
          {
            name: 'DI',
            optional: true,
            maxOccurs: '100',
            annotation: { label: 'Delcaração de Importação' },
            element: [
              {
                name: 'nDI',
                annotation: {
                  label: 'Numero do Documento de Importação (DI/DSI/DA/DRI-E)',
                },
                restriction: { minLength: '1', maxLength: '12' },
              },
              {
                name: 'dDI',
                type: 'TData',
                annotation: { label: 'Data de registro da DI/DSI/DA' },
              },
              {
                name: 'xLocDesemb',
                annotation: { label: 'Local do desembaraço aduaneiro' },
                restriction: { minLength: '1', maxLength: '60' },
              },
              {
                name: 'UFDesemb',
                type: 'TUfEmi',
                annotation: {
                  label: 'UF onde ocorreu o desembaraço aduaneiro',
                },
              },
              {
                name: 'dDesemb',
                type: 'TData',
                annotation: { label: 'Data do desembaraço aduaneiro' },
              },
              {
                name: 'tpViaTransp',
                annotation: {
                  label: 'Via de transporte internacional informada na DI',
                  itens: [
                    'Maritima',
                    'Fluvial',
                    'Lacustre',
                    'Aerea',
                    'Postal',
                    'Ferroviaria',
                    'Rodoviaria',
                    'Conduto',
                    'Meios Proprios',
                    'Entrada/Saida Ficta',
                  ],
                },
                restriction: {
                  enumeration: [
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    '10',
                  ],
                },
              },
              {
                name: 'vAFRMM',
                type: 'TDec_1302',
                optional: true,
                annotation: {
                  label:
                    'Valor Adicional ao frete para renovação de marinha mercante',
                },
              },
              {
                name: 'tpIntermedio',
                annotation: {
                  label: 'Forma de Importação quanto a intermediação',
                  itens: [
                    'Por conta propria',
                    'Por conta e ordem',
                    'Encomenda',
                  ],
                },
                restriction: { enumeration: ['1', '2', '3'] },
              },
              {
                name: 'CNPJ',
                type: 'TCnpj',
                optional: true,
                annotation: {
                  label: 'CNPJ do adquirente ou do encomendante',
                },
              },
              {
                name: 'UFTerceiro',
                type: 'TUfEmi',
                optional: true,
                annotation: {
                  label: 'Sigla da UF do adquirente ou do encomendante',
                },
              },
              {
                name: 'cExportador',
                annotation: {
                  label: 'Código do exportador',
                  aux: 'Usado nos sistemas internos de informação do emitente',
                },
                restriction: { minLength: '1', maxLength: '60' },
              },
              {
                name: 'adi',
                maxOccurs: '100',
                annotation: { label: 'Adições' },
                element: [
                  {
                    name: 'nAdicao',
                    annotation: { label: 'Número da adição' },
                    restriction: { pattern: '[1-9]{1}[0-9]{0,2}' },
                  },
                  {
                    name: 'nSeqAdic',
                    annotation: {
                      label: 'Número sequencial do item dentro da adição',
                    },
                    restriction: { pattern: '[1-9]{1}[0-9]{0,2}' },
                  },
                  {
                    name: 'cFabricante',
                    annotation: {
                      label: 'Código do fabricante estrangeiro',
                      aux: 'Usado nos sistemas internos de informação do emitente',
                    },
                    restriction: { minLength: '1', maxLength: '60' },
                  },
                  {
                    name: 'vDescDI',
                    type: 'TDec_1302Opc',
                    optional: true,
                    annotation: {
                      label: 'Valor do desconto do item da DI – adição',
                    },
                  },
                  {
                    name: 'nDraw',
                    optional: true,
                    annotation: {
                      label: 'Número do ato concessório de Drawback',
                    },
                    restriction: { pattern: '[0-9]{0,11}' },
                  },
                ],
              },
            ],
          },
          {
            name: 'detExport',
            optional: true,
            maxOccurs: '500',
            annotation: { label: 'Detalhe da exportação' },
            element: [
              {
                name: 'nDraw',
                optional: true,
                annotation: {
                  label: 'Número do ato concessório de Drawback',
                },
                restriction: { pattern: '[0-9]{0,11}' },
              },
              {
                name: 'exportInd',
                optional: true,
                annotation: { label: 'Exportação indireta' },
                element: [
                  {
                    name: 'nRE',
                    annotation: { label: 'Registro de exportação' },
                    restriction: { pattern: '[0-9]{0,12}' },
                  },
                  {
                    name: 'chNFe',
                    type: 'TChNFe',
                    annotation: {
                      label: 'Chave de acesso da NF-e recebida para exportação',
                    },
                  },
                  {
                    name: 'qExport',
                    type: 'TDec_1104v',
                    annotation: {
                      label: 'Quantidade do item efetivamente exportado',
                    },
                  },
                ],
              },
            ],
          },
          {
            name: 'xPed',
            optional: true,
            annotation: {
              label: 'Pedido de compra',
              aux: 'Informação de interesse do emissor para controle do B2B',
            },
            restriction: { minLength: '1', maxLength: '15' },
          },
          {
            name: 'nItemPed',
            optional: true,
            annotation: { label: 'Número do item do pedido de compra' },
            restriction: { pattern: '[0-9]{1,6}' },
          },
          {
            name: 'nFCI',
            optional: true,
            annotation: {
              label:
                'Número de controle da FCI (Ficha de Conteúdo de Importação)',
            },
            restriction: {
              pattern:
                '[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}',
            },
          },
          {
            name: 'rastro',
            annotation: {
              label: 'Rastreabilidade',
              aux: 'Obrigatório o preenchimento deste grupo no caso de medicamentos e produtos farmacêuticos',
            },
            optional: true,
            maxOccurs: '500',
            element: [
              {
                name: 'nLote',
                annotation: { label: 'Número do lote do produto.' },
                restriction: { minLength: '1', maxLength: '20' },
              },
              {
                name: 'qLote',
                annotation: { label: 'Quantidade de produto no lote.' },
                restriction: {
                  decimal: 3,
                  pattern: '0|0\\.[0-9]{3}|[1-9]{1}[0-9]{0,7}(\\.[0-9]{1,3})?',
                },
              },
              {
                name: 'dFab',
                type: 'TData',
                annotation: { label: 'Data de fabricação/produção' },
              },
              {
                name: 'dVal',
                type: 'TData',
                annotation: {
                  label: 'Data de validade',
                  aux: 'Informar o último dia do mês caso a validade não especifique o dia',
                },
              },
              {
                name: 'cAgreg',
                annotation: { label: 'Código de agregação' },
                optional: true,
                restriction: { pattern: '[0-9]{1,20}' },
              },
            ],
          },
          {
            annotation: {
              label: 'Informações específicas de produtos e serviços',
            },
            optional: true,
            choice: true,
            element: [
              {
                name: 'veicProd',
                annotation: { label: 'Veículos novos' },
                element: [
                  {
                    name: 'tpOp',
                    annotation: {
                      label: 'Tipo da Operação',
                      itens: [
                        'Venda concessionária',
                        'Faturamento direto',
                        'Venda direta',
                        'Outros',
                      ],
                    },
                    restriction: { enumeration: ['0', '1', '2', '3'] },
                  },
                  {
                    name: 'chassi',
                    annotation: { label: 'Chassi do veículo (VIN)' },
                    restriction: { length: '17', pattern: '[A-Z0-9]+' },
                  },
                  {
                    name: 'cCor',
                    annotation: { label: 'Cor do veículo' },
                    restriction: { minLength: '1', maxLength: '4' },
                  },
                  {
                    name: 'xCor',
                    annotation: { label: 'Descrição da cor' },
                    restriction: { minLength: '1', maxLength: '40' },
                  },
                  {
                    name: 'pot',
                    annotation: {
                      label:
                        'Potência máxima do motor do veículo em CV (cavalo vapor)',
                    },
                    restriction: { minLength: '1', maxLength: '4' },
                  },
                  {
                    name: 'cilin',
                    annotation: {
                      label:
                        'Capacidade voluntária do motor expressa em CC (cilindradas)',
                    },
                    restriction: { minLength: '1', maxLength: '4' },
                  },
                  {
                    name: 'pesoL',
                    annotation: { label: 'Peso líquido' },
                    restriction: { minLength: '1', maxLength: '9' },
                  },
                  {
                    name: 'pesoB',
                    annotation: { label: 'Peso bruto' },
                    restriction: { minLength: '1', maxLength: '9' },
                  },
                  {
                    name: 'nSerie',
                    annotation: { label: 'Serial (série)' },
                    restriction: { minLength: '1', maxLength: '9' },
                  },
                  {
                    name: 'tpComb',
                    annotation: {
                      label: 'Tipo de combustível',
                      itens: [
                        'Álcool',
                        'Gasolina',
                        'Diesel',
                        'Gasogênio',
                        'Gás Metano',
                        'Elétrico/Fonte Interna',
                        'Elétrico/Fonte Externa',
                        'Gasolina/Gás Natural Combustível',
                        'Álcool/Gás Natural Combustível',
                        'Diesel/Gás Natural Combustível',
                        'Vide/Campo/Observação',
                        'Álcool/GNV',
                        'Gasolina/GNV',
                        'Diesel/GNV',
                        'GNV',
                        'Álcool/Gasolina',
                        'Gasolina/Álcool/GNV',
                        'Gasolina/Elétrico',
                      ],
                    },
                    restriction: {
                      enumeration: [
                        '01',
                        '02',
                        '03',
                        '04',
                        '05',
                        '06',
                        '07',
                        '08',
                        '09',
                        '10',
                        '11',
                        '12',
                        '13',
                        '14',
                        '15',
                        '16',
                        '17',
                        '18',
                      ],
                    },
                  },
                  {
                    name: 'nMotor',
                    annotation: { label: 'Número do motor' },
                    restriction: { minLength: '1', maxLength: '21' },
                  },
                  {
                    name: 'CMT',
                    annotation: {
                      label: 'CMT (Capacidade Máxima de Tração) em toneladas',
                    },
                    restriction: { minLength: '1', maxLength: '9' },
                  },
                  {
                    name: 'dist',
                    annotation: { label: 'Distância entre eixos' },
                    restriction: { minLength: '1', maxLength: '4' },
                  },
                  {
                    name: 'anoMod',
                    annotation: { label: 'Ano do modelo_Formato: AAAA' },
                    restriction: { pattern: '[0-9]{4}' },
                  },
                  {
                    name: 'anoFab',
                    annotation: {
                      label: 'Ano de fabricação_Formato: AAAA',
                    },
                    restriction: { pattern: '[0-9]{4}' },
                  },
                  {
                    name: 'tpPint',
                    annotation: { label: 'Tipo de pintura' },
                    restriction: { length: '1' },
                  },
                  {
                    name: 'tpVeic',
                    annotation: {
                      label: 'Tipo de veículo',
                      itens: [
                        'Ciclomotor',
                        'Motoneta',
                        'Motocicleta',
                        'Triciclo',
                        'Automóvel',
                        'Micro-ônibus',
                        'Ônibus',
                        'Reboque',
                        'Semirreboque',
                        'Camioneta',
                        'Caminhão',
                        'Caminhão trator',
                        'Trator de rodas',
                        'Trador esteira',
                        'Trator misto',
                        'Quadriciclo',
                        'Chassi plataforma',
                        'Caminhonete',
                        'Utilitário',
                        'Motor-casa',
                      ],
                    },
                    restriction: {
                      enumeration: [
                        '02',
                        '03',
                        '04',
                        '05',
                        '06',
                        '07',
                        '08',
                        '10',
                        '11',
                        '13',
                        '14',
                        '17',
                        '18',
                        '19',
                        '20',
                        '21',
                        '22',
                        '23',
                        '25',
                        '26',
                      ],
                    },
                  },
                  {
                    name: 'espVeic',
                    annotation: {
                      label: 'Espécie de veículo',
                      itens: [
                        'Passageiro',
                        'Carga',
                        'Misto',
                        'Corrida',
                        'Tração',
                        'Especial',
                      ],
                    },
                    restriction: {
                      enumeration: ['1', '2', '3', '4', '5', '6'],
                    },
                  },
                  {
                    name: 'VIN',
                    annotation: {
                      label: 'Chassi remarcado',
                      itens: ['Sim', 'Não'],
                    },
                    restriction: { length: '1', enumeration: ['R', 'N'] },
                  },
                  {
                    name: 'condVeic',
                    annotation: {
                      label: 'Condição do veículo',
                      itens: ['Acabado', 'Inacabado', 'Semi-acabado'],
                    },
                    restriction: { enumeration: ['1', '2', '3'] },
                  },
                  {
                    name: 'cMod',
                    annotation: {
                      label: 'Código Marca Modelo (utilizar tabela RENAVAM)',
                    },
                    restriction: { pattern: '[0-9]{1,6}' },
                  },
                  {
                    name: 'cCorDENATRAN',
                    annotation: {
                      label: 'Cor',
                      itens: [
                        'Amarelo',
                        'Azul',
                        'Bege',
                        'Branca',
                        'Cinza',
                        'Dourada',
                        'Grená',
                        'Laranja',
                        'Marrom',
                        'Prata',
                        'Preta',
                        'Rosa',
                        'Roxa',
                        'Verde',
                        'Vermelha',
                        'Fantasia',
                      ],
                    },
                    restriction: {
                      enumeration: [
                        '01',
                        '02',
                        '03',
                        '04',
                        '05',
                        '06',
                        '07',
                        '08',
                        '09',
                        '10',
                        '11',
                        '12',
                        '13',
                        '14',
                        '15',
                        '16',
                      ],
                    },
                  },
                  {
                    name: 'lota',
                    annotation: {
                      label:
                        'Lotação máxima (passageiros sentados, inclusive motorista)',
                    },
                    restriction: {
                      minLength: '1',
                      maxLength: '3',
                      pattern: '[0-9]{1,3}',
                    },
                  },
                  {
                    name: 'tpRest',
                    annotation: {
                      label: 'Restrição',
                      itens: [
                        'Não há',
                        'Alienação Fiduciária',
                        'Arrendamento Mercantil',
                        'Reserva de Domínio',
                        'Penhor de Veículos',
                        'Outras',
                      ],
                    },
                    restriction: {
                      enumeration: ['0', '1', '2', '3', '4', '9'],
                    },
                  },
                ],
              },
              {
                name: 'med',
                annotation: {
                  label: 'Medicamentos e matérias-primas farmacêuticas',
                },
                element: [
                  {
                    choice: true,
                    annotation: { label: 'Possui registro na ANVISA' },
                    element: [
                      {
                        annotation: { label: 'Sim' },
                        element: [
                          {
                            name: 'cProdANVISA',
                            annotation: { label: 'Registro ANVISA' },
                            restriction: { pattern: '[0-9]{13}|ISENTO' },
                          },
                        ],
                      },
                      {
                        annotation: { label: 'Não' },
                        element: [
                          {
                            name: 'cProdANVISA',
                            annotation: { label: 'Registro ANVISA' },
                            restriction: { enumeration: 'ISENTO' },
                          },
                          {
                            name: 'xMotivoIsencao',
                            optional: true,
                            annotation: {
                              label: 'Motivo da isenção',
                              aux: 'Para medicamento isento de registro na ANVISA, informar o número da decisão que o isenta, como por exemplo o número da Resolução da Diretoria Colegiada da ANVISA (RDC)',
                            },
                            restriction: {
                              minLength: '1',
                              maxLength: '255',
                            },
                          },
                        ],
                      },
                    ],
                  },
                  {
                    name: 'vPMC',
                    type: 'TDec_1302',
                    annotation: { label: 'Preço máximo ao consumidor.' },
                  },
                ],
              },
              {
                name: 'arma',
                maxOccurs: '500',
                annotation: { label: 'Armamentos' },
                element: [
                  {
                    name: 'tpArma',
                    annotation: {
                      label: 'Tipo de arma de fogo',
                      itens: ['Uso permitido', 'Uso restrito'],
                    },
                    restriction: { enumeration: ['0', '1'] },
                  },
                  {
                    name: 'nSerie',
                    annotation: { label: 'Número de série da arma' },
                    restriction: { minLength: '1', maxLength: '15' },
                  },
                  {
                    name: 'nCano',
                    annotation: { label: 'Número de série do cano' },
                    restriction: { minLength: '1', maxLength: '15' },
                  },
                  {
                    name: 'descr',
                    annotation: {
                      label: 'Descrição completa da arma',
                      aux: 'Compreendendo: calibre, marca, capacidade, tipo de funcionamento, comprimento e demais elementos que permitam a sua perfeita identificação',
                    },
                    restriction: { minLength: '1', maxLength: '256' },
                  },
                ],
              },
              {
                name: 'comb',
                annotation: { label: 'Combustíveis líquidos' },
                element: [
                  {
                    name: 'cProdANP',
                    annotation: { label: 'Código de produto da ANP' },
                    restriction: { pattern: '[0-9]{9}' },
                  },
                  {
                    name: 'descANP',
                    annotation: {
                      label: 'Descrição do Produto conforme ANP',
                      aux: 'Utilizar a descrição de produtos do SIMP (Sistema de Informações de Movimentação de Produtos)',
                    },
                    restriction: { minLength: '2', maxLength: '95' },
                  },
                  {
                    optional: true,
                    annotation: {
                      label: 'Informações de GLP (Código 210203001)',
                    },
                    element: [
                      {
                        name: 'pGLP',
                        type: 'TDec_0302a04Max100',
                        optional: true,
                        annotation: {
                          label:
                            'Percentual do GLP derivado do petróleo no produto GLP',
                          aux: 'Valores de 0 a 100',
                        },
                      },
                      {
                        name: 'pGNn',
                        type: 'TDec_0302a04Max100',
                        optional: true,
                        annotation: {
                          label:
                            'Percentual de gás natural nacional GLGNn para o produto GLP',
                          aux: 'Valores de 0 a 100',
                        },
                      },
                      {
                        name: 'pGNi',
                        type: 'TDec_0302a04Max100',
                        optional: true,
                        annotation: {
                          label:
                            'Percentual de gás natural importado GLGNi para o produto GLP',
                          aux: 'Valores de 0 a 100',
                        },
                      },
                      {
                        name: 'vPart',
                        type: 'TDec_1302',
                        optional: true,
                        annotation: {
                          label: 'Valor de partida (por quilograma sem ICMS)',
                        },
                      },
                    ],
                  },
                  {
                    name: 'CODIF',
                    optional: true,
                    annotation: {
                      label: 'Código de autorização / registro do CODIF',
                      aux: 'Informar apenas quando a UF utilizar o CODIF (Sistema de Controle do Diferimento do Imposto nas Operações com Álcool Etílico Anidro Combustível)',
                    },
                    restriction: { pattern: '[0-9]{1,21}' },
                  },
                  {
                    name: 'qTemp',
                    optional: true,
                    annotation: {
                      label:
                        'Quantidade de combustível faturada à temperatura ambiente',
                      aux: 'Informar quando a quantidade faturada informada no campo de quantidade comercial tiver sido ajustada para uma temperatura diferente da ambiente',
                    },
                    restriction: {
                      decimal: 4,
                      pattern:
                        '0\\.[1-9]{1}[0-9]{3}|0\\.[0-9]{3}[1-9]{1}|0\\.[0-9]{2}[1-9]{1}[0-9]{1}|0\\.[0-9]{1}[1-9]{1}[0-9]{2}|[1-9]{1}[0-9]{0,11}(\\.[0-9]{4})?',
                    },
                  },
                  {
                    name: 'UFCons',
                    type: 'TUf',
                    annotation: { label: 'Sigla da UF de Consumo' },
                  },
                  {
                    name: 'CIDE',
                    optional: true,
                    annotation: {
                      label:
                        'CIDE (Contribuição de Intervenção no Domínio Econômico)',
                    },
                    element: [
                      {
                        name: 'qBCProd',
                        type: 'TDec_1204v',
                        annotation: {
                          label: 'BC do CIDE ( Quantidade comercializada)',
                        },
                      },
                      {
                        name: 'vAliqProd',
                        type: 'TDec_1104',
                        annotation: {
                          label: 'Alíquota do CIDE  (em reais)',
                        },
                      },
                      {
                        name: 'vCIDE',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor do CIDE' },
                      },
                    ],
                  },
                  {
                    name: 'encerrante',
                    optional: true,
                    annotation: { label: 'Informações do encerrante' },
                    element: [
                      {
                        name: 'nBico',
                        annotation: {
                          label: 'Numero do bico utilizado no abastecimento',
                        },
                        restriction: { pattern: '[0-9]{1,3}' },
                      },
                      {
                        name: 'nBomba',
                        optional: true,
                        annotation: {
                          label: 'Numero da bomba, caso exista',
                        },
                        restriction: { pattern: '[0-9]{1,3}' },
                      },
                      {
                        name: 'nTanque',
                        annotation: {
                          label: 'Numero de identificação do tanque',
                        },
                        restriction: { pattern: '[0-9]{1,3}' },
                      },
                      {
                        name: 'vEncIni',
                        type: 'TDec_1203',
                        annotation: {
                          label:
                            'Valor do Encerrante no ínicio do abastecimento',
                        },
                      },
                      {
                        name: 'vEncFin',
                        type: 'TDec_1203',
                        annotation: {
                          label:
                            'Valor do Encerrante no final do abastecimento',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                name: 'nRECOPI',
                annotation: { label: 'Número do RECOPI' },
                restriction: { maxLength: '20', pattern: '[0-9]{20}' },
              },
            ],
          },
        ],
      },
      {
        name: 'imposto',
        annotation: { label: 'Tributos incidentes' },
        element: [
          {
            name: 'vTotTrib',
            type: 'TDec_1302',
            optional: true,
            annotation: {
              label:
                'Valor estimado total de impostos federais, estaduais e municipais',
            },
          },
          {
            name: 'ICMS',
            optional: true,
            annotation: { label: 'Dados do ICMS Normal e ST' },
            choice: true,
            element: [
              {
                name: 'ICMS00',
                annotation: { label: 'Tributado integralmente' },
                custom: 'isNormal',
                element: [
                  {
                    name: 'orig',
                    annotation: {
                      label: 'Origem da mercadoria',
                      itens: [
                        'Nacional',
                        'Estrangeira - Importação direta',
                        'Estrangeira - Adquirida no mercado interno',
                      ],
                    },
                    restriction: { enumeration: ['0', '1', '2'] },
                  },
                  {
                    name: 'CST',
                    annotation: { label: 'Código de situação tributária' },
                    restriction: { enumeration: '00' },
                  },
                  {
                    name: 'modBC',
                    annotation: {
                      label: 'Modalidade de determinação da BC do ICMS',
                      itens: [
                        'Margem Valor Agregado (%)',
                        'Pauta (valor)',
                        'Preço Tabelado Máximo (valor)',
                        'Valor da Operação',
                      ],
                    },
                    restriction: { enumeration: ['0', '1', '2', '3'] },
                  },
                  {
                    name: 'vBC',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor da BC do ICMS' },
                  },
                  {
                    name: 'pICMS',
                    type: 'TDec_0302a04',
                    annotation: { label: 'Alíquota do ICMS' },
                  },
                  {
                    name: 'vICMS',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor do ICMS' },
                  },
                  {
                    annotation: { label: 'Fundo de combate à pobreza' },
                    optional: true,
                    element: [
                      {
                        name: 'pFCP',
                        type: 'TDec_0302a04Opc',
                        annotation: {
                          label: 'Percentual de ICMS relativo ao FCP',
                        },
                      },
                      {
                        name: 'vFCP',
                        type: 'TDec_1302',
                        annotation: {
                          label: 'Valor do ICMS relativo ao FCP',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                name: 'ICMS10',
                annotation: {
                  label:
                    'Tributado e com cobrança do ICMS por substituição tributária',
                },
                custom: 'isNormal',
                element: [
                  {
                    name: 'orig',
                    annotation: {
                      label: 'Origem da mercadoria',
                      itens: [
                        'Nacional',
                        'Estrangeira - Importação direta',
                        'Estrangeira - Adquirida no mercado interno',
                      ],
                    },
                    restriction: { enumeration: ['0', '1', '2'] },
                  },
                  {
                    name: 'CST',
                    annotation: { label: 'Código de situação tributária' },
                    restriction: { enumeration: '10' },
                  },
                  {
                    name: 'modBC',
                    annotation: {
                      label: 'Modalidade de determinação da BC do ICMS',
                      itens: [
                        'Margem Valor Agregado (%)',
                        'Pauta (valor)',
                        'Preço Tabelado Máximo (valor)',
                        'Valor da Operação',
                      ],
                    },
                    restriction: { enumeration: ['0', '1', '2', '3'] },
                  },
                  {
                    name: 'vBC',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor da BC do ICMS' },
                  },
                  {
                    name: 'pICMS',
                    type: 'TDec_0302a04',
                    annotation: { label: 'Alíquota do ICMS' },
                  },
                  {
                    name: 'vICMS',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor do ICMS' },
                  },
                  {
                    annotation: { label: 'Fundo de combate à pobreza' },
                    optional: true,
                    element: [
                      {
                        name: 'vBCFCP',
                        type: 'TDec_1302',
                        annotation: { label: 'Base de cálculo' },
                      },
                      {
                        name: 'pFCP',
                        type: 'TDec_0302a04Opc',
                        annotation: { label: 'Percentual' },
                      },
                      {
                        name: 'vFCP',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor' },
                      },
                    ],
                  },
                  {
                    name: 'modBCST',
                    annotation: {
                      label: 'Modalidade de determinação da BC do ICMS ST',
                      itens: [
                        'Preço tabelado ou máximo sugerido',
                        'Lista Negativa (valor)',
                        'Lista Positiva (valor)',
                        'Lista Neutra (valor)',
                        'Margem Valor Agregado (%)',
                        'Pauta (valor)',
                        'Valor da Operação',
                      ],
                    },
                    restriction: {
                      enumeration: ['0', '1', '2', '3', '4', '5', '6'],
                    },
                  },
                  {
                    name: 'pMVAST',
                    type: 'TDec_0302a04Opc',
                    optional: true,
                    annotation: {
                      label: 'Percentual da Margem de Valor Adicionado ICMS ST',
                    },
                  },
                  {
                    name: 'pRedBCST',
                    type: 'TDec_0302a04Opc',
                    optional: true,
                    annotation: {
                      label: 'Percentual de redução da BC ICMS ST',
                    },
                  },
                  {
                    name: 'vBCST',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor da BC do ICMS ST' },
                  },
                  {
                    name: 'pICMSST',
                    type: 'TDec_0302a04',
                    annotation: { label: 'Alíquota do ICMS ST' },
                  },
                  {
                    name: 'vICMSST',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor do ICMS ST' },
                  },
                  {
                    annotation: {
                      label: 'FCP retido por substituição tributária',
                    },
                    optional: true,
                    element: [
                      {
                        name: 'vBCFCPST',
                        type: 'TDec_1302',
                        annotation: {
                          label:
                            'Valor da Base de cálculo do FCP retido por substituicao tributaria',
                        },
                      },
                      {
                        name: 'pFCPST',
                        type: 'TDec_0302a04Opc',
                        annotation: {
                          label:
                            'Percentual de FCP retido por substituição tributária',
                        },
                      },
                      {
                        name: 'vFCPST',
                        type: 'TDec_1302',
                        annotation: {
                          label:
                            'Valor do FCP retido por substituição tributária',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                name: 'ICMS20',
                annotation: {
                  label: 'Tributção com redução de base de cálculo',
                },
                custom: 'isNormal',
                element: [
                  {
                    name: 'orig',
                    annotation: {
                      label: 'Origem da mercadoria',
                      itens: [
                        'Nacional',
                        'Estrangeira - Importação direta',
                        'Estrangeira - Adquirida no mercado interno',
                      ],
                    },
                    restriction: { enumeration: ['0', '1', '2'] },
                  },
                  {
                    name: 'CST',
                    annotation: { label: 'Código de situação tributária' },
                    restriction: { enumeration: '20' },
                  },
                  {
                    name: 'modBC',
                    annotation: {
                      label: 'Modalidade de determinação da BC do ICMS',
                      itens: [
                        'Margem Valor Agregado (%)',
                        'Pauta (valor)',
                        'Preço Tabelado Máximo (valor)',
                        'Valor da Operação',
                      ],
                    },
                    restriction: { enumeration: ['0', '1', '2', '3'] },
                  },
                  {
                    name: 'pRedBC',
                    type: 'TDec_0302a04',
                    annotation: { label: 'Percentual de redução da BC' },
                  },
                  {
                    name: 'vBC',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor da BC do ICMS' },
                  },
                  {
                    name: 'pICMS',
                    type: 'TDec_0302a04',
                    annotation: { label: 'Alíquota do ICMS' },
                  },
                  {
                    name: 'vICMS',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor do ICMS' },
                  },
                  {
                    annotation: { label: 'Fundo de combate à pobreza' },
                    optional: true,
                    element: [
                      {
                        name: 'vBCFCP',
                        type: 'TDec_1302',
                        annotation: { label: 'Base de cálculo' },
                      },
                      {
                        name: 'pFCP',
                        type: 'TDec_0302a04Opc',
                        annotation: { label: 'Percentual' },
                      },
                      {
                        name: 'vFCP',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor' },
                      },
                    ],
                  },
                  {
                    optional: true,
                    annotation: { label: 'Desoneração' },
                    element: [
                      {
                        name: 'vICMSDeson',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor do ICMS desonerado' },
                      },
                      {
                        name: 'motDesICMS',
                        annotation: {
                          label: 'Motivo da desoneração',
                          itens: [
                            'Uso na agropecuária',
                            'Outros',
                            'Fomento agropecuário',
                          ],
                        },
                        restriction: { enumeration: ['3', '9', '12'] },
                      },
                    ],
                  },
                ],
              },
              {
                name: 'ICMS30',
                annotation: {
                  label:
                    'Isenta ou não tributada e com cobrança do ICMS por substituição tributária',
                },
                custom: 'isNormal',
                element: [
                  {
                    name: 'orig',
                    annotation: {
                      label: 'Origem da mercadoria',
                      itens: [
                        'Nacional',
                        'Estrangeira - Importação direta',
                        'Estrangeira - Adquirida no mercado interno',
                      ],
                    },
                    restriction: { enumeration: ['0', '1', '2'] },
                  },
                  {
                    name: 'CST',
                    annotation: { label: 'Código de situação tributária' },
                    restriction: { enumeration: '30' },
                  },
                  {
                    name: 'modBCST',
                    annotation: {
                      label: 'Modalidade de determinação da BC do ICMS ST',
                      itens: [
                        'Preço tabelado ou máximo sugerido',
                        'Lista Negativa (valor)',
                        'Lista Positiva (valor)',
                        'Lista Neutra (valor)',
                        'Margem Valor Agregado (%)',
                        'Pauta (valor)',
                        'Valor da Operação',
                      ],
                    },
                    restriction: {
                      enumeration: ['0', '1', '2', '3', '4', '5', '6'],
                    },
                  },
                  {
                    name: 'pMVAST',
                    type: 'TDec_0302a04Opc',
                    optional: true,
                    annotation: {
                      label: 'Percentual da Margem de Valor Adicionado ICMS ST',
                    },
                  },
                  {
                    name: 'pRedBCST',
                    type: 'TDec_0302a04Opc',
                    optional: true,
                    annotation: {
                      label: 'Percentual de redução da BC ICMS ST',
                    },
                  },
                  {
                    name: 'vBCST',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor da BC do ICMS ST' },
                  },
                  {
                    name: 'pICMSST',
                    type: 'TDec_0302a04',
                    annotation: { label: 'Alíquota do ICMS ST' },
                  },
                  {
                    name: 'vICMSST',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor do ICMS ST' },
                  },
                  {
                    annotation: { label: 'FCP retido por ST' },
                    optional: true,
                    element: [
                      {
                        name: 'vBCFCPST',
                        type: 'TDec_1302',
                        annotation: { label: 'Base de cálculo' },
                      },
                      {
                        name: 'pFCPST',
                        type: 'TDec_0302a04Opc',
                        annotation: { label: 'Percentual' },
                      },
                      {
                        name: 'vFCPST',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor' },
                      },
                    ],
                  },
                  {
                    optional: true,
                    annotation: { label: 'Desoneração' },
                    element: [
                      {
                        name: 'vICMSDeson',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor do ICMS desonerado' },
                      },
                      {
                        name: 'motDesICMS',
                        annotation: {
                          label: 'Motivo da desoneração',
                          itens: [
                            'Utilitários Motocicleta A Área Livre',
                            'SUFRAMA',
                            'Outros',
                          ],
                        },
                        restriction: { enumeration: ['6', '7', '9'] },
                      },
                    ],
                  },
                ],
              },
              {
                name: 'ICMS40',
                annotation: { label: 'Isenta, não tributada ou suspensa' },
                custom: 'isNormal',
                element: [
                  {
                    name: 'orig',
                    annotation: {
                      label: 'Origem da mercadoria',
                      itens: [
                        'Nacional',
                        'Estrangeira - Importação direta',
                        'Estrangeira - Adquirida no mercado interno',
                      ],
                    },
                    restriction: { enumeration: ['0', '1', '2'] },
                  },
                  {
                    name: 'CST',
                    annotation: {
                      label: 'Código de situação tributária',
                      itens: ['Isenta', 'Não tributada', 'Suspensão'],
                    },
                    restriction: { enumeration: ['40', '41', '50'] },
                  },
                  {
                    annotation: {
                      label: 'Desoneração',
                      aux: 'O valor do ICMS será informado apenas nas operações com veículos beneficiados com a desoneração condicional do ICMS',
                    },
                    optional: true,
                    element: [
                      {
                        name: 'vICMSDeson',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor do ICMS desonerado' },
                      },
                      {
                        name: 'motDesICMS',
                        annotation: {
                          label: 'Motivo da desoneração',
                          itens: [
                            'Táxi',
                            'Produtor Agropecuário',
                            'Frotista/Locadora',
                            'Diplomático/Consular',
                            'Utilitários e Motocicletas da Amazônia Ocidental e Áreas de Livre Comércio',
                            'SUFRAMA',
                            'Venda a órgão Público',
                            'Outros',
                            'Deficiente Condutor',
                            'Deficiente não condutor',
                            'Olimpíadas Rio 2016',
                            'Solicitado pelo Fisco',
                          ],
                        },
                        restriction: {
                          enumeration: [
                            '1',
                            '3',
                            '4',
                            '5',
                            '6',
                            '7',
                            '8',
                            '9',
                            '10',
                            '11',
                            '16',
                            '90',
                          ],
                        },
                      },
                    ],
                  },
                ],
              },
              {
                name: 'ICMS51',
                annotation: { label: 'Diferimento' },
                custom: 'isNormal',
                element: [
                  {
                    name: 'orig',
                    annotation: {
                      label: 'Origem da mercadoria',
                      itens: [
                        'Nacional',
                        'Estrangeira - Importação direta',
                        'Estrangeira - Adquirida no mercado interno',
                      ],
                    },
                    restriction: { enumeration: ['0', '1', '2'] },
                  },
                  {
                    name: 'CST',
                    annotation: { label: 'Código de situação tributária' },
                    restriction: { enumeration: '51' },
                  },
                  {
                    name: 'modBC',
                    annotation: {
                      label: 'Modalidade de determinação da BC do ICMS',
                      itens: [
                        'Margem Valor Agregado (%)',
                        'Pauta (valor)',
                        'Preço Tabelado Máximo (valor)',
                        'Valor da Operação',
                      ],
                    },
                    restriction: { enumeration: ['0', '1', '2', '3'] },
                  },
                  {
                    name: 'pRedBC',
                    type: 'TDec_0302a04',
                    optional: true,
                    annotation: { label: 'Percentual de redução da BC' },
                  },
                  {
                    name: 'vBC',
                    type: 'TDec_1302',
                    optional: true,
                    annotation: { label: 'Valor da BC do ICMS' },
                  },
                  {
                    name: 'pICMS',
                    type: 'TDec_0302a04',
                    optional: true,
                    annotation: { label: 'Alíquota do imposto' },
                  },
                  {
                    name: 'vICMSOp',
                    type: 'TDec_1302',
                    optional: true,
                    annotation: { label: 'Valor do ICMS da Operação' },
                  },
                  {
                    name: 'pDif',
                    type: 'TDec_0302a04Max100',
                    optional: true,
                    annotation: { label: 'Percentual do diferemento' },
                  },
                  {
                    name: 'vICMSDif',
                    type: 'TDec_1302',
                    optional: true,
                    annotation: { label: 'Valor do ICMS da diferido' },
                  },
                  {
                    name: 'vICMS',
                    type: 'TDec_1302',
                    optional: true,
                    annotation: { label: 'Valor do ICMS' },
                  },
                  {
                    annotation: { label: 'Fundo de combate à pobreza' },
                    optional: true,
                    element: [
                      {
                        name: 'vBCFCP',
                        type: 'TDec_1302',
                        annotation: { label: 'Base de cálculo' },
                      },
                      {
                        name: 'pFCP',
                        type: 'TDec_0302a04Opc',
                        annotation: { label: 'Percentual' },
                      },
                      {
                        name: 'vFCP',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor' },
                      },
                    ],
                  },
                ],
              },
              {
                name: 'ICMS60',
                annotation: {
                  label:
                    'ICMS cobrado anteriormente por substituição tributária',
                },
                custom: 'isNormal',
                element: [
                  {
                    name: 'orig',
                    annotation: {
                      label: 'Origem da mercadoria',
                      itens: [
                        'Nacional',
                        'Estrangeira - Importação direta',
                        'Estrangeira - Adquirida no mercado interno',
                      ],
                    },
                    restriction: { enumeration: ['0', '1', '2'] },
                  },
                  {
                    name: 'CST',
                    annotation: { label: 'Código de situação tributária' },
                    restriction: { enumeration: '60' },
                  },
                  {
                    optional: true,
                    annotation: { label: 'ICMS ST retido anteriormente' },
                    element: [
                      {
                        name: 'vBCSTRet',
                        type: 'TDec_1302',
                        annotation: {
                          label: 'Valor da BC do ICMS ST retido anteriormente',
                        },
                      },
                      {
                        name: 'pST',
                        type: 'TDec_0302a04Opc',
                        annotation: {
                          label: 'Aliquota suportada pelo consumidor final',
                        },
                      },
                      {
                        name: 'vICMSSubstituto',
                        type: 'TDec_1302',
                        optional: true,
                        annotation: {
                          label:
                            'Valor do ICMS Próprio do Substituto cobrado em operação anterior',
                        },
                      },
                      {
                        name: 'vICMSSTRet',
                        type: 'TDec_1302',
                        annotation: {
                          label: 'Valor do ICMS ST retido anteriormente',
                        },
                      },
                    ],
                  },
                  {
                    optional: true,
                    annotation: {
                      label: 'FCP retido anteriormente por ST',
                    },
                    element: [
                      {
                        name: 'vBCFCPSTRet',
                        type: 'TDec_1302',
                        annotation: { label: 'Base de cálculo' },
                      },
                      {
                        name: 'pFCPSTRet',
                        type: 'TDec_0302a04Opc',
                        annotation: { label: 'Percentual' },
                      },
                      {
                        name: 'vFCPSTRet',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor' },
                      },
                    ],
                  },
                  {
                    optional: true,
                    annotation: { label: 'ICMS efetivo' },
                    element: [
                      {
                        name: 'pRedBCEfet',
                        type: 'TDec_0302a04Opc',
                        annotation: { label: 'Percentual de redução da BC' },
                      },
                      {
                        name: 'vBCEfet',
                        type: 'TDec_1302',
                        annotation: { label: 'Base de cálculo' },
                      },
                      {
                        name: 'pICMSEfet',
                        type: 'TDec_0302a04Opc',
                        annotation: { label: 'Alíquota' },
                      },
                      {
                        name: 'vICMSEfet',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor' },
                      },
                    ],
                  },
                ],
              },
              {
                name: 'ICMS70',
                annotation: {
                  label:
                    'Tributação com redução de base de cálculo e cobrança do ICMS por ST',
                },
                custom: 'isNormal',
                element: [
                  {
                    name: 'orig',
                    annotation: {
                      label: 'Origem da mercadoria',
                      itens: [
                        'Nacional',
                        'Estrangeira - Importação direta',
                        'Estrangeira - Adquirida no mercado interno',
                      ],
                    },
                    restriction: { enumeration: ['0', '1', '2'] },
                  },
                  {
                    name: 'CST',
                    annotation: { label: 'Código de situação tributária' },
                    restriction: { enumeration: '70' },
                  },
                  {
                    name: 'modBC',
                    annotation: {
                      label: 'Modalidade de determinação da BC do ICMS',
                      itens: [
                        'Margem Valor Agregado (%)',
                        'Pauta (valor)',
                        'Preço Tabelado Máximo (valor)',
                        'Valor da Operação',
                      ],
                    },
                    restriction: { enumeration: ['0', '1', '2', '3'] },
                  },
                  {
                    name: 'pRedBC',
                    type: 'TDec_0302a04',
                    annotation: { label: 'Percentual de redução da BC' },
                  },
                  {
                    name: 'vBC',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor da BC do ICMS' },
                  },
                  {
                    name: 'pICMS',
                    type: 'TDec_0302a04',
                    annotation: { label: 'Alíquota do ICMS' },
                  },
                  {
                    name: 'vICMS',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor do ICMS' },
                  },
                  {
                    optional: true,
                    annotation: { label: 'Fundo de combate à pobreza' },
                    element: [
                      {
                        name: 'vBCFCP',
                        type: 'TDec_1302',
                        annotation: { label: 'Base de cálculo' },
                      },
                      {
                        name: 'pFCP',
                        type: 'TDec_0302a04Opc',
                        annotation: { label: 'Percentual' },
                      },
                      {
                        name: 'vFCP',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor' },
                      },
                    ],
                  },
                  {
                    name: 'modBCST',
                    annotation: {
                      label: 'Modalidade de determinação da BC do ICMS ST',
                      itens: [
                        'Preço tabelado ou máximo sugerido',
                        'Lista Negativa (valor)',
                        'Lista Positiva (valor)',
                        'Lista Neutra (valor)',
                        'Margem Valor Agregado (%)',
                        'Pauta (valor)',
                        'Valor da Operação',
                      ],
                    },
                    restriction: {
                      enumeration: ['0', '1', '2', '3', '4', '5', '6'],
                    },
                  },
                  {
                    name: 'pMVAST',
                    type: 'TDec_0302a04Opc',
                    optional: true,
                    annotation: {
                      label: 'Percentual da Margem de Valor Adicionado ICMS ST',
                    },
                  },
                  {
                    name: 'pRedBCST',
                    type: 'TDec_0302a04Opc',
                    optional: true,
                    annotation: {
                      label: 'Percentual de redução da BC ICMS ST',
                    },
                  },
                  {
                    name: 'vBCST',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor da BC do ICMS ST' },
                  },
                  {
                    name: 'pICMSST',
                    type: 'TDec_0302a04',
                    annotation: { label: 'Alíquota do ICMS ST' },
                  },
                  {
                    name: 'vICMSST',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor do ICMS ST' },
                  },
                  {
                    annotation: { label: 'FCP retido por ST' },
                    optional: true,
                    element: [
                      {
                        name: 'vBCFCPST',
                        type: 'TDec_1302',
                        annotation: { label: 'Base de cálculo' },
                      },
                      {
                        name: 'pFCPST',
                        type: 'TDec_0302a04Opc',
                        annotation: { label: 'Percentual' },
                      },
                      {
                        name: 'vFCPST',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor' },
                      },
                    ],
                  },
                  {
                    optional: true,
                    annotation: { label: 'Desoneração' },
                    element: [
                      {
                        name: 'vICMSDeson',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor do ICMS desonerado' },
                      },
                      {
                        name: 'motDesICMS',
                        annotation: {
                          label: 'Motivo da desoneração',
                          itens: [
                            'Uso na agropecuária',
                            'Outros',
                            'Fomento agropecuário',
                          ],
                        },
                        restriction: { enumeration: ['3', '9', '12'] },
                      },
                    ],
                  },
                ],
              },
              {
                name: 'ICMS90',
                annotation: { label: 'Tributação pelo ICMS\n90 - Outras' },
                custom: 'isNormal',
                element: [
                  {
                    name: 'orig',
                    annotation: {
                      label: 'Origem da mercadoria',
                      itens: [
                        'Nacional',
                        'Estrangeira - Importação direta',
                        'Estrangeira - Adquirida no mercado interno',
                      ],
                    },
                    restriction: { enumeration: ['0', '1', '2'] },
                  },
                  {
                    name: 'CST',
                    annotation: { label: 'Código de situação tributária' },
                    restriction: { enumeration: '90' },
                  },
                  {
                    optional: true,
                    element: [
                      {
                        name: 'modBC',
                        annotation: {
                          label: 'Modalidade de determinação da BC do ICMS',
                          itens: [
                            'Margem Valor Agregado (%)',
                            'Pauta (valor)',
                            'Preço Tabelado Máximo (valor)',
                            'Valor da Operação',
                          ],
                        },
                        restriction: { enumeration: ['0', '1', '2', '3'] },
                      },
                      {
                        name: 'vBC',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor da BC do ICMS' },
                      },
                      {
                        name: 'pRedBC',
                        type: 'TDec_0302a04Opc',
                        optional: true,
                        annotation: { label: 'Percentual de redução da BC' },
                      },
                      {
                        name: 'pICMS',
                        type: 'TDec_0302a04',
                        annotation: { label: 'Alíquota do ICMS' },
                      },
                      {
                        name: 'vICMS',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor do ICMS' },
                      },
                      {
                        annotation: { label: 'Fundo de combate à pobreza' },
                        optional: true,
                        element: [
                          {
                            name: 'vBCFCP',
                            type: 'TDec_1302',
                            annotation: { label: 'Base de cálculo' },
                          },
                          {
                            name: 'pFCP',
                            type: 'TDec_0302a04Opc',
                            annotation: { label: 'Percentual' },
                          },
                          {
                            name: 'vFCP',
                            type: 'TDec_1302',
                            annotation: { label: 'Valor' },
                          },
                        ],
                      },
                    ],
                  },
                  {
                    annotation: {
                      label: 'Substituição tributária de ICMS',
                    },
                    optional: true,
                    element: [
                      {
                        name: 'modBCST',
                        annotation: {
                          label: 'Modalidade de determinação da BC do ICMS ST',
                          itens: [
                            'Preço tabelado ou máximo sugerido',
                            'Lista Negativa (valor)',
                            'Lista Positiva (valor)',
                            'Lista Neutra (valor)',
                            'Margem Valor Agregado (%)',
                            'Pauta (valor)',
                            'Valor da Operação',
                          ],
                        },
                        restriction: {
                          enumeration: ['0', '1', '2', '3', '4', '5', '6'],
                        },
                      },
                      {
                        name: 'pMVAST',
                        type: 'TDec_0302a04Opc',
                        optional: true,
                        annotation: {
                          label:
                            'Percentual da Margem de Valor Adicionado ICMS ST',
                        },
                      },
                      {
                        name: 'pRedBCST',
                        type: 'TDec_0302a04Opc',
                        optional: true,
                        annotation: {
                          label: 'Percentual de redução da BC ICMS ST',
                        },
                      },
                      {
                        name: 'vBCST',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor da BC do ICMS ST' },
                      },
                      {
                        name: 'pICMSST',
                        type: 'TDec_0302a04',
                        annotation: { label: 'Alíquota do ICMS ST' },
                      },
                      {
                        name: 'vICMSST',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor do ICMS ST' },
                      },
                      {
                        annotation: { label: 'FCP retido por ST' },
                        optional: true,
                        element: [
                          {
                            name: 'vBCFCPST',
                            type: 'TDec_1302',
                            annotation: { label: 'Base de cálculo' },
                          },
                          {
                            name: 'pFCPST',
                            type: 'TDec_0302a04Opc',
                            annotation: { label: 'Percentual' },
                          },
                          {
                            name: 'vFCPST',
                            type: 'TDec_1302',
                            annotation: { label: 'Valor' },
                          },
                        ],
                      },
                    ],
                  },
                  {
                    optional: true,
                    annotation: { label: 'Desoneração' },
                    element: [
                      {
                        name: 'vICMSDeson',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor do ICMS desonerado' },
                      },
                      {
                        name: 'motDesICMS',
                        annotation: {
                          label: 'Motivo da desoneração',
                          itens: [
                            'Uso na agropecuária',
                            'Outros',
                            'Fomento agropecuário',
                          ],
                        },
                        restriction: { enumeration: ['3', '9', '12'] },
                      },
                    ],
                  },
                ],
              },
              {
                name: 'ICMSPart',
                annotation: {
                  label:
                    'Partilha do ICMS entre a UF de origem e UF de destino ou a UF definida na legislação',
                  aux: 'Operação interestadual para consumidor final com partilha do ICMS  devido na operação entre a UF de origem e a UF do destinatário ou ou a UF definida na legislação. (Ex. UF da concessionária de entrega do  veículos)',
                },
                custom: 'isNormal',
                element: [
                  {
                    name: 'orig',
                    annotation: {
                      label: 'Origem da mercadoria',
                      itens: [
                        'Nacional',
                        'Estrangeira - Importação direta',
                        'Estrangeira - Adquirida no mercado interno',
                      ],
                    },
                    restriction: { enumeration: ['0', '1', '2'] },
                  },
                  {
                    name: 'CST',
                    annotation: {
                      label: 'Código de situação tributária',
                      itens: [
                        'Tributada e com cobrança do ICMS por substituição tributária',
                        'Outros',
                      ],
                    },
                    restriction: { enumeration: ['10', '90'] },
                  },
                  {
                    name: 'modBC',
                    annotation: {
                      label: 'Modalidade de determinação da BC do ICMS',
                      itens: [
                        'Margem Valor Agregado (%)',
                        'Pauta (valor)',
                        'Preço Tabelado Máximo (valor)',
                        'Valor da Operação',
                      ],
                    },
                    restriction: { enumeration: ['0', '1', '2', '3'] },
                  },
                  {
                    name: 'vBC',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor da BC do ICMS' },
                  },
                  {
                    name: 'pRedBC',
                    type: 'TDec_0302a04Opc',
                    optional: true,
                    annotation: { label: 'Percentual de redução da BC' },
                  },
                  {
                    name: 'pICMS',
                    type: 'TDec_0302a04',
                    annotation: { label: 'Alíquota do ICMS' },
                  },
                  {
                    name: 'vICMS',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor do ICMS' },
                  },
                  {
                    name: 'modBCST',
                    annotation: {
                      label: 'Modalidade de determinação da BC do ICMS ST',
                      itens: [
                        'Preço tabelado ou máximo sugerido',
                        'Lista Negativa (valor)',
                        'Lista Positiva (valor)',
                        'Lista Neutra (valor)',
                        'Margem Valor Agregado (%)',
                        'Pauta (valor)',
                        'Valor da Operação',
                      ],
                    },
                    restriction: {
                      enumeration: ['0', '1', '2', '3', '4', '5', '6'],
                    },
                  },
                  {
                    name: 'pMVAST',
                    type: 'TDec_0302a04Opc',
                    optional: true,
                    annotation: {
                      label: 'Percentual da Margem de Valor Adicionado ICMS ST',
                    },
                  },
                  {
                    name: 'pRedBCST',
                    type: 'TDec_0302a04Opc',
                    optional: true,
                    annotation: {
                      label: 'Percentual de redução da BC ICMS ST',
                    },
                  },
                  {
                    name: 'vBCST',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor da BC do ICMS ST' },
                  },
                  {
                    name: 'pICMSST',
                    type: 'TDec_0302a04',
                    annotation: { label: 'Alíquota do ICMS ST' },
                  },
                  {
                    name: 'vICMSST',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor do ICMS ST' },
                  },
                  {
                    name: 'pBCOp',
                    type: 'TDec_0302a04Opc',
                    annotation: {
                      label:
                        'Percentual para determinação do valor  da Base de Cálculo da operação própria.',
                    },
                  },
                  {
                    name: 'UFST',
                    type: 'TUf',
                    annotation: {
                      label:
                        'Sigla da UF para qual é devido o ICMS ST da operação.',
                    },
                  },
                ],
              },
              {
                name: 'ICMSST',
                annotation: {
                  label: 'Repasse via Substituto Tributário',
                  aux: 'Informação do ICMSST para a UF de destino, nas operações interestaduais de produtos que tiveram retenção antecipada de ICMS por ST na UF do remetente',
                },
                custom: 'isNormal',
                element: [
                  {
                    name: 'orig',
                    annotation: {
                      label: 'Origem da mercadoria',
                      itens: [
                        'Nacional',
                        'Estrangeira - Importação direta',
                        'Estrangeira - Adquirida no mercado interno',
                      ],
                    },
                    restriction: { enumeration: ['0', '1', '2'] },
                  },
                  {
                    name: 'CST',
                    annotation: {
                      label: 'Tributção pelo ICMS',
                      itens: [
                        'Não Tributado',
                        'Cobrado anteriormente por substituição tributária',
                      ],
                    },
                    restriction: { enumeration: ['41', '60'] },
                  },
                  {
                    name: 'vBCSTRet',
                    type: 'TDec_1302',
                    annotation: {
                      label:
                        'Informar o valor da BC do ICMS ST retido na UF remetente',
                    },
                  },
                  {
                    name: 'pST',
                    type: 'TDec_0302a04Opc',
                    optional: true,
                    annotation: {
                      label: 'Aliquota suportada pelo consumidor final.',
                    },
                  },
                  {
                    name: 'vICMSSubstituto',
                    type: 'TDec_1302',
                    optional: true,
                    annotation: {
                      label:
                        'Valor do ICMS Próprio do Substituto cobrado em operação anterior',
                    },
                  },
                  {
                    name: 'vICMSSTRet',
                    type: 'TDec_1302',
                    annotation: {
                      label:
                        'Informar o valor do ICMS ST retido na UF remetente',
                    },
                  },
                  {
                    annotation: {
                      label: 'FCP retido anteriormente por ST',
                    },
                    optional: true,
                    element: [
                      {
                        name: 'vBCFCPSTRet',
                        type: 'TDec_1302',
                        annotation: { label: 'Base de Cálculo' },
                      },
                      {
                        name: 'pFCPSTRet',
                        type: 'TDec_0302a04Opc',
                        annotation: { label: 'Percentual' },
                      },
                      {
                        name: 'vFCPSTRet',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor' },
                      },
                    ],
                  },
                  {
                    name: 'vBCSTDest',
                    type: 'TDec_1302',
                    annotation: {
                      label: 'Informar o valor da BC do ICMS ST da UF destino',
                    },
                  },
                  {
                    name: 'vICMSSTDest',
                    type: 'TDec_1302',
                    annotation: {
                      label: 'Informar o valor da BC do ICMS ST da UF destino',
                    },
                  },
                  {
                    optional: true,
                    annotation: { label: 'ICMS efetivo' },
                    element: [
                      {
                        name: 'pRedBCEfet',
                        type: 'TDec_0302a04Opc',
                        annotation: { label: 'Percentual de redução da BC' },
                      },
                      {
                        name: 'vBCEfet',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor da base de cálculo' },
                      },
                      {
                        name: 'pICMSEfet',
                        type: 'TDec_0302a04Opc',
                        annotation: { label: 'Alíquota' },
                      },
                      {
                        name: 'vICMSEfet',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor' },
                      },
                    ],
                  },
                ],
              },
              {
                name: 'ICMSSN101',
                annotation: { label: 'Tributado com permissão de crédito' },
                custom: 'isSimples',
                element: [
                  {
                    name: 'orig',
                    annotation: {
                      label: 'Origem da mercadoria',
                      itens: [
                        'Nacional',
                        'Estrangeira - Importação direta',
                        'Estrangeira - Adquirida no mercado interno',
                      ],
                    },
                    restriction: { enumeration: ['0', '1', '2'] },
                  },
                  {
                    name: 'CSOSN',
                    annotation: { label: 'Código de situação da operação' },
                    restriction: { enumeration: '101' },
                  },
                  {
                    name: 'pCredSN',
                    type: 'TDec_0302a04',
                    annotation: {
                      label: 'Alíquota aplicável de cálculo do crédito',
                    },
                  },
                  {
                    name: 'vCredICMSSN',
                    type: 'TDec_1302',
                    annotation: {
                      label: 'Valor crédito do ICMS',
                      aux: 'Aproveitado nos termos do art. 23 da LC 123',
                    },
                  },
                ],
              },
              {
                name: 'ICMSSN102',
                annotation: { label: 'Sem tributação' },
                custom: 'isSimples',
                element: [
                  {
                    name: 'orig',
                    annotation: {
                      label: 'Origem da mercadoria',
                      itens: [
                        'Nacional',
                        'Estrangeira - Importação direta',
                        'Estrangeira - Adquirida no mercado interno',
                      ],
                    },
                    restriction: { enumeration: ['0', '1', '2'] },
                  },
                  {
                    name: 'CSOSN',
                    annotation: {
                      label: 'Código de situação da operação',
                      itens: [
                        'Tributada sem permissão de crédito',
                        'Isenção do ICMS para faixa de receita bruta',
                        'Imune',
                        'Não tributada',
                      ],
                    },
                    restriction: {
                      enumeration: ['102', '103', '300', '400'],
                    },
                  },
                ],
              },
              {
                name: 'ICMSSN201',
                annotation: {
                  label:
                    'Tributada com permissão de crédito e com cobrança por ST',
                },
                custom: 'isSimples',
                element: [
                  {
                    name: 'orig',
                    annotation: {
                      label: 'Origem da mercadoria',
                      itens: [
                        'Nacional',
                        'Estrangeira - Importação direta',
                        'Estrangeira - Adquirida no mercado interno',
                      ],
                    },
                    restriction: { enumeration: ['0', '1', '2'] },
                  },
                  {
                    name: 'CSOSN',
                    annotation: { label: 'Código de situação da operação' },
                    restriction: { enumeration: '201' },
                  },
                  {
                    name: 'modBCST',
                    annotation: {
                      label: 'Modalidade de determinação da BC do ICMS ST',
                      itens: [
                        'Preço tabelado ou máximo sugerido',
                        'Lista Negativa (valor)',
                        'Lista Positiva (valor)',
                        'Lista Neutra (valor)',
                        'Margem Valor Agregado (%)',
                        'Pauta (valor)',
                        'Valor da Operação',
                      ],
                    },
                    restriction: {
                      enumeration: ['0', '1', '2', '3', '4', '5', '6'],
                    },
                  },
                  {
                    name: 'pMVAST',
                    type: 'TDec_0302a04Opc',
                    optional: true,
                    annotation: {
                      label: 'Percentual da Margem de Valor Adicionado ICMS ST',
                    },
                  },
                  {
                    name: 'pRedBCST',
                    type: 'TDec_0302a04Opc',
                    optional: true,
                    annotation: {
                      label: 'Percentual de redução da BC ICMS ST',
                    },
                  },
                  {
                    name: 'vBCST',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor da BC do ICMS ST' },
                  },
                  {
                    name: 'pICMSST',
                    type: 'TDec_0302a04',
                    annotation: { label: 'Alíquota do ICMS ST' },
                  },
                  {
                    name: 'vICMSST',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor do ICMS ST' },
                  },
                  {
                    annotation: { label: 'FCP retido por ST' },
                    optional: true,
                    element: [
                      {
                        name: 'vBCFCPST',
                        type: 'TDec_1302',
                        annotation: { label: 'Base de cálculo' },
                      },
                      {
                        name: 'pFCPST',
                        type: 'TDec_0302a04Opc',
                        annotation: { label: 'Percentual' },
                      },
                      {
                        name: 'vFCPST',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor' },
                      },
                    ],
                  },
                  {
                    name: 'pCredSN',
                    type: 'TDec_0302a04',
                    annotation: {
                      label: 'Alíquota aplicável de cálculo do crédito',
                    },
                  },
                  {
                    name: 'vCredICMSSN',
                    type: 'TDec_1302',
                    annotation: {
                      label:
                        'Valor crédito do ICMS que pode ser aproveitado nos termos do art. 23 da LC 123 (Simples Nacional) (v2.0)',
                    },
                  },
                ],
              },
              {
                name: 'ICMSSN202',
                annotation: {
                  label:
                    'Tributada sem permissão de crédito ou isenta e com cobrança por ST',
                },
                custom: 'isSimples',
                element: [
                  {
                    name: 'orig',
                    annotation: {
                      label: 'Origem da mercadoria',
                      itens: [
                        'Nacional',
                        'Estrangeira - Importação direta',
                        'Estrangeira - Adquirida no mercado interno',
                      ],
                    },
                    restriction: { enumeration: ['0', '1', '2'] },
                  },
                  {
                    name: 'CSOSN',
                    annotation: {
                      label: 'Código de situação da operação',
                      itens: [
                        'Tributada pelo Simples Nacional sem permissão de crédito e com cobrança do ICMS por Substituição Tributária',
                        'Isenção do ICMS nos Simples Nacional para faixa de receita bruta e com cobrança do ICMS por Substituição Tributária',
                      ],
                    },
                    restriction: { enumeration: ['202', '203'] },
                  },
                  {
                    name: 'modBCST',
                    annotation: {
                      label: 'Modalidade de determinação da BC do ICMS ST',
                      itens: [
                        'Preço tabelado ou máximo sugerido',
                        'Lista Negativa (valor)',
                        'Lista Positiva (valor)',
                        'Lista Neutra (valor)',
                        'Margem Valor Agregado (%)',
                        'Pauta (valor)',
                        'Valor da Operação',
                      ],
                    },
                    restriction: {
                      enumeration: ['0', '1', '2', '3', '4', '5', '6'],
                    },
                  },
                  {
                    name: 'pMVAST',
                    type: 'TDec_0302a04Opc',
                    optional: true,
                    annotation: {
                      label: 'Percentual da Margem de Valor Adicionado ICMS ST',
                    },
                  },
                  {
                    name: 'pRedBCST',
                    type: 'TDec_0302a04Opc',
                    optional: true,
                    annotation: {
                      label: 'Percentual de redução da BC ICMS ST',
                    },
                  },
                  {
                    name: 'vBCST',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor da BC do ICMS ST ' },
                  },
                  {
                    name: 'pICMSST',
                    type: 'TDec_0302a04',
                    annotation: { label: 'Alíquota do ICMS ST' },
                  },
                  {
                    name: 'vICMSST',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor do ICMS ST' },
                  },
                  {
                    annotation: { label: 'FCP retido por ST' },
                    optional: true,
                    element: [
                      {
                        name: 'vBCFCPST',
                        type: 'TDec_1302',
                        annotation: { label: 'Base de cálculo' },
                      },
                      {
                        name: 'pFCPST',
                        type: 'TDec_0302a04Opc',
                        annotation: { label: 'Percentual' },
                      },
                      {
                        name: 'vFCPST',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor' },
                      },
                    ],
                  },
                ],
              },
              {
                name: 'ICMSSN500',
                annotation: {
                  label: 'Cobrado anteriormente por ST ou por antecipação',
                },
                custom: 'isSimples',
                element: [
                  {
                    name: 'orig',
                    annotation: {
                      label: 'Origem da mercadoria',
                      itens: [
                        'Nacional',
                        'Estrangeira - Importação direta',
                        'Estrangeira - Adquirida no mercado interno',
                      ],
                    },
                    restriction: { enumeration: ['0', '1', '2'] },
                  },
                  {
                    name: 'CSOSN',
                    annotation: { label: 'Código de situação da operação' },
                    restriction: { enumeration: '500' },
                  },
                  {
                    optional: true,
                    annotation: { label: 'ICMS ST retido anteriormente' },
                    element: [
                      {
                        name: 'vBCSTRet',
                        type: 'TDec_1302',
                        annotation: {
                          label: 'Valor da BC do ICMS ST retido anteriormente',
                        },
                      },
                      {
                        name: 'pST',
                        type: 'TDec_0302a04Opc',
                        annotation: {
                          label: 'Aliquota suportada pelo consumidor final.',
                        },
                      },
                      {
                        name: 'vICMSSubstituto',
                        type: 'TDec_1302',
                        optional: true,
                        annotation: {
                          label: 'Valor do ICMS próprio do substituto',
                        },
                      },
                      {
                        name: 'vICMSSTRet',
                        type: 'TDec_1302',
                        annotation: {
                          label: 'Valor do ICMS ST retido anteriormente ',
                        },
                      },
                    ],
                  },
                  {
                    optional: true,
                    annotation: {
                      label: 'FCP retido anteriormente por ST.',
                    },
                    element: [
                      {
                        name: 'vBCFCPSTRet',
                        type: 'TDec_1302',
                        annotation: { label: 'Base de cálculo' },
                      },
                      {
                        name: 'pFCPSTRet',
                        type: 'TDec_0302a04Opc',
                        annotation: { label: 'Percentual' },
                      },
                      {
                        name: 'vFCPSTRet',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor' },
                      },
                    ],
                  },
                  {
                    optional: true,
                    annotation: { label: 'ICMS efetivo' },
                    element: [
                      {
                        name: 'pRedBCEfet',
                        type: 'TDec_0302a04Opc',
                        annotation: { label: 'Percentual de redução da BC' },
                      },
                      {
                        name: 'vBCEfet',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor da base de cálculo' },
                      },
                      {
                        name: 'pICMSEfet',
                        type: 'TDec_0302a04Opc',
                        annotation: { label: 'Alíquota do ICMS' },
                      },
                      {
                        name: 'vICMSEfet',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor do ICMS' },
                      },
                    ],
                  },
                ],
              },
              {
                name: 'ICMSSN900',
                annotation: { label: 'Outros' },
                custom: 'isSimples',
                element: [
                  {
                    name: 'orig',
                    annotation: {
                      label: 'Origem da mercadoria',
                      itens: [
                        'Nacional',
                        'Estrangeira - Importação direta',
                        'Estrangeira - Adquirida no mercado interno',
                      ],
                    },
                    restriction: { enumeration: ['0', '1', '2'] },
                  },
                  {
                    name: 'CSOSN',
                    annotation: { label: 'Código de situação da operação' },
                    restriction: { enumeration: '900' },
                  },
                  {
                    optional: true,
                    element: [
                      {
                        name: 'modBC',
                        annotation: {
                          label: 'Modalidade de determinação da BC do ICMS',
                          itens: [
                            'Margem Valor Agregado (%)',
                            'Pauta (valor)',
                            'Preço Tabelado Máximo (valor)',
                            'Valor da Operação',
                          ],
                        },
                        restriction: { enumeration: ['0', '1', '2', '3'] },
                      },
                      {
                        name: 'vBC',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor da BC do ICMS' },
                      },
                      {
                        name: 'pRedBC',
                        type: 'TDec_0302a04Opc',
                        optional: true,
                        annotation: { label: 'Percentual de redução da BC' },
                      },
                      {
                        name: 'pICMS',
                        type: 'TDec_0302a04',
                        annotation: { label: 'Alíquota do ICMS' },
                      },
                      {
                        name: 'vICMS',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor do ICMS' },
                      },
                    ],
                  },
                  {
                    annotation: {
                      label: 'Substituição tributária de ICMS',
                    },
                    optional: true,
                    element: [
                      {
                        name: 'modBCST',
                        annotation: {
                          label: 'Modalidade de determinação da BC do ICMS ST',
                          itens: [
                            'Preço tabelado ou máximo sugerido',
                            'Lista Negativa (valor)',
                            'Lista Positiva (valor)',
                            'Lista Neutra (valor)',
                            'Margem Valor Agregado (%)',
                            'Pauta (valor)',
                            'Valor da Operação',
                          ],
                        },
                        restriction: {
                          enumeration: ['0', '1', '2', '3', '4', '5', '6'],
                        },
                      },
                      {
                        name: 'pMVAST',
                        type: 'TDec_0302a04Opc',
                        optional: true,
                        annotation: {
                          label:
                            'Percentual da Margem de Valor Adicionado ICMS ST',
                        },
                      },
                      {
                        name: 'pRedBCST',
                        type: 'TDec_0302a04Opc',
                        optional: true,
                        annotation: {
                          label: 'Percentual de redução da BC ICMS ST',
                        },
                      },
                      {
                        name: 'vBCST',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor da BC do ICMS ST' },
                      },
                      {
                        name: 'pICMSST',
                        type: 'TDec_0302a04',
                        annotation: { label: 'Alíquota do ICMS ST' },
                      },
                      {
                        name: 'vICMSST',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor do ICMS ST' },
                      },
                      {
                        annotation: { label: 'FCP retido por ST' },
                        optional: true,
                        element: [
                          {
                            name: 'vBCFCPST',
                            type: 'TDec_1302',
                            annotation: { label: 'Base de cálculo' },
                          },
                          {
                            name: 'pFCPST',
                            type: 'TDec_0302a04Opc',
                            annotation: { label: 'Percentual' },
                          },
                          {
                            name: 'vFCPST',
                            type: 'TDec_1302',
                            annotation: { label: 'Valor' },
                          },
                        ],
                      },
                    ],
                  },
                  {
                    optional: true,
                    annotation: { label: 'Crédito do ICMS' },
                    element: [
                      {
                        name: 'pCredSN',
                        type: 'TDec_0302a04',
                        annotation: {
                          label: 'Alíquota aplicável de cálculo do crédito',
                        },
                      },
                      {
                        name: 'vCredICMSSN',
                        type: 'TDec_1302',
                        annotation: {
                          label: 'Valor',
                          aux: 'Aproveitado nos termos do art. 23 da LC 123',
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: 'ICMSUFDest',
            optional: true,
            annotation: {
              label: 'ICMS interestardual',
              aux: 'Para consumidor final não contribuinte de ICMS',
            },
            element: [
              {
                name: 'vBCUFDest',
                type: 'TDec_1302',
                annotation: {
                  label:
                    'Valor da Base de Cálculo do ICMS na UF do destinatário.',
                },
              },
              {
                name: 'vBCFCPUFDest',
                type: 'TDec_1302',
                optional: true,
                annotation: {
                  label:
                    'Valor da Base de Cálculo do FCP na UF do destinatário.',
                },
              },
              {
                name: 'pFCPUFDest',
                type: 'TDec_0302a04',
                optional: true,
                annotation: {
                  label:
                    'Percentual adicional inserido na alíquota interna da UF de destino, relativo ao FCP naquela UF.',
                },
              },
              {
                name: 'pICMSUFDest',
                type: 'TDec_0302a04',
                annotation: {
                  label:
                    'Alíquota adotada nas operações internas na UF do destinatário para o produto / mercadoria.',
                },
              },
              {
                name: 'pICMSInter',
                annotation: {
                  label: 'Alíquota interestadual das UF envolvidas',
                  itens: [
                    'Alíquota interestadual para produtos importados',
                    'Sul e Sudeste (exceto ES) destinado ao Norte e Nordeste ou ES',
                    'Demais casos',
                  ],
                },
                restriction: { enumeration: ['4.00', '7.00', '12.00'] },
              },
              {
                name: 'pICMSInterPart',
                annotation: {
                  label: 'Percentual de partilha para a UF do destinatário',
                },
                restriction: { enumeration: '100.00' },
              },
              {
                name: 'vFCPUFDest',
                type: 'TDec_1302',
                optional: true,
                annotation: {
                  label:
                    'Valor do ICMS relativo ao Fundo de Combate à Pobreza (FCP) da UF de destino.',
                },
              },
              {
                name: 'vICMSUFDest',
                type: 'TDec_1302',
                annotation: {
                  label: 'Valor do ICMS de partilha para a UF do destinatário.',
                },
              },
              {
                name: 'vICMSUFRemet',
                annotation: {
                  label: 'Valor do ICMS de partilha para a UF do remetente',
                },
                restriction: { enumeration: '0.00' },
              },
            ],
          },
          {
            name: 'IPI',
            annotation: {
              label: 'Imposto sobre produtos industrializados',
            },
            optional: true,
            element: [
              {
                name: 'CNPJProd',
                type: 'TCnpj',
                optional: true,
                annotation: {
                  label:
                    'CNPJ do produtor da mercadoria, se diferente do emitente e somente em exportação',
                },
              },
              {
                name: 'cSelo',
                optional: true,
                annotation: { label: 'Código do selo de controle do IPI' },
                restriction: { minLength: '1', maxLength: '60' },
              },
              {
                name: 'qSelo',
                optional: true,
                annotation: {
                  label: 'Quantidade de selo de controle do IPI',
                },
                restriction: { pattern: '[0-9]{1,12}' },
              },
              {
                name: 'cEnq',
                annotation: {
                  label: 'Código de Enquadramento Legal do IPI',
                },
                restriction: { minLength: '1', maxLength: '3' },
              },
              {
                choice: true,
                annotation: { label: 'Tipo de IPI' },
                element: [
                  {
                    name: 'IPITrib',
                    annotation: { label: 'IPI tributado' },
                    element: [
                      {
                        name: 'CST',
                        annotation: {
                          label: 'Código da Situação Tributária do IPI',
                          itens: [
                            'Entrada com recuperação de crédito',
                            'Outras entradas',
                            'Saída tributada',
                            'Outras saídas',
                          ],
                        },
                        restriction: {
                          enumeration: ['00', '49', '50', '99'],
                        },
                      },
                      {
                        choice: true,
                        element: [
                          {
                            annotation: { label: 'Cálculo por alíquota' },
                            element: [
                              {
                                name: 'vBC',
                                type: 'TDec_1302',
                                annotation: { label: 'Valor da BC do IPI' },
                              },
                              {
                                name: 'pIPI',
                                type: 'TDec_0302a04',
                                annotation: { label: 'Alíquota do IPI' },
                              },
                            ],
                          },
                          {
                            annotation: {
                              label: 'Cálculo por valor de unidade',
                            },
                            element: [
                              {
                                name: 'qUnid',
                                type: 'TDec_1204v',
                                annotation: {
                                  label:
                                    'Quantidade total na unidade padrão para tributação',
                                },
                              },
                              {
                                name: 'vUnid',
                                type: 'TDec_1104',
                                annotation: {
                                  label: 'Valor por Unidade Tributável',
                                },
                              },
                            ],
                          },
                        ],
                      },
                      {
                        name: 'vIPI',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor do IPI' },
                      },
                    ],
                  },
                  {
                    name: 'IPINT',
                    annotation: { label: 'IPI não tributado' },
                    element: [
                      {
                        name: 'CST',
                        annotation: {
                          label: 'Código da Situação Tributária do IPI',
                          itens: [
                            'Entrada tributada com alíquota zero',
                            'Entrada isenta',
                            'Entrada não-tributada',
                            'Entrada imune',
                            'Entrada com suspensão',
                            'Saída tributada com alíquota zero',
                            'Saída isenta',
                            'Saída não-tributada',
                            'Saída imune',
                            'Saída com suspensão',
                          ],
                        },
                        restriction: {
                          enumeration: [
                            '01',
                            '02',
                            '03',
                            '04',
                            '05',
                            '51',
                            '52',
                            '53',
                            '54',
                            '55',
                          ],
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: 'II',
            optional: true,
            annotation: { label: 'Dados do Imposto de Importação' },
            ifUndefined: 'ISSQN',
            element: [
              {
                name: 'vBC',
                type: 'TDec_1302',
                annotation: { label: 'Base da BC do Imposto de Importação' },
              },
              {
                name: 'vDespAdu',
                type: 'TDec_1302',
                annotation: { label: 'Valor das despesas aduaneiras' },
              },
              {
                name: 'vII',
                type: 'TDec_1302',
                annotation: { label: 'Valor do Imposto de Importação' },
              },
              {
                name: 'vIOF',
                type: 'TDec_1302',
                annotation: {
                  label: 'Valor do Imposto sobre Operações Financeiras',
                },
              },
            ],
          },
          {
            name: 'PIS',
            optional: true,
            annotation: { label: 'Dados do PIS' },
            choice: true,
            element: [
              {
                name: 'PISAliq',
                annotation: { label: 'PIS tributado pela alíquota' },
                element: [
                  {
                    name: 'CST',
                    annotation: {
                      label: 'Código de Situação Tributária',
                      itens: [
                        'Alíquota Normal (Cumulativo/Não Cumulativo)',
                        'Alíquota Diferenciada',
                      ],
                    },
                    restriction: { enumeration: ['01', '02'] },
                  },
                  {
                    name: 'vBC',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor da BC do PIS' },
                  },
                  {
                    name: 'pPIS',
                    type: 'TDec_0302a04',
                    annotation: { label: 'Alíquota do PIS (em percentual)' },
                  },
                  {
                    name: 'vPIS',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor do PIS' },
                  },
                ],
              },
              {
                name: 'PISQtde',
                annotation: { label: 'PIS tributado por quantidade' },
                element: [
                  {
                    name: 'CST',
                    annotation: { label: 'Código de Situação Tributária' },
                    restriction: { enumeration: '03' },
                  },
                  {
                    name: 'qBCProd',
                    type: 'TDec_1204v',
                    annotation: { label: 'Quantidade Vendida' },
                  },
                  {
                    name: 'vAliqProd',
                    type: 'TDec_1104v',
                    annotation: { label: 'Alíquota do PIS (em reais)' },
                  },
                  {
                    name: 'vPIS',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor do PIS' },
                  },
                ],
              },
              {
                name: 'PISNT',
                annotation: { label: 'Não tributado' },
                element: [
                  {
                    name: 'CST',
                    annotation: {
                      label: 'Código de Situação Tributária',
                      itens: [
                        'Operação com tributação monofásica (Alíquota Zero)',
                        'Operação Tributável (ST)',
                        'Operação Tributável - Alíquota Zero',
                        'Operação Isenta da contribuição',
                        'Operação sem incidência da contribuição',
                        'Operação com suspensão da contribuição',
                      ],
                    },
                    restriction: {
                      enumeration: ['04', '05', '06', '07', '08', '09'],
                    },
                  },
                ],
              },
              {
                name: 'PISOutr',
                annotation: { label: 'Outras Operações.' },
                element: [
                  {
                    name: 'CST',
                    annotation: { label: 'Código de Situação Tributária' },
                    restriction: { enumeration: '99' },
                  },
                  {
                    choice: true,
                    annotation: { label: 'Tipo de cálculo' },
                    element: [
                      {
                        annotation: { label: 'Em percentual' },
                        element: [
                          {
                            name: 'vBC',
                            type: 'TDec_1302',
                            annotation: { label: 'Valor da BC do PIS' },
                          },
                          {
                            name: 'pPIS',
                            type: 'TDec_0302a04',
                            annotation: {
                              label: 'Alíquota do PIS (em percentual)',
                            },
                          },
                        ],
                      },
                      {
                        annotation: { label: 'Em valor' },
                        element: [
                          {
                            name: 'qBCProd',
                            type: 'TDec_1204v',
                            annotation: { label: 'Quantidade Vendida' },
                          },
                          {
                            name: 'vAliqProd',
                            type: 'TDec_1104v',
                            annotation: {
                              label: 'Alíquota do PIS (em reais)',
                            },
                          },
                        ],
                      },
                    ],
                  },
                  {
                    name: 'vPIS',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor do PIS' },
                  },
                ],
              },
            ],
          },
          {
            name: 'PISST',
            optional: true,
            annotation: { label: 'Dados do PIS Substituição Tributária' },
            element: [
              {
                choice: true,
                element: [
                  {
                    annotation: { label: 'Em percentual' },
                    element: [
                      {
                        name: 'vBC',
                        type: 'TDec_1302Opc',
                        annotation: { label: 'Valor da BC do PIS ST' },
                      },
                      {
                        name: 'pPIS',
                        type: 'TDec_0302a04',
                        annotation: {
                          label: 'Alíquota do PIS ST (em percentual)',
                        },
                      },
                    ],
                  },
                  {
                    annotation: { label: 'Em valor' },
                    element: [
                      {
                        name: 'qBCProd',
                        type: 'TDec_1204',
                        annotation: { label: 'Quantidade Vendida' },
                      },
                      {
                        name: 'vAliqProd',
                        type: 'TDec_1104',
                        annotation: {
                          label: 'Alíquota do PIS ST (em reais)',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                name: 'vPIS',
                type: 'TDec_1302',
                annotation: { label: 'Valor do PIS ST' },
              },
            ],
          },
          {
            name: 'COFINS',
            optional: true,
            annotation: { label: 'Dados do COFINS' },
            choice: true,
            element: [
              {
                name: 'COFINSAliq',
                annotation: { label: 'Tributado pela alíquota;' },
                element: [
                  {
                    name: 'CST',
                    annotation: {
                      label: 'Código de Situação Tributária',
                      itens: [
                        'Alíquota Normal (Cumulativo/Não Cumulativo)',
                        'Alíquota Diferenciada',
                      ],
                    },
                    restriction: { enumeration: ['01', '02'] },
                  },
                  {
                    name: 'vBC',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor da BC do COFINS' },
                  },
                  {
                    name: 'pCOFINS',
                    type: 'TDec_0302a04',
                    annotation: {
                      label: 'Alíquota do COFINS (em percentual)',
                    },
                  },
                  {
                    name: 'vCOFINS',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor do COFINS' },
                  },
                ],
              },
              {
                name: 'COFINSQtde',
                annotation: { label: 'Tributado por quantidade' },
                element: [
                  {
                    name: 'CST',
                    annotation: { label: 'Código de Situação Tributária' },
                    restriction: { enumeration: '03' },
                  },
                  {
                    name: 'qBCProd',
                    type: 'TDec_1204v',
                    annotation: { label: 'Quantidade Vendida' },
                  },
                  {
                    name: 'vAliqProd',
                    type: 'TDec_1104v',
                    annotation: { label: 'Alíquota do COFINS (em reais)' },
                  },
                  {
                    name: 'vCOFINS',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor do COFINS' },
                  },
                ],
              },
              {
                name: 'COFINSNT',
                annotation: { label: 'Não tributado' },
                element: [
                  {
                    name: 'CST',
                    annotation: {
                      label: 'Código de Situação Tributária',
                      itens: [
                        'Operação com tributação monofásica (Alíquota Zero)',
                        'Operação Tributável (ST)',
                        'Operação Tributável - Alíquota Zero',
                        'Operação Isenta da contribuição',
                        'Operação Sem Incidência da contribuição',
                        'Operação com suspensão da contribuição',
                      ],
                    },
                    restriction: {
                      enumeration: ['04', '05', '06', '07', '08', '09'],
                    },
                  },
                ],
              },
              {
                name: 'COFINSOutr',
                annotation: { label: 'Outras operações' },
                element: [
                  {
                    name: 'CST',
                    annotation: {
                      label: 'Código de Situação Tributária',
                      itens: [
                        'Outras Operações de Saída',
                        'Operação com Direito a Crédito - Vinculada Exclusivamente a Receita Tributada no Mercado Interno',
                        'Operação com Direito a Crédito – Vinculada Exclusivamente a Receita Não Tributada no Mercado Interno',
                        'Operação com Direito a Crédito - Vinculada Exclusivamente a Receita de Exportação',
                        'Operação com Direito a Crédito - Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno',
                        'Operação com Direito a Crédito - Vinculada a Receitas Tributadas no Mercado Interno e de Exportação',
                        'Operação com Direito a Crédito - Vinculada a Receitas Não-Tributadas no Mercado Interno e de Exportação',
                        'Operação com Direito a Crédito - Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno, e de Exportação',
                        'Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita Tributada no Mercado Interno',
                        'Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita Não-Tributada no Mercado Interno',
                        'Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita de Exportação',
                        'Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno',
                        'Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas no Mercado Interno e de Exportação',
                        'Crédito Presumido - Operação de Aquisição Vinculada a Receitas Não-Tributadas no Mercado Interno e de Exportação',
                        'Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno, e de Exportação',
                        'Crédito Presumido - Outras Operações',
                        'Operação de Aquisição sem Direito a Crédito',
                        'Operação de Aquisição com Isenção',
                        'Operação de Aquisição com Suspensão',
                        'Operação de Aquisição a Alíquota Zero',
                        'Operação de Aquisição sem Incidência da Contribuição',
                        'Operação de Aquisição por Substituição Tributária',
                        'Outras Operações de Entrada',
                        'Outras Operações',
                      ],
                    },
                    restriction: {
                      enumeration: [
                        '49',
                        '50',
                        '51',
                        '52',
                        '53',
                        '54',
                        '55',
                        '56',
                        '60',
                        '61',
                        '62',
                        '63',
                        '64',
                        '65',
                        '66',
                        '67',
                        '70',
                        '71',
                        '72',
                        '73',
                        '74',
                        '75',
                        '98',
                        '99',
                      ],
                    },
                  },
                  {
                    choice: true,
                    annotation: { label: 'Tipo de cálculo' },
                    element: [
                      {
                        annotation: { label: 'Em percentual' },
                        element: [
                          {
                            name: 'vBC',
                            type: 'TDec_1302',
                            annotation: { label: 'Valor da BC do COFINS' },
                          },
                          {
                            name: 'pCOFINS',
                            type: 'TDec_0302a04',
                            annotation: {
                              label: 'Alíquota do COFINS (em percentual)',
                            },
                          },
                        ],
                      },
                      {
                        annotation: { label: 'Em valor' },
                        element: [
                          {
                            name: 'qBCProd',
                            type: 'TDec_1204v',
                            annotation: { label: 'Quantidade Vendida' },
                          },
                          {
                            name: 'vAliqProd',
                            type: 'TDec_1104v',
                            annotation: {
                              label: 'Alíquota do COFINS (em reais)',
                            },
                          },
                        ],
                      },
                    ],
                  },
                  {
                    name: 'vCOFINS',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor do COFINS' },
                  },
                ],
              },
            ],
          },
          {
            name: 'COFINSST',
            optional: true,
            annotation: {
              label: 'Dados do COFINS Substituição Tributaria;',
            },
            element: [
              {
                choice: true,
                annotation: { label: 'Tipo de cálculo' },
                element: [
                  {
                    annotation: { label: 'Em percentual' },
                    element: [
                      {
                        name: 'vBC',
                        type: 'TDec_1302',
                        annotation: { label: 'Valor da BC do COFINS ST' },
                      },
                      {
                        name: 'pCOFINS',
                        type: 'TDec_0302a04',
                        annotation: {
                          label: 'Alíquota do COFINS ST (em percentual)',
                        },
                      },
                    ],
                  },
                  {
                    annotation: { label: 'Em valor' },
                    element: [
                      {
                        name: 'qBCProd',
                        type: 'TDec_1204',
                        annotation: { label: 'Quantidade Vendida' },
                      },
                      {
                        name: 'vAliqProd',
                        type: 'TDec_1104',
                        annotation: {
                          label: 'Alíquota do COFINS ST(em reais)',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                name: 'vCOFINS',
                type: 'TDec_1302',
                annotation: { label: 'Valor do COFINS ST' },
              },
            ],
          },
          {
            name: 'ISSQN',
            annotation: { label: 'ISSQN' },
            ifUndefined: 'ICMS',
            element: [
              {
                name: 'vBC',
                type: 'TDec_1302',
                annotation: { label: 'Valor da BC do ISSQN' },
              },
              {
                name: 'vAliq',
                type: 'TDec_0302a04',
                annotation: { label: 'Alíquota do ISSQN' },
              },
              {
                name: 'vISSQN',
                type: 'TDec_1302',
                annotation: { label: 'Valor da do ISSQN' },
              },
              {
                name: 'cMunFG',
                type: 'TCodMunIBGE',
                annotation: {
                  label: 'Município de ocorrência do fato gerador do ISSQN',
                },
              },
              {
                name: 'cListServ',
                annotation: {
                  label:
                    'Classificação do serviço segundo a lista de serviços LC 116/03',
                },
                restriction: {
                  enumeration: [
                    '01.01',
                    '01.02',
                    '01.03',
                    '01.04',
                    '01.05',
                    '01.06',
                    '01.07',
                    '01.08',
                    '01.09',
                    '02.01',
                    '03.02',
                    '03.03',
                    '03.04',
                    '03.05',
                    '04.01',
                    '04.02',
                    '04.03',
                    '04.04',
                    '04.05',
                    '04.06',
                    '04.07',
                    '04.08',
                    '04.09',
                    '04.10',
                    '04.11',
                    '04.12',
                    '04.13',
                    '04.14',
                    '04.15',
                    '04.16',
                    '04.17',
                    '04.18',
                    '04.19',
                    '04.20',
                    '04.21',
                    '04.22',
                    '04.23',
                    '05.01',
                    '05.02',
                    '05.03',
                    '05.04',
                    '05.05',
                    '05.06',
                    '05.07',
                    '05.08',
                    '05.09',
                    '06.01',
                    '06.02',
                    '06.03',
                    '06.04',
                    '06.05',
                    '06.06',
                    '07.01',
                    '07.02',
                    '07.03',
                    '07.04',
                    '07.05',
                    '07.06',
                    '07.07',
                    '07.08',
                    '07.09',
                    '07.10',
                    '07.11',
                    '07.12',
                    '07.13',
                    '07.16',
                    '07.17',
                    '07.18',
                    '07.19',
                    '07.20',
                    '07.21',
                    '07.22',
                    '08.01',
                    '08.02',
                    '09.01',
                    '09.02',
                    '09.03',
                    '10.01',
                    '10.02',
                    '10.03',
                    '10.04',
                    '10.05',
                    '10.06',
                    '10.07',
                    '10.08',
                    '10.09',
                    '10.10',
                    '11.01',
                    '11.02',
                    '11.03',
                    '11.04',
                    '12.01',
                    '12.02',
                    '12.03',
                    '12.04',
                    '12.05',
                    '12.06',
                    '12.07',
                    '12.08',
                    '12.09',
                    '12.10',
                    '12.11',
                    '12.12',
                    '12.13',
                    '12.14',
                    '12.15',
                    '12.16',
                    '12.17',
                    '13.02',
                    '13.03',
                    '13.04',
                    '13.05',
                    '14.01',
                    '14.02',
                    '14.03',
                    '14.04',
                    '14.05',
                    '14.06',
                    '14.07',
                    '14.08',
                    '14.09',
                    '14.10',
                    '14.11',
                    '14.12',
                    '14.13',
                    '14.14',
                    '15.01',
                    '15.02',
                    '15.03',
                    '15.04',
                    '15.05',
                    '15.06',
                    '15.07',
                    '15.08',
                    '15.09',
                    '15.10',
                    '15.11',
                    '15.12',
                    '15.13',
                    '15.14',
                    '15.15',
                    '15.16',
                    '15.17',
                    '15.18',
                    '16.01',
                    '16.02',
                    '17.01',
                    '17.02',
                    '17.03',
                    '17.04',
                    '17.05',
                    '17.06',
                    '17.08',
                    '17.09',
                    '17.10',
                    '17.11',
                    '17.12',
                    '17.13',
                    '17.14',
                    '17.15',
                    '17.16',
                    '17.17',
                    '17.18',
                    '17.19',
                    '17.20',
                    '17.21',
                    '17.22',
                    '17.23',
                    '17.24',
                    '17.25',
                    '18.01',
                    '19.01',
                    '20.01',
                    '20.02',
                    '20.03',
                    '21.01',
                    '22.01',
                    '23.01',
                    '24.01',
                    '25.01',
                    '25.02',
                    '25.03',
                    '25.04',
                    '25.05',
                    '26.01',
                    '27.01',
                    '28.01',
                    '29.01',
                    '30.01',
                    '31.01',
                    '32.01',
                    '33.01',
                    '34.01',
                    '35.01',
                    '36.01',
                    '37.01',
                    '38.01',
                    '39.01',
                    '40.01',
                  ],
                },
              },
              {
                name: 'vDeducao',
                type: 'TDec_1302Opc',
                optional: true,
                annotation: {
                  label: 'Valor dedução para redução da base de cálculo',
                },
              },
              {
                name: 'vOutro',
                type: 'TDec_1302Opc',
                optional: true,
                annotation: { label: 'Valor outras retenções' },
              },
              {
                name: 'vDescIncond',
                type: 'TDec_1302Opc',
                optional: true,
                annotation: { label: 'Valor desconto incondicionado' },
              },
              {
                name: 'vDescCond',
                type: 'TDec_1302Opc',
                optional: true,
                annotation: { label: 'Valor desconto condicionado' },
              },
              {
                name: 'vISSRet',
                type: 'TDec_1302Opc',
                optional: true,
                annotation: { label: 'Valor Retenção ISS' },
              },
              {
                name: 'indISS',
                annotation: {
                  label: 'Exigibilidade do ISS',
                  itens: [
                    'Exigível',
                    'Não incidente',
                    'Isenção',
                    'Exportação',
                    'Imunidade',
                    'Suspensa por decisão judicial',
                    'Suspensa por processo administrativo',
                  ],
                },
                restriction: {
                  enumeration: ['1', '2', '3', '4', '5', '6', '7'],
                },
              },
              {
                name: 'cServico',
                optional: true,
                annotation: {
                  label: 'Código do serviço prestado dentro do município',
                },
                restriction: { minLength: '1', maxLength: '20' },
              },
              {
                name: 'cMun',
                type: 'TCodMunIBGE',
                optional: true,
                annotation: {
                  label: 'Código do Município de Incidência do Imposto',
                },
              },
              {
                name: 'nProcesso',
                optional: true,
                annotation: {
                  label:
                    'Número do Processo administrativo ou judicial de suspenção do processo',
                },
                restriction: { minLength: '1', maxLength: '30' },
              },
              {
                name: 'indIncentivo',
                annotation: {
                  label: 'Indicador de Incentivo Fiscal',
                  itens: ['Sim', 'Não'],
                },
                restriction: { enumeration: ['1', '2'] },
              },
            ],
          },
        ],
      },
      {
        name: 'impostoDevol',
        annotation: {
          label: 'Imposto devolvido',
          aux: 'Obrigatório informar motivo da devolução nas informações adicionais do produto',
        },
        optional: true,
        element: [
          {
            name: 'pDevol',
            annotation: { label: 'Percentual de mercadoria devolvida' },
            restriction: {
              decimal: 2,
              pattern:
                '0(\\.[0-9]{2})?|100(\\.00)?|[1-9]{1}[0-9]{0,1}(\\.[0-9]{2})?',
            },
          },
          {
            name: 'IPI',
            annotation: { label: 'Informação do IPI devolvido' },
            element: [
              {
                name: 'vIPIDevol',
                type: 'TDec_1302',
                annotation: { label: 'Valor' },
              },
            ],
          },
        ],
      },
      {
        name: 'infAdProd',
        optional: true,
        annotation: {
          label: 'Informações adicionais do produto',
          aux: 'Norma referenciada, informações complementares, etc',
        },
        restriction: { minLength: '1', maxLength: '500' },
      },
    ],
  },
  total: {
    name: 'total',
    annotation: { label: 'Totais da NF-e' },
    element: [
      {
        name: 'ICMSTot',
        annotation: { label: 'Totais referentes ao ICMS' },
        element: [
          {
            name: 'vBC',
            type: 'TDec_1302',
            annotation: { label: 'BC do ICMS' },
          },
          {
            name: 'vICMS',
            type: 'TDec_1302',
            annotation: { label: 'Total do ICMS' },
          },
          {
            name: 'vICMSDeson',
            type: 'TDec_1302',
            annotation: { label: 'Total do ICMS desonerado' },
          },
          {
            name: 'vFCPUFDest',
            type: 'TDec_1302',
            optional: true,
            annotation: {
              label: 'Total do ICMS relativo ao FCP para a UF de destino',
            },
          },
          {
            name: 'vICMSUFDest',
            type: 'TDec_1302',
            optional: true,
            annotation: {
              label: 'Total do ICMS de partilha para a UF do destinatário',
            },
          },
          {
            name: 'vICMSUFRemet',
            type: 'TDec_1302',
            optional: true,
            annotation: {
              label: 'Total do ICMS de partilha para a UF do remetente',
            },
          },
          {
            name: 'vFCP',
            type: 'TDec_1302',
            annotation: {
              label: 'Total do FCP (Fundo de Combate à Pobreza).',
            },
          },
          {
            name: 'vBCST',
            type: 'TDec_1302',
            annotation: { label: 'BC do ICMS ST' },
          },
          {
            name: 'vST',
            type: 'TDec_1302',
            annotation: { label: 'Total do ICMS ST' },
          },
          {
            name: 'vFCPST',
            type: 'TDec_1302',
            annotation: { label: 'Total do FCP retido por ST.' },
          },
          {
            name: 'vFCPSTRet',
            type: 'TDec_1302',
            annotation: {
              label: 'Total do FCP retido anteriormente por ST.',
            },
          },
          {
            name: 'vProd',
            type: 'TDec_1302',
            annotation: { label: 'Total dos produtos e serviços' },
          },
          {
            name: 'vFrete',
            type: 'TDec_1302',
            annotation: { label: 'Total do frete' },
          },
          {
            name: 'vSeg',
            type: 'TDec_1302',
            annotation: { label: 'Total do seguro' },
          },
          {
            name: 'vDesc',
            type: 'TDec_1302',
            annotation: { label: 'Total do desconto' },
          },
          {
            name: 'vII',
            type: 'TDec_1302',
            annotation: { label: 'Total do II' },
          },
          {
            name: 'vIPI',
            type: 'TDec_1302',
            annotation: { label: 'Total do IPI' },
          },
          {
            name: 'vIPIDevol',
            type: 'TDec_1302',
            annotation: { label: 'Total do IPI devolvido.' },
          },
          {
            name: 'vPIS',
            type: 'TDec_1302',
            annotation: { label: 'Total do PIS' },
          },
          {
            name: 'vCOFINS',
            type: 'TDec_1302',
            annotation: { label: 'Total do COFINS' },
          },
          {
            name: 'vOutro',
            type: 'TDec_1302',
            annotation: { label: 'Outras Despesas acessórias' },
          },
          {
            name: 'vNF',
            type: 'TDec_1302',
            annotation: {
              label: 'Total da NF-e',
              aux: 'Caso informado, o total dos serviços sob não-incidência ou não tributados pelo ICMS deve ser somado a este campo.',
            },
          },
          {
            name: 'vTotTrib',
            type: 'TDec_1302',
            optional: true,
            annotation: {
              label:
                'Total estimado de impostos federais, estaduais e municipais',
            },
          },
        ],
      },
      {
        name: 'ISSQNtot',
        optional: true,
        annotation: { label: 'Totais referentes ao ISSQN' },
        element: [
          {
            name: 'vServ',
            type: 'TDec_1302Opc',
            optional: true,
            annotation: {
              label:
                'Total dos Serviços sob não-incidência ou não tributados pelo ICMS',
            },
          },
          {
            name: 'vBC',
            type: 'TDec_1302Opc',
            optional: true,
            annotation: { label: 'Base de Cálculo do ISS' },
          },
          {
            name: 'vISS',
            type: 'TDec_1302Opc',
            optional: true,
            annotation: { label: 'Total do ISS' },
          },
          {
            name: 'vPIS',
            type: 'TDec_1302Opc',
            optional: true,
            annotation: { label: 'Total do PIS sobre serviços' },
          },
          {
            name: 'vCOFINS',
            type: 'TDec_1302Opc',
            optional: true,
            annotation: { label: 'Total do COFINS sobre serviços' },
          },
          {
            name: 'dCompet',
            type: 'TData',
            annotation: {
              label: 'Data da prestação do serviço  (AAAA-MM-DD)',
            },
          },
          {
            name: 'vDeducao',
            type: 'TDec_1302Opc',
            optional: true,
            annotation: {
              label: 'Valor dedução para redução da base de cálculo',
            },
          },
          {
            name: 'vOutro',
            type: 'TDec_1302Opc',
            optional: true,
            annotation: { label: 'Valor outras retenções' },
          },
          {
            name: 'vDescIncond',
            type: 'TDec_1302Opc',
            optional: true,
            annotation: { label: 'Valor desconto incondicionado' },
          },
          {
            name: 'vDescCond',
            type: 'TDec_1302Opc',
            optional: true,
            annotation: { label: 'Valor desconto condicionado' },
          },
          {
            name: 'vISSRet',
            type: 'TDec_1302Opc',
            optional: true,
            annotation: { label: 'Total Retenção ISS' },
          },
          {
            name: 'cRegTrib',
            optional: true,
            annotation: {
              label: 'Código do regime especial de tributação',
              itens: [
                'Microempresa Municipal',
                'Estimativa',
                'Sociedade de Profissionais',
                'Cooperativa',
                'Microempresário Individual (MEI)',
                'Microempresário e Empresa de Pequeno Porte',
              ],
            },
            restriction: { enumeration: ['1', '2', '3', '4', '5', '6'] },
          },
        ],
      },
      {
        name: 'retTrib',
        optional: true,
        annotation: { label: 'Retenção de Tributos Federais' },
        element: [
          {
            name: 'vRetPIS',
            type: 'TDec_1302Opc',
            optional: true,
            annotation: { label: 'Valor Retido de PIS' },
          },
          {
            name: 'vRetCOFINS',
            type: 'TDec_1302Opc',
            optional: true,
            annotation: { label: 'Valor Retido de COFINS' },
          },
          {
            name: 'vRetCSLL',
            type: 'TDec_1302Opc',
            optional: true,
            annotation: { label: 'Valor Retido de CSLL' },
          },
          {
            name: 'vBCIRRF',
            type: 'TDec_1302Opc',
            optional: true,
            annotation: { label: 'Base de Cálculo do IRRF' },
          },
          {
            name: 'vIRRF',
            type: 'TDec_1302Opc',
            optional: true,
            annotation: { label: 'Valor Retido de IRRF' },
          },
          {
            name: 'vBCRetPrev',
            type: 'TDec_1302Opc',
            optional: true,
            annotation: {
              label: 'Base de Cálculo da Retenção da Previdêncica Social',
            },
          },
          {
            name: 'vRetPrev',
            type: 'TDec_1302Opc',
            optional: true,
            annotation: {
              label: 'Valor da Retenção da Previdêncica Social',
            },
          },
        ],
      },
    ],
  },
  transp: {
    name: 'transp',
    annotation: { label: 'Transporte' },
    element: [
      {
        name: 'modFrete',
        annotation: {
          label: 'Modalidade do frete',
          itens: [
            'Contratação do Frete por conta do Remetente (CIF)',
            'Contratação do Frete por conta do destinatário/remetente (FOB)',
            'Contratação do Frete por conta de terceiros',
            'Transporte próprio por conta do remetente',
            'Transporte próprio por conta do destinatário',
            'Sem Ocorrência de transporte',
          ],
        },
        restriction: { enumeration: ['0', '1', '2', '3', '4', '9'] },
      },
      {
        name: 'transporta',
        optional: true,
        annotation: { label: 'Dados do transportador' },
        element: [
          {
            annotation: { label: 'Documento usado' },
            choice: true,
            element: [
              {
                name: 'CNPJ',
                type: 'TCnpj',
                annotation: { label: 'CNPJ do transportador' },
              },
              {
                name: 'CPF',
                type: 'TCpf',
                annotation: { label: 'CPF do transportador' },
              },
            ],
          },
          {
            name: 'xNome',
            annotation: { label: 'Razão Social ou nome do transportador' },
            restriction: { maxLength: '60', minLength: '2' },
          },
          {
            name: 'IE',
            type: 'TIeDest',
            optional: true,
            annotation: { label: 'Inscrição Estadual' },
          },
          {
            name: 'xEnder',
            optional: true,
            annotation: { label: 'Endereço completo' },
            restriction: { minLength: '1', maxLength: '60' },
          },
          {
            name: 'xMun',
            optional: true,
            annotation: { label: 'Nome do munícipio' },
            restriction: { maxLength: '60', minLength: '1' },
          },
          {
            name: 'UF',
            type: 'TUf',
            optional: true,
            annotation: { label: 'Sigla da UF' },
          },
        ],
      },
      {
        name: 'retTransp',
        optional: true,
        annotation: { label: 'Dados da retenção  ICMS do Transporte' },
        element: [
          {
            name: 'vServ',
            type: 'TDec_1302',
            annotation: { label: 'Valor do Serviço' },
          },
          {
            name: 'vBCRet',
            type: 'TDec_1302',
            annotation: { label: 'BC da Retenção do ICMS' },
          },
          {
            name: 'pICMSRet',
            type: 'TDec_0302a04',
            annotation: { label: 'Alíquota da Retenção' },
          },
          {
            name: 'vICMSRet',
            type: 'TDec_1302',
            annotation: { label: 'Valor do ICMS Retido' },
          },
          {
            name: 'CFOP',
            annotation: {
              label: 'Código Fiscal de Operações e Prestações',
            },
            restriction: { pattern: '[1,2,3,5,6,7]{1}[0-9]{3}' },
          },
          {
            name: 'cMunFG',
            type: 'TCodMunIBGE',
            annotation: {
              label: 'Código do Município de Ocorrência do Fato Gerador',
            },
          },
        ],
      },
      {
        annotation: { label: 'Meio de transporte' },
        optional: true,
        choice: true,
        element: [
          {
            annotation: { label: 'Veículo' },
            element: [
              {
                name: 'veicTransp',
                optional: true,
                annotation: { label: 'Dados do veículo' },
                element: [
                  {
                    name: 'placa',
                    annotation: { label: 'Placa do veículo' },
                    restriction: {
                      pattern:
                        '[A-Z]{2,3}[0-9]{4}|[A-Z]{3,4}[0-9]{3}|[A-Z0-9]{7}',
                    },
                  },
                  {
                    name: 'UF',
                    type: 'TUf',
                    annotation: { label: 'Sigla da UF' },
                  },
                  {
                    name: 'RNTC',
                    optional: true,
                    annotation: {
                      label:
                        'Registro Nacional de Transportador de Carga (ANTT)',
                    },
                    restriction: { minLength: '1', maxLength: '20' },
                  },
                ],
              },
              {
                name: 'reboque',
                optional: true,
                maxOccurs: '5',
                annotation: { label: 'Dados do reboque/Dolly' },
                element: [
                  {
                    name: 'placa',
                    annotation: { label: 'Placa do veículo' },
                    restriction: {
                      pattern:
                        '[A-Z]{2,3}[0-9]{4}|[A-Z]{3,4}[0-9]{3}|[A-Z0-9]{7}',
                    },
                  },
                  {
                    name: 'UF',
                    type: 'TUf',
                    annotation: { label: 'Sigla da UF' },
                  },
                  {
                    name: 'RNTC',
                    optional: true,
                    annotation: {
                      label:
                        'Registro Nacional de Transportador de Carga (ANTT)',
                    },
                    restriction: { minLength: '1', maxLength: '20' },
                  },
                ],
              },
            ],
          },
          {
            name: 'vagao',
            annotation: { label: 'Identificação do vagão' },
            restriction: { minLength: '1', maxLength: '20' },
          },
          {
            name: 'balsa',
            annotation: { label: 'Identificação da balsa' },
            restriction: { minLength: '1', maxLength: '20' },
          },
        ],
      },
      {
        name: 'vol',
        optional: true,
        maxOccurs: '5000',
        annotation: { label: 'Dados dos volumes' },
        element: [
          {
            name: 'qVol',
            optional: true,
            annotation: { label: 'Quantidade de volumes transportados' },
            restriction: { pattern: '[0-9]{1,15}' },
          },
          {
            name: 'esp',
            optional: true,
            annotation: { label: 'Espécie dos volumes transportados' },
            restriction: { minLength: '1', maxLength: '60' },
          },
          {
            name: 'marca',
            optional: true,
            annotation: { label: 'Marca dos volumes transportados' },
            restriction: { minLength: '1', maxLength: '60' },
          },
          {
            name: 'nVol',
            optional: true,
            annotation: { label: 'Numeração dos volumes transportados' },
            restriction: { minLength: '1', maxLength: '60' },
          },
          {
            name: 'pesoL',
            type: 'TDec_1203',
            optional: true,
            annotation: { label: 'Peso líquido (em kg)' },
          },
          {
            name: 'pesoB',
            type: 'TDec_1203',
            optional: true,
            annotation: { label: 'Peso bruto (em kg)' },
          },
          {
            name: 'lacres',
            annotation: { label: 'Lacres' },
            optional: true,
            maxOccurs: '5000',
            element: [
              {
                name: 'nLacre',
                annotation: { label: 'Número dos lacres' },
                restriction: { minLength: '1', maxLength: '60' },
              },
            ],
          },
        ],
      },
    ],
  },
  cobr: {
    name: 'cobr',
    optional: true,
    annotation: { label: 'Dados da cobrança da NF-e' },
    element: [
      {
        name: 'fat',
        optional: true,
        annotation: { label: 'Dados da fatura' },
        element: [
          {
            name: 'nFat',
            optional: true,
            annotation: { label: 'Número da fatura' },
            restriction: { minLength: '1', maxLength: '60' },
          },
          {
            name: 'vOrig',
            type: 'TDec_1302',
            optional: true,
            annotation: { label: 'Valor original da fatura' },
          },
          {
            name: 'vDesc',
            type: 'TDec_1302',
            optional: true,
            annotation: { label: 'Valor do desconto da fatura' },
          },
          {
            name: 'vLiq',
            type: 'TDec_1302',
            optional: true,
            annotation: { label: 'Valor líquido da fatura' },
          },
        ],
      },
      {
        name: 'dup',
        optional: true,
        maxOccurs: '120',
        annotation: { label: 'Dados das duplicatas' },
        element: [
          {
            name: 'nDup',
            optional: true,
            annotation: { label: 'Número da duplicata' },
            restriction: { maxLength: '60', minLength: '1' },
          },
          {
            name: 'dVenc',
            type: 'TData',
            optional: true,
            annotation: { label: 'Data de vencimento da duplicata' },
          },
          {
            name: 'vDup',
            type: 'TDec_1302Opc',
            annotation: { label: 'Valor da duplicata' },
          },
        ],
      },
    ],
  },
  pag: {
    name: 'pag',
    annotation: { label: 'Informações de Pagamento' },
    element: [
      {
        name: 'detPag',
        maxOccurs: '100',
        annotation: { label: 'Detalhamento da forma de pagamento.' },
        element: [
          {
            name: 'indPag',
            optional: true,
            annotation: {
              label: 'Indicador da Forma de Pagamento',
              itens: ['Pagamento à Vista', 'Pagamento à Prazo'],
            },
            restriction: { enumeration: ['0', '1'] },
          },
          {
            annotation: { label: 'Forma de Pagamento' },
            choice: true,
            element: [
              {
                annotation: { label: 'Comum' },
                element: [
                  {
                    name: 'tPag',
                    annotation: {
                      label: 'Forma de Pagamento',
                      itens: [
                        'Dinheiro',
                        'Cheque',
                        'Cartão de crédito',
                        'Cartão de débito',
                        'Crédito Loja',
                        'Vale Alimentação',
                        'Vale Refeição',
                        'Vale Presente',
                        'Vale Combustível',
                        'Duplicata Mercantil',
                        'Boleto Bancario',
                        'Depósito Bancário',
                        'Pagamento Instantâneo (PIX)',
                        'Transferência bancária, Carteira Digital',
                        'Programa de fidelidade, Cashback, Crédito Virtual',
                      ],
                    },
                    restriction: {
                      enumeration: [
                        '01',
                        '02',
                        '03',
                        '04',
                        '05',
                        '10',
                        '11',
                        '12',
                        '13',
                        '14',
                        '15',
                        '16',
                        '17',
                        '18',
                        '19',
                      ],
                    },
                  },
                  {
                    name: 'vPag',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor do Pagamento' },
                  },
                ],
              },
              {
                annotation: { label: 'Sem Pagamento' },
                element: [
                  {
                    name: 'tPag',
                    annotation: {
                      label: 'Forma de Pagamento',
                      itens: ['Sem Pagamento'],
                    },
                    restriction: { enumeration: '90' },
                  },
                ],
              },
              {
                annotation: { label: 'Outros' },
                element: [
                  {
                    name: 'tPag',
                    annotation: {
                      label: 'Forma de Pagamento',
                      itens: ['Outros'],
                    },
                    restriction: { enumeration: '99' },
                  },
                  {
                    name: 'xPag',
                    optional: true,
                    annotation: { label: 'Descrição do Meio de Pagamento' },
                    restriction: { minLength: '2', maxLength: '60' },
                  },
                  {
                    name: 'vPag',
                    type: 'TDec_1302',
                    annotation: { label: 'Valor do Pagamento' },
                  },
                ],
              },
            ],
          },
          {
            name: 'card',
            optional: true,
            annotation: { label: 'Cartões' },
            element: [
              {
                name: 'tpIntegra',
                annotation: {
                  label: 'Tipo de Integração do processo de pagamento',
                  itens: [
                    'Pagamento integrado (TEF ou comércio eletrônico)',
                    'Pagamento não integrado (POS)',
                  ],
                },
                restriction: { enumeration: ['1', '2'] },
              },
              {
                name: 'CNPJ',
                type: 'TCnpj',
                optional: true,
                annotation: { label: 'CNPJ da instituição de pagamento' },
              },
              {
                name: 'tBand',
                optional: true,
                annotation: {
                  label: 'Bandeira da operadora de cartão de crédito/débito',
                  itens: [
                    'Visa',
                    'Mastercard',
                    'American Express',
                    'Sorocred',
                    'Diners Club',
                    'Elo',
                    'Hipercard',
                    'Aura',
                    'Cabal',
                    'Alelo',
                    'Banes Card',
                    'CalCard',
                    'Credz',
                    'Discover',
                    'GoodCard',
                    'GreenCard',
                    'Hiper',
                    'JcB',
                    'Mais',
                    'MaxVan',
                    'Policard',
                    'RedeCompras',
                    'Sodexo',
                    'ValeCard',
                    'Verocheque',
                    'VR',
                    'Ticket',
                    'Outros',
                  ],
                },
                restriction: {
                  enumeration: [
                    '01',
                    '02',
                    '03',
                    '04',
                    '05',
                    '06',
                    '07',
                    '08',
                    '09',
                    '10',
                    '11',
                    '12',
                    '13',
                    '14',
                    '15',
                    '16',
                    '17',
                    '18',
                    '19',
                    '20',
                    '21',
                    '22',
                    '23',
                    '24',
                    '25',
                    '26',
                    '27',
                    '99',
                  ],
                },
              },
              {
                name: 'cAut',
                optional: true,
                annotation: { label: 'Número de autorização da operação' },
                restriction: { minLength: '1', maxLength: '20' },
              },
            ],
          },
        ],
      },
      {
        name: 'vTroco',
        type: 'TDec_1302',
        optional: true,
        annotation: { label: 'Valor do Troco' },
      },
    ],
  },
  infIntermed: {
    name: 'infIntermed',
    optional: true,
    annotation: { label: 'Informações do Intermediador da Transação' },
    element: [
      {
        name: 'CNPJ',
        type: 'TCnpj',
        annotation: {
          label:
            'CNPJ do Intermediador (plataforma de delivery, marketplace...)',
        },
      },
      {
        name: 'idCadIntTran',
        annotation: { label: 'Identificador cadastrado no intermediador' },
        restriction: { minLength: '2', maxLength: '60' },
      },
    ],
  },
  infAdic: {
    name: 'infAdic',
    optional: true,
    annotation: { label: 'Informações adicionais da NF-e' },
    element: [
      {
        name: 'infAdFisco',
        optional: true,
        annotation: {
          label: 'Informações adicionais de interesse do Fisco',
        },
        restriction: { maxLength: '2000', minLength: '1' },
      },
      {
        name: 'infCpl',
        optional: true,
        annotation: {
          label: 'Informações complementares de interesse do Contribuinte',
        },
        restriction: { maxLength: '5000', minLength: '1' },
      },
      {
        name: 'procRef',
        optional: true,
        maxOccurs: '100',
        annotation: { label: 'Informações do  processo referenciado' },
        element: [
          {
            name: 'nProc',
            annotation: {
              label: 'Indentificador do processo ou ato concessório',
            },
            restriction: { minLength: '1', maxLength: '60' },
          },
          {
            name: 'indProc',
            annotation: {
              label: 'Origem do processo',
              itens: [
                'SEFAZ',
                'Justiça Federal',
                'Justiça Estadual',
                'Secex/RFB',
                'Outros',
              ],
            },
            restriction: { enumeration: ['0', '1', '2', '3', '9'] },
          },
        ],
      },
    ],
  },
  exporta: {
    name: 'exporta',
    optional: true,
    annotation: { label: 'Informações de exportação' },
    element: [
      {
        name: 'UFSaidaPais',
        type: 'TUfEmi',
        annotation: {
          label: 'Sigla da UF de Embarque ou de transposição de fronteira',
        },
      },
      {
        name: 'xLocExporta',
        annotation: {
          label: 'Local de Embarque ou de transposição de fronteira',
        },
        restriction: { minLength: '1', maxLength: '60' },
      },
      {
        name: 'xLocDespacho',
        optional: true,
        annotation: { label: 'Descrição do local de despacho' },
        restriction: { minLength: '1', maxLength: '60' },
      },
    ],
  },
  compra: {
    name: 'compra',
    optional: true,
    annotation: { label: 'Informações de compras' },
    element: [
      {
        name: 'xNEmp',
        optional: true,
        annotation: {
          label: 'Informação da Nota de Empenho de compras públicas',
        },
        restriction: { minLength: '1', maxLength: '22' },
      },
      {
        name: 'xPed',
        optional: true,
        annotation: { label: 'Informação do pedido' },
        restriction: { minLength: '1', maxLength: '60' },
      },
      {
        name: 'xCont',
        optional: true,
        annotation: { label: 'Informação do contrato' },
        restriction: { minLength: '1', maxLength: '60' },
      },
    ],
  },
  cana: {
    name: 'cana',
    optional: true,
    annotation: { label: 'Informações de registro aquisições de cana' },
    element: [
      {
        name: 'safra',
        annotation: {
          label: 'Identificação da safra_Formato:AAAA ou AAAA/AAAA',
        },
        restriction: { minLength: '4', maxLength: '9' },
      },
      {
        name: 'ref',
        annotation: { label: 'Mês e Ano de Referência_Formato MM/AAAA' },
        restriction: { pattern: '(0[1-9]|1[0-2])([/][2][0-9][0-9][0-9])' },
      },
      {
        name: 'forDia',
        maxOccurs: '31',
        annotation: { label: 'Fornecimentos diários' },
        element: [
          {
            name: 'dia',
            annotation: { label: 'Número do dia' },
            restriction: { pattern: '[1-9]|[1][0-9]|[2][0-9]|[3][0-1]' },
          },
          {
            name: 'qtde',
            type: 'TDec_1110v',
            annotation: {
              label: 'Quantidade em quilogramas - peso líquido',
            },
          },
        ],
      },
      {
        name: 'qTotMes',
        type: 'TDec_1110v',
        annotation: { label: 'Total do mês' },
      },
      {
        name: 'qTotAnt',
        type: 'TDec_1110v',
        annotation: { label: 'Total Anterior' },
      },
      {
        name: 'qTotGer',
        type: 'TDec_1110v',
        annotation: { label: 'Total Geral' },
      },
      {
        name: 'deduc',
        optional: true,
        maxOccurs: '10',
        annotation: { label: 'Deduções - Taxas e Contribuições' },
        element: [
          {
            name: 'xDed',
            annotation: { label: 'Descrição da Dedução' },
            restriction: { minLength: '1', maxLength: '60' },
          },
          {
            name: 'vDed',
            type: 'TDec_1302',
            annotation: { label: 'valor da dedução' },
          },
        ],
      },
      {
        name: 'vFor',
        type: 'TDec_1302',
        annotation: { label: 'Valor  dos fornecimentos' },
      },
      {
        name: 'vTotDed',
        type: 'TDec_1302',
        annotation: { label: 'Valor Total das Deduções' },
      },
      {
        name: 'vLiqFor',
        type: 'TDec_1302',
        annotation: { label: 'Valor Líquido dos fornecimentos' },
      },
    ],
  },
  infRespTec: {
    name: 'infRespTec',
    optional: true,
    annotation: {
      label: 'Informações do Responsável Técnico pela emissão do DF-e',
    },
    element: [
      { name: 'CNPJ', type: 'TCnpjOpc', annotation: { label: 'CNPJ' } },
      {
        name: 'xContato',
        annotation: {
          label:
            'Nome da pessoa a ser contatada na empresa desenvolvedora do sistema',
        },
        restriction: { maxLength: '60', minLength: '2' },
      },
      {
        name: 'email',
        annotation: {
          label:
            'E-mail da pessoa a ser contatada na empresa desenvolvedora do sistema',
        },
        restriction: { minLength: '6', maxLength: '60' },
      },
      {
        name: 'fone',
        annotation: {
          label:
            'Telefone da pessoa a ser contatada na empresa desenvolvedora do sistema',
        },
        restriction: { pattern: '[0-9]{6,14}' },
      },
    ],
  },
  simpleType: [
    {
      name: 'Torig',
      annotation: {
        label: 'Tipo Origem da mercadoria CST ICMS  origem da mercadoria',
        itens: [
          'Nacional exceto as indicadas nos códigos 3, 4, 5 e 8',
          'Estrangeira - Importação direta',
          'Estrangeira - Adquirida no mercado interno',
          'Nacional, conteudo superior 40% e inferior ou igual a 70%',
          'Nacional, processos produtivos básicos',
          'Nacional, conteudo inferior 40%',
          'Estrangeira - Importação direta, com similar nacional, lista CAMEX',
          'Estrangeira - mercado interno, sem simular,lista CAMEX',
          'Nacional, Conteúdo de Importação superior a 70%',
        ],
      },
      restriction: {
        enumeration: ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
      },
    },
    {
      name: 'TCodUfIBGE',
      annotation: { label: 'Tipo Código da UF da tabela do IBGE' },
      restriction: {
        enumeration: [
          '11',
          '12',
          '13',
          '14',
          '15',
          '16',
          '17',
          '21',
          '22',
          '23',
          '24',
          '25',
          '26',
          '27',
          '28',
          '29',
          '31',
          '32',
          '33',
          '35',
          '41',
          '42',
          '43',
          '50',
          '51',
          '52',
          '53',
        ],
      },
    },
    {
      name: 'TCodMunIBGE',
      annotation: { label: 'Tipo Código do Município da tabela do IBGE' },
      restriction: { pattern: '[0-9]{7}' },
    },
    {
      name: 'TChNFe',
      annotation: { label: 'Tipo Chave da Nota Fiscal Eletrônica' },
      restriction: { maxLength: '44', pattern: '[0-9]{44}' },
    },
    {
      name: 'TCnpj',
      annotation: { label: 'Tipo Número do CNPJ' },
      restriction: { maxLength: '14', pattern: '[0-9]{14}' },
    },
    {
      name: 'TCnpjOpc',
      annotation: { label: 'Tipo Número do CNPJ Opcional' },
      restriction: { maxLength: '14', pattern: '[0-9]{0}|[0-9]{14}' },
    },
    {
      name: 'TCpf',
      annotation: { label: 'Tipo Número do CPF' },
      restriction: { maxLength: '11', pattern: '[0-9]{11}' },
    },
    {
      name: 'TDec_0302a04',
      annotation: {
        label:
          'Tipo Decimal com até 3 dígitos inteiros, podendo ter de 2 até 4 decimais',
      },
      restriction: {
        decimal: 4,
        pattern: '0|0\\.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(\\.[0-9]{2,4})?',
      },
    },
    {
      name: 'TDec_0302a04Opc',
      annotation: {
        label:
          'Tipo Decimal com até 3 dígitos inteiros e 2 até 4 decimais. Utilizados em TAGs opcionais, não aceita valor zero.',
      },
      restriction: {
        decimal: 4,
        pattern: '0\\.[0-9]{2,4}|[1-9]{1}[0-9]{0,2}(\\.[0-9]{2,4})?',
      },
    },
    {
      name: 'TDec_0302a04Max100',
      annotation: {
        label:
          'Tipo Decimal com 3 inteiros (no máximo 100), com até 4 decimais',
      },
      restriction: {
        decimal: 4,
        pattern:
          '0(\\.[0-9]{2,4})?|[1-9]{1}[0-9]{0,1}(\\.[0-9]{2,4})?|100(\\.0{2,4})?',
      },
    },
    {
      name: 'TDec_1104',
      annotation: {
        label: 'Tipo Decimal com 11 inteiros, podendo ter 4 decimais',
      },
      restriction: {
        decimal: 4,
        pattern: '0|0\\.[0-9]{4}|[1-9]{1}[0-9]{0,10}(\\.[0-9]{4})?',
      },
    },
    {
      name: 'TDec_1104v',
      annotation: {
        label: 'Tipo Decimal com 11 inteiros, podendo ter de 1 até 4 decimais',
      },
      restriction: {
        decimal: 4,
        pattern:
          '0|0\\.[0-9]{1,4}|[1-9]{1}[0-9]{0,10}|[1-9]{1}[0-9]{0,10}(\\.[0-9]{1,4})?',
      },
    },
    {
      name: 'TDec_1110v',
      annotation: {
        label: 'Tipo Decimal com 11 inteiros, podendo ter de 1 até 10 decimais',
      },
      restriction: {
        decimal: 10,
        pattern:
          '0|0\\.[0-9]{1,10}|[1-9]{1}[0-9]{0,10}|[1-9]{1}[0-9]{0,10}(\\.[0-9]{1,10})?',
      },
    },
    {
      name: 'TDec_1203',
      annotation: {
        label: 'Tipo Decimal com 12 inteiros, podendo ter  3 decimais',
      },
      restriction: {
        decimal: 3,
        pattern: '0|0\\.[0-9]{3}|[1-9]{1}[0-9]{0,11}(\\.[0-9]{3})?',
      },
    },
    {
      name: 'TDec_1204',
      annotation: { label: 'Tipo Decimal com 12 inteiros e 4 decimais' },
      restriction: {
        decimal: 4,
        pattern:
          '0|0\\.[0-9]{1,4}|[1-9]{1}[0-9]{0,11}|[1-9]{1}[0-9]{0,11}(\\.[0-9]{4})?',
      },
    },
    {
      name: 'TDec_1204v',
      annotation: {
        label: 'Tipo Decimal com 12 inteiros de 1 até 4 decimais',
      },
      restriction: {
        decimal: 4,
        pattern:
          '0|0\\.[0-9]{1,4}|[1-9]{1}[0-9]{0,11}|[1-9]{1}[0-9]{0,11}(\\.[0-9]{1,4})?',
      },
    },
    {
      name: 'TDec_1302',
      annotation: {
        label: 'Tipo Decimal com 15 dígitos, sendo 13 de corpo e 2 decimais',
      },
      restriction: {
        decimal: 2,
        pattern: '0|0\\.[0-9]{2}|[1-9]{1}[0-9]{0,12}(\\.[0-9]{2})?',
      },
    },
    {
      name: 'TDec_1302Opc',
      annotation: {
        label:
          'Tipo Decimal com 15 dígitos, sendo 13 de corpo e 2 decimais, utilizado em tags opcionais',
      },
      restriction: {
        decimal: 2,
        pattern:
          '0\\.[0-9]{1}[1-9]{1}|0\\.[1-9]{1}[0-9]{1}|[1-9]{1}[0-9]{0,12}(\\.[0-9]{2})?',
      },
    },
    {
      name: 'TIeDest',
      annotation: {
        label:
          'Tipo Inscrição Estadual do Destinatário // alterado para aceitar vazio ou ISENTO - maio/2010 v2.0',
      },
      restriction: { maxLength: '14', pattern: 'ISENTO|[0-9]{2,14}' },
    },
    {
      name: 'TIe',
      annotation: {
        label:
          'Tipo Inscrição Estadual do Emitente // alterado EM 24/10/08 para aceitar ISENTO',
      },
      restriction: { maxLength: '14', pattern: '[0-9]{2,14}|ISENTO' },
    },
    {
      name: 'TNF',
      annotation: { label: 'Tipo Número do Documento Fiscal' },
      restriction: { pattern: '[1-9]{1}[0-9]{0,8}' },
    },
    {
      name: 'TSerie',
      annotation: { label: 'Tipo Série do Documento Fiscal' },
      restriction: { pattern: '0|[1-9]{1}[0-9]{0,2}' },
    },
    {
      name: 'TUf',
      annotation: { label: 'Tipo Sigla da UF' },
      restriction: {
        enumeration: [
          'AC',
          'AL',
          'AM',
          'AP',
          'BA',
          'CE',
          'DF',
          'ES',
          'GO',
          'MA',
          'MG',
          'MS',
          'MT',
          'PA',
          'PB',
          'PE',
          'PI',
          'PR',
          'RJ',
          'RN',
          'RO',
          'RR',
          'RS',
          'SC',
          'SE',
          'SP',
          'TO',
          'EX',
        ],
      },
    },
    {
      name: 'TUfEmi',
      annotation: {
        label: 'Tipo Sigla da UF de emissor // acrescentado em 24/10/08',
      },
      restriction: {
        enumeration: [
          'AC',
          'AL',
          'AM',
          'AP',
          'BA',
          'CE',
          'DF',
          'ES',
          'GO',
          'MA',
          'MG',
          'MS',
          'MT',
          'PA',
          'PB',
          'PE',
          'PI',
          'PR',
          'RJ',
          'RN',
          'RO',
          'RR',
          'RS',
          'SC',
          'SE',
          'SP',
          'TO',
        ],
      },
    },
    {
      name: 'TData',
      annotation: { label: 'Tipo data AAAA-MM-DD' },
      restriction: {
        pattern:
          '(((20(([02468][048])|([13579][26]))-02-29))|(20[0-9][0-9])-((((0[1-9])|(1[0-2]))-((0[1-9])|(1\\d)|(2[0-8])))|((((0[13578])|(1[02]))-31)|(((0[1,3-9])|(1[0-2]))-(29|30)))))',
      },
    },
    {
      name: 'TDateTimeUTC',
      annotation: {
        label:
          'Data e Hora, formato UTC (AAAA-MM-DDThh:mm:ssTZD, onde TZD = +hh:mm ou -hh:mm)',
      },
      restriction: {
        pattern:
          '(((20(([02468][048])|([13579][26]))-02-29))|(20[0-9][0-9])-((((0[1-9])|(1[0-2]))-((0[1-9])|(1\\d)|(2[0-8])))|((((0[13578])|(1[02]))-31)|(((0[1,3-9])|(1[0-2]))-(29|30)))))T(20|21|22|23|[0-1]\\d):[0-5]\\d:[0-5]\\d([\\-,\\+](0[0-9]|10|11):00|([\\+](12):00))',
      },
    },
  ],
}
