export interface IElement {
  name: string
  maxOccurs?: number
  decimal?: number
  element?: IElement[]
}

const elements: IElement[] = [
  {
    name: 'ide',
    element: [
      { name: 'cUF' },
      { name: 'cNF' },
      { name: 'natOp' },
      { name: 'mod' },
      { name: 'serie' },
      { name: 'nNF' },
      { name: 'dhEmi' },
      { name: 'dhSaiEnt' },
      { name: 'tpNF' },
      { name: 'idDest' },
      { name: 'cMunFG' },
      { name: 'tpImp' },
      { name: 'tpEmis' },
      { name: 'cDV' },
      { name: 'tpAmb' },
      { name: 'finNFe' },
      { name: 'indFinal' },
      { name: 'indPres' },
      { name: 'indIntermed' },
      { name: 'procEmi' },
      { name: 'verProc' },
      {
        name: 'NFref',
        maxOccurs: 500,
        element: [
          { name: 'refNFe' },
          {
            name: 'refNF',
            element: [
              { name: 'cUF' },
              { name: 'AAMM' },
              { name: 'CNPJ' },
              { name: 'mod' },
              { name: 'serie' },
              { name: 'nNF' },
            ],
          },
          {
            name: 'refNFP',
            element: [
              { name: 'cUF' },
              { name: 'AAMM' },
              { name: 'IE' },
              { name: 'mod' },
              { name: 'serie' },
              { name: 'nNF' },
              { name: 'CNPJ' },
              { name: 'CPF' },
            ],
          },
          { name: 'refCTe' },
          {
            name: 'refECF',
            element: [{ name: 'mod' }, { name: 'nECF' }, { name: 'nCOO' }],
          },
        ],
      },
    ],
  },
  {
    name: 'emit',
    element: [
      { name: 'CNPJ' },
      { name: 'xNome' },
      { name: 'xFant' },
      {
        name: 'enderEmit',
        element: [
          { name: 'xLgr' },
          { name: 'nro' },
          { name: 'xCpl' },
          { name: 'xBairro' },
          { name: 'cMun' },
          { name: 'xMun' },
          { name: 'UF' },
          { name: 'CEP' },
          { name: 'cPais' },
          { name: 'xPais' },
          { name: 'fone' },
        ],
      },
      { name: 'IE' },
      { name: 'IEST' },
      { name: 'IM' },
      { name: 'CNAE' },
      { name: 'CRT' },
    ],
  },
  {
    name: 'dest',
    element: [
      { name: 'CPF' },
      { name: 'CNPJ' },
      { name: 'idEstrangeiro' },
      { name: 'xNome' },
      {
        name: 'enderDest',
        element: [
          { name: 'xLgr' },
          { name: 'nro' },
          { name: 'xCpl' },
          { name: 'xBairro' },
          { name: 'cMun' },
          { name: 'xMun' },
          { name: 'UF' },
          { name: 'CEP' },
          { name: 'cPais' },
          { name: 'xPais' },
          { name: 'fone' },
        ],
      },
      { name: 'indIEDest' },
      { name: 'IE' },
      { name: 'ISUF' },
      { name: 'IM' },
      { name: 'email' },
    ],
  },
  {
    name: 'retirada',
    element: [
      { name: 'CNPJ' },
      { name: 'CPF' },
      { name: 'xNome' },
      { name: 'xLgr' },
      { name: 'nro' },
      { name: 'xCpl' },
      { name: 'xBairro' },
      { name: 'cMun' },
      { name: 'xMun' },
      { name: 'UF' },
      { name: 'CEP' },
      { name: 'cPais' },
      { name: 'xPais' },
      { name: 'fone' },
      { name: 'email' },
      { name: 'IE' },
    ],
  },
  {
    name: 'entrega',
    element: [
      { name: 'CNPJ' },
      { name: 'CPF' },
      { name: 'xNome' },
      { name: 'xLgr' },
      { name: 'nro' },
      { name: 'xCpl' },
      { name: 'xBairro' },
      { name: 'cMun' },
      { name: 'xMun' },
      { name: 'UF' },
      { name: 'CEP' },
      { name: 'cPais' },
      { name: 'xPais' },
      { name: 'fone' },
      { name: 'email' },
      { name: 'IE' },
    ],
  },
  {
    name: 'autXML',
    maxOccurs: 10,
    element: [{ name: 'CNPJ' }, { name: 'CPF' }],
  },
  {
    name: 'det',
    maxOccurs: 990,
    element: [
      { name: 'nItem' },
      {
        name: 'prod',
        element: [
          { name: 'cProd' },
          { name: 'cEAN' },
          { name: 'xProd' },
          { name: 'NCM' },
          { name: 'NVE', maxOccurs: 8 },
          { name: 'CEST' },
          { name: 'indEscala' },
          { name: 'CNPJFab' },
          { name: 'cBenef' },
          { name: 'EXTIPI' },
          { name: 'CFOP' },
          { name: 'uCom' },
          { name: 'qCom', decimal: 4 },
          { name: 'vUnCom', decimal: 10 },
          { name: 'vProd' },
          { name: 'cEANTrib' },
          { name: 'uTrib' },
          { name: 'qTrib', decimal: 4 },
          { name: 'vUnTrib', decimal: 10 },
          { name: 'vFrete', decimal: 2 },
          { name: 'vSeg', decimal: 2 },
          { name: 'vDesc', decimal: 2 },
          { name: 'vOutro', decimal: 2 },
          { name: 'indTot' },
          {
            name: 'DI',
            maxOccurs: 100,
            element: [
              { name: 'nDI' },
              { name: 'dDI' },
              { name: 'xLocDesemb' },
              { name: 'UFDesemb' },
              { name: 'dDesemb' },
              { name: 'tpViaTransp' },
              { name: 'vAFRMM', decimal: 2 },
              { name: 'tpIntermedio' },
              { name: 'CNPJ' },
              { name: 'UFTerceiro' },
              { name: 'cExportador' },
              {
                name: 'adi',
                maxOccurs: 100,
                element: [
                  { name: 'nAdicao' },
                  { name: 'nSeqAdic' },
                  { name: 'cFabricante' },
                  { name: 'vDescDI', decimal: 2 },
                  { name: 'nDraw' },
                ],
              },
            ],
          },
          {
            name: 'detExport',
            maxOccurs: 500,
            element: [
              { name: 'nDraw' },
              {
                name: 'exportInd',
                element: [
                  { name: 'nRE' },
                  { name: 'chNFe' },
                  { name: 'qExport', decimal: 4 },
                ],
              },
            ],
          },
          { name: 'xPed' },
          { name: 'nItemPed' },
          { name: 'nFCI' },
          {
            name: 'rastro',
            maxOccurs: 500,
            element: [
              { name: 'nLote' },
              { name: 'qLote' },
              { name: 'dFab' },
              { name: 'dVal' },
              { name: 'cAgreg' },
            ],
          },
          {
            name: 'veicProd',
            element: [
              { name: 'tpOp' },
              { name: 'chassi' },
              { name: 'cCor' },
              { name: 'xCor' },
              { name: 'pot' },
              { name: 'cilin' },
              { name: 'pesoL' },
              { name: 'pesoB' },
              { name: 'nSerie' },
              { name: 'tpComb' },
              { name: 'nMotor' },
              { name: 'CMT' },
              { name: 'dist' },
              { name: 'anoMod' },
              { name: 'anoFab' },
              { name: 'tpPint' },
              { name: 'tpVeic' },
              { name: 'espVeic' },
              { name: 'VIN' },
              { name: 'condVeic' },
              { name: 'cMod' },
              { name: 'cCorDENATRAN' },
              { name: 'lota' },
              { name: 'tpRest' },
            ],
          },
          {
            name: 'med',
            element: [
              { name: 'cProdANVISA' },
              { name: 'xMotivoIsencao' },
              { name: 'vPMC', decimal: 2 },
            ],
          },
          {
            name: 'arma',
            maxOccurs: 500,
            element: [
              { name: 'tpArma' },
              { name: 'nSerie' },
              { name: 'nCano' },
              { name: 'descr' },
            ],
          },
          {
            name: 'comb',
            element: [
              { name: 'cProdANP' },
              { name: 'descANP' },
              { name: 'pGLP', decimal: 4 },
              { name: 'pGNn', decimal: 4 },
              { name: 'pGNi', decimal: 4 },
              { name: 'vPart', decimal: 2 },
              { name: 'CODIF' },
              { name: 'qTemp' },
              { name: 'UFCons' },
              {
                name: 'CIDE',
                element: [
                  { name: 'qBCProd', decimal: 4 },
                  { name: 'vAliqProd', decimal: 4 },
                  { name: 'vCIDE', decimal: 2 },
                ],
              },
              {
                name: 'encerrante',
                element: [
                  { name: 'nBico' },
                  { name: 'nBomba' },
                  { name: 'nTanque' },
                  { name: 'vEncIni', decimal: 3 },
                  { name: 'vEncFin', decimal: 3 },
                ],
              },
            ],
          },
          { name: 'nRECOPI' },
        ],
      },
      {
        name: 'imposto',
        element: [
          { name: 'vTotTrib', decimal: 2 },
          {
            name: 'ICMS',
            element: [
              {
                name: 'ICMS00',
                element: [
                  { name: 'orig' },
                  { name: 'CST' },
                  { name: 'modBC' },
                  { name: 'vBC', decimal: 2 },
                  { name: 'pICMS', decimal: 4 },
                  { name: 'vICMS', decimal: 2 },
                  { name: 'pFCP', decimal: 4 },
                  { name: 'vFCP', decimal: 2 },
                ],
              },
              {
                name: 'ICMS10',
                element: [
                  { name: 'orig' },
                  { name: 'CST' },
                  { name: 'modBC' },
                  { name: 'vBC', decimal: 2 },
                  { name: 'pICMS', decimal: 4 },
                  { name: 'vICMS', decimal: 2 },
                  { name: 'vBCFCP', decimal: 2 },
                  { name: 'pFCP', decimal: 4 },
                  { name: 'vFCP', decimal: 2 },
                  { name: 'modBCST' },
                  { name: 'pMVAST', decimal: 4 },
                  { name: 'pRedBCST', decimal: 4 },
                  { name: 'vBCST', decimal: 2 },
                  { name: 'pICMSST', decimal: 4 },
                  { name: 'vICMSST', decimal: 2 },
                  { name: 'vBCFCPST', decimal: 2 },
                  { name: 'pFCPST', decimal: 4 },
                  { name: 'vFCPST', decimal: 2 },
                ],
              },
              {
                name: 'ICMS20',
                element: [
                  { name: 'orig' },
                  { name: 'CST' },
                  { name: 'modBC' },
                  { name: 'pRedBC', decimal: 4 },
                  { name: 'vBC', decimal: 2 },
                  { name: 'pICMS', decimal: 4 },
                  { name: 'vICMS', decimal: 2 },
                  { name: 'vBCFCP', decimal: 2 },
                  { name: 'pFCP', decimal: 4 },
                  { name: 'vFCP', decimal: 2 },
                  { name: 'vICMSDeson', decimal: 2 },
                  { name: 'motDesICMS' },
                ],
              },
              {
                name: 'ICMS30',
                element: [
                  { name: 'orig' },
                  { name: 'CST' },
                  { name: 'modBCST' },
                  { name: 'pMVAST', decimal: 4 },
                  { name: 'pRedBCST', decimal: 4 },
                  { name: 'vBCST', decimal: 2 },
                  { name: 'pICMSST', decimal: 4 },
                  { name: 'vICMSST', decimal: 2 },
                  { name: 'vBCFCPST', decimal: 2 },
                  { name: 'pFCPST', decimal: 4 },
                  { name: 'vFCPST', decimal: 2 },
                  { name: 'vICMSDeson', decimal: 2 },
                  { name: 'motDesICMS' },
                ],
              },
              {
                name: 'ICMS40',
                element: [
                  { name: 'orig' },
                  { name: 'CST' },
                  { name: 'vICMSDeson', decimal: 2 },
                  { name: 'motDesICMS' },
                ],
              },
              {
                name: 'ICMS51',
                element: [
                  { name: 'orig' },
                  { name: 'CST' },
                  { name: 'modBC' },
                  { name: 'pRedBC', decimal: 4 },
                  { name: 'vBC', decimal: 2 },
                  { name: 'pICMS', decimal: 4 },
                  { name: 'vICMSOp', decimal: 2 },
                  { name: 'pDif', decimal: 4 },
                  { name: 'vICMSDif', decimal: 2 },
                  { name: 'vICMS', decimal: 2 },
                  { name: 'vBCFCP', decimal: 2 },
                  { name: 'pFCP', decimal: 4 },
                  { name: 'vFCP', decimal: 2 },
                ],
              },
              {
                name: 'ICMS60',
                element: [
                  { name: 'orig' },
                  { name: 'CST' },
                  { name: 'vBCSTRet', decimal: 2 },
                  { name: 'pST', decimal: 4 },
                  { name: 'vICMSSubstituto', decimal: 2 },
                  { name: 'vICMSSTRet', decimal: 2 },
                  { name: 'vBCFCPSTRet', decimal: 2 },
                  { name: 'pFCPSTRet', decimal: 4 },
                  { name: 'vFCPSTRet', decimal: 2 },
                  { name: 'pRedBCEfet', decimal: 4 },
                  { name: 'vBCEfet', decimal: 2 },
                  { name: 'pICMSEfet', decimal: 4 },
                  { name: 'vICMSEfet', decimal: 2 },
                ],
              },
              {
                name: 'ICMS70',
                element: [
                  { name: 'orig' },
                  { name: 'CST' },
                  { name: 'modBC' },
                  { name: 'pRedBC', decimal: 4 },
                  { name: 'vBC', decimal: 2 },
                  { name: 'pICMS', decimal: 4 },
                  { name: 'vICMS', decimal: 2 },
                  { name: 'vBCFCP', decimal: 2 },
                  { name: 'pFCP', decimal: 4 },
                  { name: 'vFCP', decimal: 2 },
                  { name: 'modBCST' },
                  { name: 'pMVAST', decimal: 4 },
                  { name: 'pRedBCST', decimal: 4 },
                  { name: 'vBCST', decimal: 2 },
                  { name: 'pICMSST', decimal: 4 },
                  { name: 'vICMSST', decimal: 2 },
                  { name: 'vBCFCPST', decimal: 2 },
                  { name: 'pFCPST', decimal: 4 },
                  { name: 'vFCPST', decimal: 2 },
                  { name: 'vICMSDeson', decimal: 2 },
                  { name: 'motDesICMS' },
                ],
              },
              {
                name: 'ICMS90',
                element: [
                  { name: 'orig' },
                  { name: 'CST' },
                  { name: 'modBC' },
                  { name: 'vBC', decimal: 2 },
                  { name: 'pRedBC', decimal: 4 },
                  { name: 'pICMS', decimal: 4 },
                  { name: 'vICMS', decimal: 2 },
                  { name: 'vBCFCP', decimal: 2 },
                  { name: 'pFCP', decimal: 4 },
                  { name: 'vFCP', decimal: 2 },
                  { name: 'modBCST' },
                  { name: 'pMVAST', decimal: 4 },
                  { name: 'pRedBCST', decimal: 4 },
                  { name: 'vBCST', decimal: 2 },
                  { name: 'pICMSST', decimal: 4 },
                  { name: 'vICMSST', decimal: 2 },
                  { name: 'vBCFCPST', decimal: 2 },
                  { name: 'pFCPST', decimal: 4 },
                  { name: 'vFCPST', decimal: 2 },
                  { name: 'vICMSDeson', decimal: 2 },
                  { name: 'motDesICMS' },
                ],
              },
              {
                name: 'ICMSPart',
                element: [
                  { name: 'orig' },
                  { name: 'CST' },
                  { name: 'modBC' },
                  { name: 'vBC', decimal: 2 },
                  { name: 'pRedBC', decimal: 4 },
                  { name: 'pICMS', decimal: 4 },
                  { name: 'vICMS', decimal: 2 },
                  { name: 'modBCST' },
                  { name: 'pMVAST', decimal: 4 },
                  { name: 'pRedBCST', decimal: 4 },
                  { name: 'vBCST', decimal: 2 },
                  { name: 'pICMSST', decimal: 4 },
                  { name: 'vICMSST', decimal: 2 },
                  { name: 'pBCOp', decimal: 4 },
                  { name: 'UFST' },
                ],
              },
              {
                name: 'ICMSST',
                element: [
                  { name: 'orig' },
                  { name: 'CST' },
                  { name: 'vBCSTRet', decimal: 2 },
                  { name: 'pST', decimal: 4 },
                  { name: 'vICMSSubstituto', decimal: 2 },
                  { name: 'vICMSSTRet', decimal: 2 },
                  { name: 'vBCFCPSTRet', decimal: 2 },
                  { name: 'pFCPSTRet', decimal: 4 },
                  { name: 'vFCPSTRet', decimal: 2 },
                  { name: 'vBCSTDest', decimal: 2 },
                  { name: 'vICMSSTDest', decimal: 2 },
                  { name: 'pRedBCEfet', decimal: 4 },
                  { name: 'vBCEfet', decimal: 2 },
                  { name: 'pICMSEfet', decimal: 4 },
                  { name: 'vICMSEfet', decimal: 2 },
                ],
              },
              {
                name: 'ICMSSN101',
                element: [
                  { name: 'orig' },
                  { name: 'CSOSN' },
                  { name: 'pCredSN', decimal: 4 },
                  { name: 'vCredICMSSN', decimal: 2 },
                ],
              },
              {
                name: 'ICMSSN102',
                element: [{ name: 'orig' }, { name: 'CSOSN' }],
              },
              {
                name: 'ICMSSN201',
                element: [
                  { name: 'orig' },
                  { name: 'CSOSN' },
                  { name: 'modBCST' },
                  { name: 'pMVAST', decimal: 4 },
                  { name: 'pRedBCST', decimal: 4 },
                  { name: 'vBCST', decimal: 2 },
                  { name: 'pICMSST', decimal: 4 },
                  { name: 'vICMSST', decimal: 2 },
                  { name: 'vBCFCPST', decimal: 2 },
                  { name: 'pFCPST', decimal: 4 },
                  { name: 'vFCPST', decimal: 2 },
                  { name: 'pCredSN', decimal: 4 },
                  { name: 'vCredICMSSN', decimal: 2 },
                ],
              },
              {
                name: 'ICMSSN202',
                element: [
                  { name: 'orig' },
                  { name: 'CSOSN' },
                  { name: 'modBCST' },
                  { name: 'pMVAST', decimal: 4 },
                  { name: 'pRedBCST', decimal: 4 },
                  { name: 'vBCST', decimal: 2 },
                  { name: 'pICMSST', decimal: 4 },
                  { name: 'vICMSST', decimal: 2 },
                  { name: 'vBCFCPST', decimal: 2 },
                  { name: 'pFCPST', decimal: 4 },
                  { name: 'vFCPST', decimal: 2 },
                ],
              },
              {
                name: 'ICMSSN500',
                element: [
                  { name: 'orig' },
                  { name: 'CSOSN' },
                  { name: 'vBCSTRet', decimal: 2 },
                  { name: 'pST', decimal: 4 },
                  { name: 'vICMSSubstituto', decimal: 2 },
                  { name: 'vICMSSTRet', decimal: 2 },
                  { name: 'vBCFCPSTRet', decimal: 2 },
                  { name: 'pFCPSTRet', decimal: 4 },
                  { name: 'vFCPSTRet', decimal: 2 },
                  { name: 'pRedBCEfet', decimal: 4 },
                  { name: 'vBCEfet', decimal: 2 },
                  { name: 'pICMSEfet', decimal: 4 },
                  { name: 'vICMSEfet', decimal: 2 },
                ],
              },
              {
                name: 'ICMSSN900',
                element: [
                  { name: 'orig' },
                  { name: 'CSOSN' },
                  { name: 'modBC' },
                  { name: 'vBC', decimal: 2 },
                  { name: 'pRedBC', decimal: 4 },
                  { name: 'pICMS', decimal: 4 },
                  { name: 'vICMS', decimal: 2 },
                  { name: 'modBCST' },
                  { name: 'pMVAST', decimal: 4 },
                  { name: 'pRedBCST', decimal: 4 },
                  { name: 'vBCST', decimal: 2 },
                  { name: 'pICMSST', decimal: 4 },
                  { name: 'vICMSST', decimal: 2 },
                  { name: 'vBCFCPST', decimal: 2 },
                  { name: 'pFCPST', decimal: 4 },
                  { name: 'vFCPST', decimal: 2 },
                  { name: 'pCredSN', decimal: 4 },
                  { name: 'vCredICMSSN', decimal: 2 },
                ],
              },
            ],
          },
          {
            name: 'ICMSUFDest',
            element: [
              { name: 'vBCUFDest', decimal: 2 },
              { name: 'vBCFCPUFDest', decimal: 2 },
              { name: 'pFCPUFDest', decimal: 4 },
              { name: 'pICMSUFDest', decimal: 4 },
              { name: 'pICMSInter' },
              { name: 'pICMSInterPart' },
              { name: 'vFCPUFDest', decimal: 2 },
              { name: 'vICMSUFDest', decimal: 2 },
              { name: 'vICMSUFRemet' },
            ],
          },
          {
            name: 'IPI',
            element: [
              { name: 'CNPJProd' },
              { name: 'cSelo' },
              { name: 'qSelo' },
              { name: 'cEnq' },
              {
                name: 'IPITrib',
                element: [
                  { name: 'CST' },
                  { name: 'vBC', decimal: 2 },
                  { name: 'pIPI', decimal: 4 },
                  { name: 'qUnid', decimal: 4 },
                  { name: 'vUnid', decimal: 4 },
                  { name: 'vIPI', decimal: 2 },
                ],
              },
              { name: 'IPINT', element: [{ name: 'CST' }] },
            ],
          },
          {
            name: 'II',
            element: [
              { name: 'vBC', decimal: 2 },
              { name: 'vDespAdu', decimal: 2 },
              { name: 'vII', decimal: 2 },
              { name: 'vIOF', decimal: 2 },
            ],
          },
          {
            name: 'PIS',
            element: [
              {
                name: 'PISAliq',
                element: [
                  { name: 'CST' },
                  { name: 'vBC', decimal: 2 },
                  { name: 'pPIS', decimal: 4 },
                  { name: 'vPIS', decimal: 2 },
                ],
              },
              {
                name: 'PISQtde',
                element: [
                  { name: 'CST' },
                  { name: 'qBCProd', decimal: 4 },
                  { name: 'vAliqProd', decimal: 4 },
                  { name: 'vPIS', decimal: 2 },
                ],
              },
              { name: 'PISNT', element: [{ name: 'CST' }] },
              {
                name: 'PISOutr',
                element: [
                  { name: 'CST' },
                  { name: 'vBC', decimal: 2 },
                  { name: 'pPIS', decimal: 4 },
                  { name: 'qBCProd', decimal: 4 },
                  { name: 'vAliqProd', decimal: 4 },
                  { name: 'vPIS', decimal: 2 },
                ],
              },
            ],
          },
          {
            name: 'PISST',
            element: [
              { name: 'vBC', decimal: 2 },
              { name: 'pPIS', decimal: 4 },
              { name: 'qBCProd', decimal: 4 },
              { name: 'vAliqProd', decimal: 4 },
              { name: 'vPIS', decimal: 2 },
            ],
          },
          {
            name: 'COFINS',
            element: [
              {
                name: 'COFINSAliq',
                element: [
                  { name: 'CST' },
                  { name: 'vBC', decimal: 2 },
                  { name: 'pCOFINS', decimal: 4 },
                  { name: 'vCOFINS', decimal: 2 },
                ],
              },
              {
                name: 'COFINSQtde',
                element: [
                  { name: 'CST' },
                  { name: 'qBCProd', decimal: 4 },
                  { name: 'vAliqProd', decimal: 4 },
                  { name: 'vCOFINS', decimal: 2 },
                ],
              },
              { name: 'COFINSNT', element: [{ name: 'CST' }] },
              {
                name: 'COFINSOutr',
                element: [
                  { name: 'CST' },
                  { name: 'vBC', decimal: 2 },
                  { name: 'pCOFINS', decimal: 4 },
                  { name: 'qBCProd', decimal: 4 },
                  { name: 'vAliqProd', decimal: 4 },
                  { name: 'vCOFINS', decimal: 2 },
                ],
              },
            ],
          },
          {
            name: 'COFINSST',
            element: [
              { name: 'vBC', decimal: 2 },
              { name: 'pCOFINS', decimal: 4 },
              { name: 'qBCProd', decimal: 4 },
              { name: 'vAliqProd', decimal: 4 },
              { name: 'vCOFINS', decimal: 2 },
            ],
          },
          {
            name: 'ISSQN',
            element: [
              { name: 'vBC', decimal: 2 },
              { name: 'vAliq', decimal: 4 },
              { name: 'vISSQN', decimal: 2 },
              { name: 'cMunFG' },
              { name: 'cListServ' },
              { name: 'vDeducao', decimal: 2 },
              { name: 'vOutro', decimal: 2 },
              { name: 'vDescIncond', decimal: 2 },
              { name: 'vDescCond', decimal: 2 },
              { name: 'vISSRet', decimal: 2 },
              { name: 'indISS' },
              { name: 'cServico' },
              { name: 'cMun' },
              { name: 'nProcesso' },
              { name: 'indIncentivo' },
            ],
          },
        ],
      },
      {
        name: 'impostoDevol',
        element: [
          { name: 'pDevol' },
          { name: 'IPI', element: [{ name: 'vIPIDevol', decimal: 2 }] },
        ],
      },
      { name: 'infAdProd' },
    ],
  },
  {
    name: 'total',
    element: [
      {
        name: 'ICMSTot',
        element: [
          { name: 'vBC', decimal: 2 },
          { name: 'vICMS', decimal: 2 },
          { name: 'vICMSDeson', decimal: 2 },
          { name: 'vFCPUFDest', decimal: 2 },
          { name: 'vICMSUFDest', decimal: 2 },
          { name: 'vICMSUFRemet', decimal: 2 },
          { name: 'vFCP', decimal: 2 },
          { name: 'vBCST', decimal: 2 },
          { name: 'vST', decimal: 2 },
          { name: 'vFCPST', decimal: 2 },
          { name: 'vFCPSTRet', decimal: 2 },
          { name: 'vProd', decimal: 2 },
          { name: 'vFrete', decimal: 2 },
          { name: 'vSeg', decimal: 2 },
          { name: 'vDesc', decimal: 2 },
          { name: 'vII', decimal: 2 },
          { name: 'vIPI', decimal: 2 },
          { name: 'vIPIDevol', decimal: 2 },
          { name: 'vPIS', decimal: 2 },
          { name: 'vCOFINS', decimal: 2 },
          { name: 'vOutro', decimal: 2 },
          { name: 'vNF', decimal: 2 },
          { name: 'vTotTrib', decimal: 2 },
        ],
      },
      {
        name: 'ISSQNtot',
        element: [
          { name: 'vServ', decimal: 2 },
          { name: 'vBC', decimal: 2 },
          { name: 'vISS', decimal: 2 },
          { name: 'vPIS', decimal: 2 },
          { name: 'vCOFINS', decimal: 2 },
          { name: 'dCompet' },
          { name: 'vDeducao', decimal: 2 },
          { name: 'vOutro', decimal: 2 },
          { name: 'vDescIncond', decimal: 2 },
          { name: 'vDescCond', decimal: 2 },
          { name: 'vISSRet', decimal: 2 },
          { name: 'cRegTrib' },
        ],
      },
      {
        name: 'retTrib',
        element: [
          { name: 'vRetPIS', decimal: 2 },
          { name: 'vRetCOFINS', decimal: 2 },
          { name: 'vRetCSLL', decimal: 2 },
          { name: 'vBCIRRF', decimal: 2 },
          { name: 'vIRRF', decimal: 2 },
          { name: 'vBCRetPrev', decimal: 2 },
          { name: 'vRetPrev', decimal: 2 },
        ],
      },
    ],
  },
  {
    name: 'transp',
    element: [
      { name: 'modFrete' },
      {
        name: 'transporta',
        element: [
          { name: 'CNPJ' },
          { name: 'CPF' },
          { name: 'xNome' },
          { name: 'IE' },
          { name: 'xEnder' },
          { name: 'xMun' },
          { name: 'UF' },
        ],
      },
      {
        name: 'retTransp',
        element: [
          { name: 'vServ', decimal: 2 },
          { name: 'vBCRet', decimal: 2 },
          { name: 'pICMSRet', decimal: 4 },
          { name: 'vICMSRet', decimal: 2 },
          { name: 'CFOP' },
          { name: 'cMunFG' },
        ],
      },
      {
        name: 'veicTransp',
        element: [{ name: 'placa' }, { name: 'UF' }, { name: 'RNTC' }],
      },
      {
        name: 'reboque',
        maxOccurs: 5,
        element: [{ name: 'placa' }, { name: 'UF' }, { name: 'RNTC' }],
      },
      { name: 'vagao' },
      { name: 'balsa' },
      {
        name: 'vol',
        maxOccurs: 5000,
        element: [
          { name: 'qVol' },
          { name: 'esp' },
          { name: 'marca' },
          { name: 'nVol' },
          { name: 'pesoL', decimal: 3 },
          { name: 'pesoB', decimal: 3 },
          { name: 'lacres', maxOccurs: 5000, element: [{ name: 'nLacre' }] },
        ],
      },
    ],
  },
  {
    name: 'cobr',
    element: [
      {
        name: 'fat',
        element: [
          { name: 'nFat' },
          { name: 'vOrig', decimal: 2 },
          { name: 'vDesc', decimal: 2 },
          { name: 'vLiq', decimal: 2 },
        ],
      },
      {
        name: 'dup',
        maxOccurs: 120,
        element: [
          { name: 'nDup' },
          { name: 'dVenc' },
          { name: 'vDup', decimal: 2 },
        ],
      },
    ],
  },
  {
    name: 'pag',
    element: [
      {
        name: 'detPag',
        maxOccurs: 100,
        element: [
          { name: 'indPag' },
          { name: 'tPag' },
          { name: 'xPag' },
          { name: 'vPag', decimal: 2 },
          {
            name: 'card',
            element: [
              { name: 'tpIntegra' },
              { name: 'CNPJ' },
              { name: 'tBand' },
              { name: 'cAut' },
            ],
          },
        ],
      },
      { name: 'vTroco', decimal: 2 },
    ],
  },
  {
    name: 'infIntermed',
    element: [{ name: 'CNPJ' }, { name: 'idCadIntTran' }],
  },
  {
    name: 'infAdic',
    element: [
      { name: 'infAdFisco' },
      { name: 'infCpl' },
      {
        name: 'procRef',
        maxOccurs: 100,
        element: [{ name: 'nProc' }, { name: 'indProc' }],
      },
    ],
  },
  {
    name: 'exporta',
    element: [
      { name: 'UFSaidaPais' },
      { name: 'xLocExporta' },
      { name: 'xLocDespacho' },
    ],
  },
  {
    name: 'compra',
    element: [{ name: 'xNEmp' }, { name: 'xPed' }, { name: 'xCont' }],
  },
  {
    name: 'cana',
    element: [
      { name: 'safra' },
      { name: 'ref' },
      {
        name: 'forDia',
        maxOccurs: 31,
        element: [{ name: 'dia' }, { name: 'qtde', decimal: 10 }],
      },
      { name: 'qTotMes', decimal: 10 },
      { name: 'qTotAnt', decimal: 10 },
      { name: 'qTotGer', decimal: 10 },
      {
        name: 'deduc',
        maxOccurs: 10,
        element: [{ name: 'xDed' }, { name: 'vDed', decimal: 2 }],
      },
      { name: 'vFor', decimal: 2 },
      { name: 'vTotDed', decimal: 2 },
      { name: 'vLiqFor', decimal: 2 },
    ],
  },
  {
    name: 'infRespTec',
    element: [
      { name: 'CNPJ' },
      { name: 'xContato' },
      { name: 'email' },
      { name: 'fone' },
    ],
  },
]

export default elements
