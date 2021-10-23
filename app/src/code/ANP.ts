// Baixado pelo https://simp.anp.gov.br/tabela-codigos.asp
// Convertido pelo https://wtools.io/convert-excel-to-json

/* Metodo usado na simplificacao
ANP.reduce((p,c) => {
const familia = p.find(v => v.familia == c.familia)
if (familia) {
    delete c.familia
    const grupos = familia.grupos
    const grupo = grupos.find(v => v.grupo == c.grupo && v.subgrupo == c.subgrupo)
    if (grupo) {
        delete c.grupo
        delete c.subgrupo
        const subsubgrupos = grupo.subsubgrupos
        const subsubgrupo = subsubgrupos.find(v => v.subsubgrupo == c.subsubgrupo)
        if (subsubgrupo) {
            delete c.subsubgrupo
            subsubgrupo.produtos.push(c)
        } else {
            const novo = {subsubgrupo: c.subsubgrupo}
            delete c.subsubgrupo
            novo.produtos = [c]
            subsubgrupos.push(novo)
        }
    } else {
        const novo = {grupo:c.grupo, subgrupo:c.subgrupo}
        delete c.grupo
        delete c.subgrupo
        const subsubgrupo = {subsubgrupo: c.subsubgrupo}
        delete c.subsubgrupo
        subsubgrupo.produtos = [c]
        novo.subsubgrupos = [subsubgrupo]
        familia.grupos.push(novo)
    }
}
else {
    const familia = c.familia
    delete c.familia
    const novo = {grupo:c.grupo, subgrupo:c.subgrupo}
    delete c.grupo
    delete c.subgrupo
    const subsubgrupo = {subsubgrupo: c.subsubgrupo}
    delete c.subsubgrupo
    subsubgrupo.produtos = [c]
    novo.subsubgrupos = [subsubgrupo]
    p.push({familia, grupos:[novo]})
}
return p
},[])
*/

export interface IFamilia {
  familia: string;
  grupos: IGrupo[];
}

export interface IGrupo {
  grupo: string;
  subgrupo: string;
  subsubgrupos: ISubsubgrupo[];
}

export interface ISubsubgrupo {
  subsubgrupo: string;
  produtos: IProduto[];
}

export interface IProduto {
  produto: string;
  codigo: string;
}

export function buscarFamilia(cProdANP: string) {
  return familias.find(v => buscarGrupo(v, cProdANP))
}

export function buscarGrupo(familia: IFamilia, cProdANP: string) {
  if (!familia) return undefined
  return familia.grupos.find(v => buscarSubsubgrupo(v, cProdANP))
}

export function buscarSubsubgrupo(grupo: IGrupo, cProdANP: string) {
  if (!grupo) return undefined
  return grupo.subsubgrupos.find(v => buscarProduto(v, cProdANP))
}

export function buscarProduto(subsubgrupo: ISubsubgrupo, cProdANP: string) {
  if (!subsubgrupo) return undefined
  return subsubgrupo.produtos.find(v => v.codigo === cProdANP)
}

export const familias: IFamilia[] = [
  {
    familia: 'INSUMO BRUTO',
    grupos: [
      {
        grupo: 'PETRÓLEO',
        subgrupo: 'IMPORTADO',
        subsubgrupos: [
          {
            subsubgrupo: 'PETRÓLEOS DA ÁFRICA',
            produtos: [
              { produto: 'ABO 3', codigo: '110203073' },
              { produto: 'AGBAMI', codigo: '110203083' },
              { produto: 'AKPO', codigo: '110203091' },
              { produto: 'AMENAN BLEND', codigo: '110203072' },
              { produto: 'AMNA', codigo: '110203001' },
              { produto: 'ANGOLANO', codigo: '110203002' },
              { produto: 'ANTAN', codigo: '110203003' },
              { produto: 'ARZEW', codigo: '110203004' },
              { produto: 'BACH HO', codigo: '110203092' },
              { produto: 'BAOBAB', codigo: '110203097' },
              { produto: 'BARROW ISLAND', codigo: '110203096' },
              { produto: 'BELAYM', codigo: '110203005' },
              { produto: 'BONGA', codigo: '110203077' },
              { produto: 'BONNY LEVE', codigo: '110203006' },
              { produto: 'BONNY MEDIO', codigo: '110203007' },
              { produto: 'BOURI', codigo: '110203008' },
              { produto: 'BRASS BLEND', codigo: '110203009' },
              { produto: 'BRASS RIVER', codigo: '110203010' },
              { produto: 'BU ATTIFEL', codigo: '110203092' },
              { produto: 'CABINA/TAKULA', codigo: '110203011' },
              { produto: 'CABINDA', codigo: '110203012' },
              { produto: 'CEIBA', codigo: '110203085' },
              { produto: 'COCO', codigo: '110203013' },
              { produto: 'DALIA', codigo: '110203086' },
              { produto: 'DJENO BLEND', codigo: '110203014' },
              { produto: 'EA CRUDE', codigo: '110203069' },
              { produto: 'EAST ZEIT MIX', codigo: '110203015' },
              { produto: 'EBOME', codigo: '110203104' },
              { produto: 'EL HUEMEL', codigo: '110203016' },
              { produto: 'EL MORGAN', codigo: '110203017' },
              { produto: 'EL ORIENTE', codigo: '110203018' },
              { produto: 'EL SHARARA', codigo: '110203088' },
              { produto: 'EMERAUDE', codigo: '110203019' },
              { produto: 'ERHA', codigo: '110203079' },
              { produto: 'ES SIDER', codigo: '110203020' },
              { produto: 'ESCRAVOS', codigo: '110203021' },
              { produto: 'ETAME', codigo: '110203095' },
              { produto: 'FORCADOS', codigo: '110203022' },
              { produto: 'GAMBA', codigo: '110203023' },
              { produto: 'GEISUM', codigo: '110203024' },
              { produto: 'GIRASSOL', codigo: '110203087' },
              { produto: 'GULF OF SUEZ', codigo: '110203025' },
              { produto: 'GULF OF SUEZ MIX', codigo: '110203026' },
              { produto: 'HASSI MESSAOUD', codigo: '110203027' },
              { produto: 'HASSI RMEL', codigo: '110203028' },
              { produto: 'HASSI RMEL', codigo: '110203028' },
              { produto: 'HUNGO', codigo: '110203074' },
              { produto: 'IMA LIGHT', codigo: '110203029' },
              { produto: 'JUBILEE', codigo: '110203098' },
              { produto: 'KISSANJE', codigo: '110203080' },
              { produto: 'KITINA', codigo: '110203030' },
              { produto: 'KOLE', codigo: '110203031' },
              { produto: 'KUITO', codigo: '110203084' },
              { produto: 'KUTUBU', codigo: '110203032' },
              { produto: 'LOKELE', codigo: '110203033' },
              { produto: 'LUCINA MARINE', codigo: '110203034' },
              { produto: 'LUCULA', codigo: '110203035' },
              { produto: 'MANDJI', codigo: '110203036' },
              { produto: 'MBIA', codigo: '110203037' },
              { produto: 'MBIA', codigo: '110203037' },
              { produto: 'MELLITAH', codigo: '110203078' },
              { produto: 'MOANDA', codigo: '110203038' },
              { produto: 'MONDO', codigo: '110203089' },
              { produto: 'MOUDI', codigo: '110203039' },
              { produto: 'NEMBA', codigo: '110203040' },
              { produto: 'NIGERIANO BRASS LIGHT', codigo: '110203041' },
              { produto: 'NIGERIANO LEVE', codigo: '110203042' },
              { produto: 'NIGERIANO LEVE QUA IBOE', codigo: '110203043' },
              { produto: 'NILE BLEND', codigo: '110203094' },
              { produto: 'NKOSSA', codigo: '110203044' },
              { produto: 'NKOSSA', codigo: '110203044' },
              { produto: 'ODUDU', codigo: '110203045' },
              { produto: 'OGUENDJO', codigo: '110203046' },
              { produto: 'OKAN', codigo: '110203047' },
              { produto: 'OKONO', codigo: '110203048' },
              { produto: 'OKORO', codigo: '110203099' },
              { produto: 'OKWORI', codigo: '110203081' },
              { produto: 'OLOWI', codigo: '110203093' },
              { produto: 'ORIBI', codigo: '110203049' },
              { produto: 'PALANCA', codigo: '110203050' },
              { produto: 'PAZFLOR', codigo: '110203102' },
              { produto: 'PENNINGTON', codigo: '110203051' },
              { produto: 'PLUTONIO', codigo: '110203082' },
              { produto: 'QUARUN', codigo: '110203101' },
              { produto: 'RABI', codigo: '110203052' },
              { produto: 'RAS BUDRAN', codigo: '110203053' },
              { produto: 'RAS GHARIB', codigo: '110203054' },
              { produto: 'SABLE CRUDE OIL', codigo: '110203070' },
              { produto: 'SAHARA MISTURA', codigo: '110203055' },
              { produto: 'SALTPOND', codigo: '110203075' },
              { produto: 'SARIR', codigo: '110203056' },
              { produto: 'SATURNO BLEND', codigo: '110203103' },
              { produto: 'SAXI BLEND', codigo: '110203090' },
              { produto: 'SIRTICA', codigo: '110203057' },
              { produto: 'SKIKDA', codigo: '110203058' },
              { produto: 'SOYO', codigo: '110203059' },
              { produto: 'SOYO 38', codigo: '110203060' },
              { produto: 'TAKULA', codigo: '110203061' },
              { produto: 'TCHATAMBA', codigo: '110203062' },
              { produto: 'UKPOKITI', codigo: '110203063' },
              { produto: 'USAN BLEND', codigo: '110203100' },
              { produto: 'USAN BLEND', codigo: '110203100' },
              { produto: 'XICOMBA', codigo: '110203076' },
              { produto: 'YOHO', codigo: '110203071' },
              { produto: 'ZAFIRO', codigo: '110203065' },
              { produto: 'ZAIRE', codigo: '110203064' },
              { produto: 'ZARZAITINE', codigo: '110203066' },
              { produto: 'ZEIT BAY', codigo: '110203067' },
              { produto: 'ZUEITINA', codigo: '110203068' },
            ],
          },
          {
            subsubgrupo: 'PETRÓLEOS DO ORIENTE MÉDIO',
            produtos: [
              { produto: 'ABOOZAR', codigo: '110204001' },
              { produto: 'ABU ASAFAH', codigo: '110204002' },
              { produto: 'ALIF', codigo: '110204003' },
              { produto: 'ARABE EXTRA LEVE', codigo: '110204004' },
              { produto: 'ARABE LEVE', codigo: '110204005' },
              { produto: 'ARABE MEDIO', codigo: '110204006' },
              { produto: 'ARABE MEDIO BANOCO', codigo: '110204007' },
              { produto: 'ARABE MEDIO ZULUF', codigo: '110204008' },
              { produto: 'ARABE PESADO', codigo: '110204009' },
              { produto: 'ARABE RECON', codigo: '110204010' },
              { produto: 'ARABE SUPER LEVE', codigo: '110204011' },
              { produto: 'BASRAH LEVE', codigo: '110204012' },
              { produto: 'BASRAH MEDIO', codigo: '110204013' },
              { produto: 'BASRAH PESADO', codigo: '110204014' },
              { produto: 'BURGAN', codigo: '110204015' },
              { produto: 'DOROOD', codigo: '110204017' },
              { produto: 'DSL', codigo: '110204051' },
              { produto: 'DUBAI', codigo: '110204018' },
              { produto: 'FAO BLEND', codigo: '110204016' },
              { produto: 'FOROOZAN', codigo: '110204019' },
              { produto: 'GAVARZIN', codigo: '110204020' },
              { produto: 'IRANIANO LEVE', codigo: '110204021' },
              { produto: 'IRANIANO MISTURA', codigo: '110204022' },
              { produto: 'IRANIANO PESADO', codigo: '110204023' },
              { produto: 'JAMBUR BAR HASSAN', codigo: '110204024' },
              { produto: 'KANGAN', codigo: '110204025' },
              { produto: 'KHAFJI', codigo: '110204026' },
              { produto: 'KHAFJI BLEND', codigo: '110204027' },
              { produto: 'KIRKUK', codigo: '110204028' },
              { produto: 'KIRKUK BLEND', codigo: '110204029' },
              { produto: 'KUWAIT', codigo: '110204030' },
              { produto: 'LAVAN BLEND', codigo: '110204031' },
              { produto: 'LOWER ZAKUM', codigo: '110204053' },
              { produto: 'MARIB LIGHT', codigo: '110204032' },
              { produto: 'MASILA BLEND', codigo: '110204033' },
              { produto: 'MURBAN', codigo: '110204034' },
              { produto: 'OMAN', codigo: '110204035' },
              { produto: 'QATAR DUKHAN', codigo: '110204036' },
              { produto: 'QATAR LAND', codigo: '110204037' },
              { produto: 'QATAR MARINE', codigo: '110204038' },
              { produto: 'RATAWI', codigo: '110204039' },
              { produto: 'ROSTAM', codigo: '110204040' },
              { produto: 'RUMAILA', codigo: '110204041' },
              { produto: 'SALMAN', codigo: '110204042' },
              { produto: 'SARKHOON', codigo: '110204043' },
              { produto: 'SIRRI', codigo: '110204044' },
              { produto: 'SORROSH', codigo: '110204045' },
              { produto: 'SOUEDIA', codigo: '110204046' },
              { produto: 'SOUTHERN PARS', codigo: '110204055' },
              { produto: 'SUEDIE', codigo: '110204052' },
              { produto: 'SYRIAN LIGHT', codigo: '110204047' },
              { produto: 'TAQ TAQ', codigo: '110204054' },
              { produto: 'UMM SHAIF', codigo: '110204048' },
              { produto: 'UPPER ZAKUM', codigo: '110204049' },
              { produto: 'ZAKUM', codigo: '110204050' },
            ],
          },
          {
            subsubgrupo: 'PETRÓLEOS DA AMÉRICA DO SUL',
            produtos: [
              { produto: 'ALEN CONDENSATE', codigo: '110201067' },
              { produto: 'ANACO WAX', codigo: '110201001' },
              { produto: 'BACHAQUERO', codigo: '110201002' },
              { produto: 'BCF', codigo: '110201003' },
              { produto: 'BCF 22', codigo: '110201004' },
              { produto: 'BCF 23', codigo: '110201005' },
              { produto: 'BCF 24', codigo: '110201006' },
              { produto: 'BOLIVIAN BLEND', codigo: '110201007' },
              { produto: 'BOLIVIANO', codigo: '110201008' },
              { produto: 'BOSCAN', codigo: '110201009' },
              { produto: 'CAÑADON SECO', codigo: '110201010' },
              { produto: 'CAÑO LIMÓN', codigo: '110201011' },
              { produto: 'CARABOBO', codigo: '110201064' },
              { produto: 'CARANDA', codigo: '110201012' },
              { produto: 'CASTILLA BLEND', codigo: '110201066' },
              { produto: 'CEUTA', codigo: '110201013' },
              { produto: 'CHUBUT', codigo: '110201014' },
              { produto: 'COBLAN BLEND', codigo: '110201015' },
              { produto: 'CORRIENTES', codigo: '110201016' },
              { produto: 'CUPIAGUA', codigo: '110201017' },
              { produto: 'CUSIANA', codigo: '110201018' },
              { produto: 'ESCALANTE', codigo: '110201019' },
              { produto: 'FURRIAL', codigo: '110201020' },
              { produto: 'GUAFITA BLEND', codigo: '110201021' },
              { produto: 'GUANIPA', codigo: '110201022' },
              { produto: 'HIDES', codigo: '110201068' },
              { produto: 'HYDRA', codigo: '110201023' },
              { produto: 'LAGOCINCO', codigo: '110201024' },
              { produto: 'LAGOCINCO LIVIANO', codigo: '110201025' },
              { produto: 'LAGOMEDIO', codigo: '110201026' },
              { produto: 'LAGOTRECO', codigo: '110201027' },
              { produto: 'LAGOTRECO HEAVY', codigo: '110201028' },
              { produto: 'LAGOTRECO MEDIO', codigo: '110201029' },
              { produto: 'LAGUNA', codigo: '110201030' },
              { produto: 'LEONA', codigo: '110201031' },
              { produto: 'LEONA 21,9', codigo: '110201032' },
              { produto: 'LEONA 24', codigo: '110201033' },
              { produto: 'LORETO', codigo: '110201034' },
              { produto: 'MARIA IGNES', codigo: '110201035' },
              { produto: 'MARLAGO', codigo: '110201036' },
              { produto: 'MAYNA', codigo: '110201069' },
              { produto: 'MEDANITO', codigo: '110201037' },
              { produto: 'MEREY', codigo: '110201038' },
              { produto: 'MEREY/LEONA', codigo: '110201039' },
              { produto: 'MESA', codigo: '110201040' },
              { produto: 'MESCLA VENEZUELANO', codigo: '110201041' },
              { produto: 'MONOGAS', codigo: '110201042' },
              { produto: 'NAPO', codigo: '110201062' },
              { produto: 'OFICINA', codigo: '110201043' },
              { produto: 'ORIENTE', codigo: '110201044' },
              { produto: 'ORITO', codigo: '110201045' },
              { produto: 'PERENCO PERU BLEND', codigo: '110201065' },
              { produto: 'PILON', codigo: '110201046' },
              { produto: 'RECON BOLIVIANO', codigo: '110201047' },
              { produto: 'RECON MEREY', codigo: '110201048' },
              { produto: 'RINCÓN DE LOS SAUCES', codigo: '110201049' },
              { produto: 'SAN SEBASTIAN', codigo: '110201050' },
              { produto: 'SANTA BARBARA', codigo: '110201051' },
              { produto: 'SANTA CRUZ', codigo: '110201052' },
              { produto: 'SANTA CRUZ DO SUL', codigo: '110201053' },
              { produto: 'SHIVIYACU', codigo: '110201054' },
              { produto: 'SOUTH BLEND', codigo: '110201063' },
              { produto: 'TIA JUANA', codigo: '110201055' },
              { produto: 'TIA JUANA MEDIO', codigo: '110201056' },
              { produto: 'TIA JUANA PESADO', codigo: '110201057' },
              { produto: 'VASCONIA BLEND', codigo: '110201059' },
              { produto: 'VASCONIA 29,3', codigo: '110201058' },
              { produto: 'YANAYACU', codigo: '110201060' },
              { produto: 'ZUATA', codigo: '110201061' },
            ],
          },
          {
            subsubgrupo: 'PETRÓLEOS DA ÁSIA',
            produtos: [
              { produto: 'ARDJUNA', codigo: '110205001' },
              { produto: 'BACH HO', codigo: '110205023' },
              { produto: 'BARANTAI', codigo: '110205037' },
              { produto: 'BEKOK', codigo: '110205002' },
              { produto: 'BELIDA', codigo: '110205003' },
              { produto: 'BOMBAY HIGH', codigo: '110205004' },
              { produto: 'BRUNEI LIGHT', codigo: '110205005' },
              { produto: 'CHAMPION', codigo: '110205034' },
              { produto: 'CHIM SÃO', codigo: '110205031' },
              { produto: 'CINTA', codigo: '110205006' },
              { produto: 'CONDENSADO SENIPAH', codigo: '110205024' },
              { produto: 'DAÍ HUNG', codigo: '110205007' },
              { produto: 'DAQUING', codigo: '110205008' },
              { produto: 'DULANG', codigo: '110205035' },
              { produto: 'DURI CRUDE OIL', codigo: '110205022' },
              { produto: 'KAJI SEMOGA', codigo: '110205025' },
              { produto: 'KIKEH', codigo: '110205026' },
              { produto: 'LABUAN', codigo: '110205009' },
              { produto: 'LALANG', codigo: '110205036' },
              { produto: 'MINAS', codigo: '110205027' },
              { produto: 'MIRI LEVE', codigo: '110205010' },
              { produto: 'NANHAI LIGHT', codigo: '110205011' },
              { produto: 'OYONG', codigo: '110205033' },
              { produto: 'PENARA BLEND', codigo: '110205032' },
              { produto: 'PULAI', codigo: '110205012' },
              { produto: 'RANG DONG', codigo: '110205029' },
              { produto: 'RUBY', codigo: '110205030' },
              { produto: 'SERIA LIGHT', codigo: '110205028' },
              { produto: 'SHENGLI', codigo: '110205013' },
              { produto: 'SUMATRAN HEAVY', codigo: '110205015' },
              { produto: 'SUMATRAN LIGHT', codigo: '110205014' },
              { produto: 'TACHING', codigo: '110205016' },
              { produto: 'TAPIS', codigo: '110205017' },
              { produto: 'TIONG', codigo: '110205018' },
              { produto: 'UDANG', codigo: '110205019' },
              { produto: 'WIDURI', codigo: '110205020' },
              { produto: 'XIJIANG', codigo: '110205021' },
            ],
          },
          {
            subsubgrupo: 'PETRÓLEOS DA EUROPA E EX-URSS',
            produtos: [
              { produto: 'ASGARD BLEND', codigo: '110206023' },
              { produto: 'AZERJ LIGHT', codigo: '110206019' },
              { produto: 'BEATRICE', codigo: '110206001' },
              { produto: 'BERYL', codigo: '110206002' },
              { produto: 'BLACK GASOIL CRUDE OIL', codigo: '110206003' },
              { produto: 'BRENT', codigo: '110206004' },
              { produto: 'CPC BLEND', codigo: '110206020' },
              { produto: 'EKOFISH', codigo: '110206005' },
              { produto: 'ESPO', codigo: '110206025' },
              { produto: 'FLOTTA', codigo: '110206006' },
              { produto: 'FLOTTA OCIDENTAL', codigo: '110206007' },
              { produto: 'FORTIES', codigo: '110206008' },
              { produto: 'FORTIES BLEND', codigo: '110206009' },
              { produto: 'GULL FALKS', codigo: '110206011' },
              { produto: 'GULL FALKS C', codigo: '110206010' },
              { produto: 'NINIAN', codigo: '110206024' },
              { produto: 'NORNE BLEND', codigo: '110206021' },
              { produto: 'OSEBERG', codigo: '110206012' },
              { produto: 'SOVIET EXPORT BLEND', codigo: '110206013' },
              { produto: 'STATFJORD', codigo: '110206015' },
              { produto: 'STATFJORD LOW SULFUR', codigo: '110206014' },
              { produto: 'TENGIZ', codigo: '110206016' },
              { produto: 'URAL', codigo: '110206017' },
              { produto: 'VARANDEY', codigo: '110206027' },
              { produto: 'VITYAZ', codigo: '110206022' },
              { produto: 'WYTCH FARM', codigo: '110206018' },
              { produto: 'ZAKINSKAYA', codigo: '110206026' },
            ],
          },
          {
            subsubgrupo: 'PETRÓLEOS DA OCEANIA',
            produtos: [
              { produto: 'BALNAVES', codigo: '110207010' },
              { produto: 'CHALLIS', codigo: '110207001' },
              { produto: 'GIPPSLAND BLEND', codigo: '110207002' },
              { produto: 'GRIFFIN', codigo: '110207003' },
              { produto: 'JABIRU', codigo: '110207004' },
              { produto: 'LAMINARIA', codigo: '110207005' },
              { produto: 'LEGENDRE', codigo: '110207006' },
              { produto: 'MUTINEER', codigo: '110207009' },
              { produto: 'NORTH WEST SHELF', codigo: '110207007' },
              { produto: 'PLUTO CONDENSADO', codigo: '110207008' },
            ],
          },
          {
            subsubgrupo: 'PETRÓLEOS DA AMÉRICA DO NORTE & CARIBE',
            produtos: [
              { produto: 'CALYPSO', codigo: '110202007' },
              { produto: 'CASCADE CHINOOK', codigo: '110202011' },
              { produto: 'COLD LAKE BLEND', codigo: '110202001' },
              { produto: 'HIBERNIA', codigo: '110202009' },
              { produto: 'ISTHMUS', codigo: '110202002' },
              { produto: 'ISTHMUS MAYA', codigo: '110202003' },
              { produto: 'MAYA', codigo: '110202004' },
              { produto: 'MAYA LEVE', codigo: '110202005' },
              { produto: 'MSW EDMONTON', codigo: '110202008' },
              { produto: 'OLMECA', codigo: '110202006' },
              { produto: 'WHITE ROSE', codigo: '110202010' },
            ],
          },
          {
            subsubgrupo: 'OUTROS PETRÓLEOS IMPORTADOS',
            produtos: [
              {
                produto: 'MISTURA DE PETRÓLEOS IMPORTADOS',
                codigo: '110208001',
              },
              { produto: 'OUTROS PETRÓLEOS IMPORTADOS', codigo: '110208002' },
            ],
          },
          {
            subsubgrupo: 'PETRÓLEOS IMPORTADOS',
            produtos: [
              {
                produto: 'PETRÓLEO IMPORTADO ASFÁLTICO (API < 15)',
                codigo: '110209006',
              },
              {
                produto: 'PETRÓLEO IMPORTADO EXTRALEVE (API > 40)',
                codigo: '110209001',
              },
              {
                produto: 'PETRÓLEO IMPORTADO EXTRAPESADO (15 < API < 19)',
                codigo: '110209005',
              },
              {
                produto: 'PETRÓLEO IMPORTADO LEVE (33 < API < 40)',
                codigo: '110209002',
              },
              {
                produto: 'PETRÓLEO IMPORTADO  MÉDIO (27 < API < 33)',
                codigo: '110209003',
              },
              {
                produto: 'PETRÓLEO IMPORTADO PESADO (19 < API < 27)',
                codigo: '110209004',
              },
            ],
          },
        ],
      },
      {
        grupo: 'RENOVAVEIS',
        subgrupo: 'BIODIESEL',
        subsubgrupos: [
          {
            subsubgrupo: 'MATERIAIS GRAXOS',
            produtos: [
              {
                produto: 'ÁCIDO GRAXO DE ÓLEO DE PALMA / DENDÊ',
                codigo: '140101027',
              },
              { produto: 'ÁCIDO GRAXO DE ÓLEO DE SOJA', codigo: '140101026' },
              { produto: 'GORDURA BOVINA', codigo: '140101023' },
              { produto: 'GORDURA DE FRANGO', codigo: '140101024' },
              { produto: 'GORDURA DE PORCO', codigo: '140101025' },
              {
                produto: 'ÓLEO DE ABACATE (PERSIA AMERICANA)',
                codigo: '140101015',
              },
              {
                produto: 'ÓLEO DE ALGODÃO (GOSSYPIUM HIRSUT)',
                codigo: '140101009',
              },
              {
                produto: 'ÓLEO DE AMENDOIM (ORACHIS HYPOGEAE)',
                codigo: '140101016',
              },
              {
                produto: 'ÓLEO DE ANDIROBA (CARAPA GUIANERSIS)',
                codigo: '140101017',
              },
              {
                produto: 'ÓLEO DE BABAÇU (ORBINYA MARTIANA)',
                codigo: '140101005',
              },
              { produto: 'ÓLEO DE BURITI', codigo: '140101014' },
              { produto: 'ÓLEO DE COCO (COCUS NUMIFERA)', codigo: '140101018' },
              {
                produto: 'ÓLEO DE COLZA/CANOLA (BRESSICA CAMPESTRIS)',
                codigo: '140101006',
              },
              { produto: 'ÓLEO DE CRAMBE', codigo: '140101028' },
              { produto: 'ÓLEO DE FRITURA USADO', codigo: '140101021' },
              {
                produto: 'ÓLEO DE GIRASSOL (HELLANTHUS ANNUS)',
                codigo: '140101010',
              },
              { produto: 'ÓLEO DE LINHAÇA', codigo: '140101012' },
              { produto: 'ÓLEO DE MACAÚBA', codigo: '140101013' },
              {
                produto: 'ÓLEO DE MAMONA (RICINUS COMMUNIS)',
                codigo: '140101001',
              },
              { produto: 'ÓLEO DE MILHO', codigo: '140101030' },
              { produto: 'ÓLEO DE NABO-FORRAGEIRO', codigo: '140101011' },
              {
                produto: 'ÓLEO DE PALMA/DENDÊ (ELAEIS GUINEENSIS OU ELAEIS O',
                codigo: '140101003',
              },
              { produto: 'ÓLEO DE PALMISTE', codigo: '140101002' },
              {
                produto: 'ÓLEO DE PEQUI (JATROPHA CURCAS)',
                codigo: '140101008',
              },
              { produto: 'ÓLEO DE PINHÃO-MANSO', codigo: '140101007' },
              {
                produto: 'ÓLEO DE SÉSAMO (SESAMUN INDICUM)',
                codigo: '140101019',
              },
              { produto: 'ÓLEO DE SOJA (GLYCINE MAX)', codigo: '140101004' },
              { produto: 'OUTROS ÁCIDOS GRAXOS', codigo: '140101029' },
              { produto: 'OUTROS MATERIAIS GRAXOS', codigo: '140101022' },
              { produto: 'OUTROS MATERIAIS GRAXOS', codigo: '140101999' },
              { produto: 'SEBO', codigo: '140101020' },
            ],
          },
          {
            subsubgrupo: 'ÉSTERES',
            produtos: [{ produto: 'ÉSTER METÍLICO', codigo: '140102001' }],
          },
        ],
      },
      {
        grupo: 'PETRÓLEO',
        subgrupo: 'NACIONAL',
        subsubgrupos: [
          {
            subsubgrupo: 'BACIA DO RECÔNCAVO',
            produtos: [
              { produto: 'ÁGUA GRANDE', codigo: '110103001' },
              { produto: 'ARAÇÁS', codigo: '110103003' },
              { produto: 'ARATU', codigo: '110103002' },
              { produto: 'BAIANO BORDA NORDESTE', codigo: '110103004' },
              { produto: 'BAIANO MISTURA', codigo: '110103005' },
              { produto: 'BOM LUGAR', codigo: '110103017' },
              { produto: 'CANÁRIO', codigo: '110103022' },
              { produto: 'CANDEIAS', codigo: '110103006' },
              { produto: 'DOM JOÃO', codigo: '110103007' },
              { produto: 'FAZENDA SÃO ESTEVÃO', codigo: '110103019' },
              { produto: 'GUANAMBI', codigo: '110103013' },
              { produto: 'ILHÉUS', codigo: '110103008' },
              { produto: 'JURITI', codigo: '110103015' },
              { produto: 'LAGOA DO PAULO NORTE', codigo: '110103021' },
              { produto: 'MIRANGA', codigo: '110103009' },
              { produto: 'MIRANGA/ÁGUA GRANDE', codigo: '110103010' },
              { produto: 'QUIAMBINA', codigo: '110103014' },
              { produto: 'RECÔNCAVO', codigo: '110103011' },
              { produto: 'SEMPRE VIVA', codigo: '110103018' },
              { produto: 'TICO-TICO', codigo: '110103020' },
              { produto: 'TIÊ', codigo: '110103024' },
              { produto: 'TIGRE', codigo: '110103016' },
              { produto: 'TROVOADA', codigo: '110103023' },
              { produto: 'UIRAPURU', codigo: '110103012' },
            ],
          },
          {
            subsubgrupo: 'BACIA DE ALAGOAS/SERGIPE',
            produtos: [
              { produto: 'ALAGOANO', codigo: '110106001' },
              { produto: 'CAJUEIRO', codigo: '110106010' },
              { produto: 'CAMORIM', codigo: '110106002' },
              { produto: 'CASTANHAL', codigo: '110106003' },
              { produto: 'HARPIA', codigo: '110106013' },
              { produto: 'PIRANEMA', codigo: '110106007' },
              { produto: 'SERGIPANO MAR', codigo: '110106004' },
              { produto: 'SERGIPANO MISTURA', codigo: '110106005' },
              { produto: 'SERGIPANO TERRA', codigo: '110106006' },
              { produto: 'TABULEIRO', codigo: '110106011' },
              { produto: 'TARTARUGA', codigo: '110106009' },
              { produto: 'TIGRE', codigo: '110106012' },
              { produto: '1-WW-1-BA', codigo: '110106008' },
            ],
          },
          {
            subsubgrupo: 'BACIA DE CAMPOS',
            produtos: [
              { produto: 'ALBACORA', codigo: '110101001' },
              { produto: 'ALBACORA LESTE', codigo: '110101042' },
              { produto: 'ANEQUIM', codigo: '110101002' },
              { produto: 'BADEJO', codigo: '110101003' },
              { produto: 'BAGRE', codigo: '110101004' },
              { produto: 'BALEIA AZUL', codigo: '110101051' },
              { produto: 'BARRACUDA', codigo: '110101005' },
              { produto: 'BICUDO', codigo: '110101006' },
              { produto: 'BIJUPIRÁ', codigo: '110101007' },
              { produto: 'BIJUPIRÁ/SALEMA', codigo: '110101038' },
              { produto: 'BONITO', codigo: '110101008' },
              { produto: 'CABIÚNAS MISTURA', codigo: '110101009' },
              { produto: 'CACHALOTE', codigo: '110101054' },
              { produto: 'CARAPEBA', codigo: '110101010' },
              { produto: 'CARATINGA', codigo: '110101011' },
              { produto: 'CHERNE', codigo: '110101012' },
              { produto: 'CORVINA', codigo: '110101013' },
              { produto: 'ENCHOVA', codigo: '110101014' },
              { produto: 'ESPADARTE', codigo: '110101015' },
              { produto: 'ESPÍRITO SANTO SUBMARINO', codigo: '110101016' },
              { produto: 'FRADE', codigo: '110101043' },
              { produto: 'GAROUPA', codigo: '110101017' },
              { produto: 'GAROUPINHA', codigo: '110101018' },
              { produto: 'JABUTI', codigo: '110101046' },
              { produto: 'JUBARTE', codigo: '110101019' },
              { produto: 'LINGUADO', codigo: '110101020' },
              { produto: 'MALHADO', codigo: '110101021' },
              { produto: 'MARIMBA', codigo: '110101022' },
              { produto: 'MARLIM', codigo: '110101023' },
              { produto: 'MARLIM LESTE', codigo: '110101024' },
              { produto: 'MARLIM SUL', codigo: '110101025' },
              { produto: 'MARLIN/VOADOR', codigo: '110101039' },
              { produto: 'MOREIA', codigo: '110101026' },
              { produto: 'NAMORADO', codigo: '110101027' },
              { produto: 'OSTRA', codigo: '110101052' },
              { produto: 'PAMPO', codigo: '110101028' },
              { produto: 'PAPATERRA', codigo: '110101049' },
              { produto: 'PARATI', codigo: '110101029' },
              { produto: 'PARGO', codigo: '110101030' },
              { produto: 'PEREGRINO', codigo: '110101050' },
              { produto: 'PIRAUNA', codigo: '110101031' },
              { produto: 'POLO NORDESTE', codigo: '110101032' },
              { produto: 'POLVO', codigo: '110101047' },
              { produto: 'RJS-609', codigo: '110101048' },
              { produto: 'RONCADOR', codigo: '110101033' },
              { produto: 'RONCADOR LESTE', codigo: '110101040' },
              { produto: 'RONCADOR MISTURA', codigo: '110101045' },
              { produto: 'RONCADOR OESTE', codigo: '110101041' },
              { produto: 'SALEMA', codigo: '110101053' },
              { produto: 'SIRI', codigo: '110101044' },
              { produto: 'TARTARUGA VERDE', codigo: '110101057' },
              { produto: 'TRILHA', codigo: '110101034' },
              { produto: 'TUBARÃO AZUL', codigo: '110101055' },
              { produto: 'TUBARÃO MARTELO', codigo: '110101056' },
              { produto: 'VERMELHO', codigo: '110101035' },
              { produto: 'VIOLA', codigo: '110101036' },
              { produto: 'VOADOR', codigo: '110101037' },
            ],
          },
          {
            subsubgrupo: 'BACIA POTIGUAR',
            produtos: [
              { produto: 'ALTO DO RODRIGUES', codigo: '110105001' },
              { produto: 'ARACARI', codigo: '110105027' },
              { produto: 'ARATUM', codigo: '110105002' },
              { produto: 'AURI', codigo: '110105017' },
              { produto: 'BV', codigo: '110105018' },
              { produto: 'CANTO DO AMARO', codigo: '110105003' },
              { produto: 'CARDEAL', codigo: '110105030' },
              { produto: 'CHAUÁ', codigo: '110105023' },
              { produto: 'COLIBRI', codigo: '110105033' },
              { produto: 'ESTREITO', codigo: '110105004' },
              { produto: 'FAZENDA ALEGRE', codigo: '110105005' },
              { produto: 'FAZENDA BELÉM', codigo: '110105006' },
              { produto: 'FAZENDA POCINHO', codigo: '110105007' },
              { produto: 'GALO DE CAMPINA', codigo: '110105034' },
              { produto: 'IRERE', codigo: '110105037' },
              { produto: 'JOÃO DE BARRO', codigo: '110105015' },
              { produto: 'KOCH', codigo: '110105025' },
              { produto: 'LIVRAMENTO', codigo: '110105008' },
              { produto: 'LORENA', codigo: '110105009' },
              { produto: 'PERIQUITO', codigo: '110105028' },
              { produto: 'PESCADA/ARABAIANA', codigo: '110105016' },
              { produto: 'POTI', codigo: '110105021' },
              { produto: 'POTIGUAR TERRA', codigo: '110105010' },
              { produto: 'PTX', codigo: '110105020' },
              { produto: 'PTX-11', codigo: '110105022' },
              { produto: 'RGN MISTURA', codigo: '110105011' },
              { produto: 'RIACHO TAPUIO', codigo: '110105032' },
              { produto: 'ROLINHA', codigo: '110105031' },
              { produto: 'RT', codigo: '110105019' },
              { produto: 'RV-1', codigo: '110105024' },
              { produto: 'SABIA BICO DE OSSO', codigo: '110105036' },
              { produto: 'SABIA DA MATA', codigo: '110105035' },
              { produto: 'SÃO MANOEL', codigo: '110105029' },
              { produto: 'SERRARIA', codigo: '110105012' },
              { produto: 'UBARANA/AGULHA', codigo: '110105014' },
              { produto: 'UPANEMA', codigo: '110105013' },
              { produto: '1-FAC-2-RN', codigo: '110105026' },
            ],
          },
          {
            subsubgrupo: 'BACIA DE SANTOS',
            produtos: [
              { produto: 'AREA DE FLORIM', codigo: '110107009' },
              { produto: 'AREA NORDESTE DE TUPI', codigo: '110107013' },
              { produto: 'AREA SUL DE GUARA', codigo: '110107014' },
              { produto: 'AREA SUL DE TUPI', codigo: '110107012' },
              { produto: 'BAUNA', codigo: '110107007' },
              { produto: 'BUZIOS', codigo: '110107010' },
              { produto: 'CARAVELA', codigo: '110107001' },
              { produto: 'CONDENSADO DE MERLUZA', codigo: '110107017' },
              { produto: 'CONDENSADO DE MEXILHAO', codigo: '110107018' },
              { produto: 'CORAL', codigo: '110107002' },
              { produto: 'ENTORNO DE IARA', codigo: '110107015' },
              { produto: 'ESTRELA DO MAR', codigo: '110107003' },
              { produto: 'IARA', codigo: '110107016' },
              { produto: 'LULA', codigo: '110107008' },
              { produto: 'SAPINHOA', codigo: '110107011' },
              { produto: 'TIRO', codigo: '110107005' },
              { produto: 'TUPI', codigo: '110107004' },
              { produto: 'URUGUA-TAMBAU', codigo: '110107006' },
            ],
          },
          {
            subsubgrupo: 'BACIA DO CEARÁ',
            produtos: [
              { produto: 'ATUM', codigo: '110108001' },
              { produto: 'CARAUNAS', codigo: '110108002' },
              { produto: 'CEARÁ MAR', codigo: '110108003' },
              { produto: 'CURIMÃ/ESPADA', codigo: '110108004' },
              { produto: 'ESPADA', codigo: '110108005' },
              { produto: 'XAREU/ATUM', codigo: '110108006' },
            ],
          },
          {
            subsubgrupo: 'BACIA DE MUCURI',
            produtos: [{ produto: 'BAS-60', codigo: '110102001' }],
          },
          {
            subsubgrupo: 'BACIA DO ESPÍRITO SANTO',
            produtos: [
              { produto: 'CAÇÃO', codigo: '110104001' },
              { produto: 'CACHALOTE', codigo: '110104006' },
              { produto: 'CAMARUPIM', codigo: '110104011' },
              { produto: 'CREJOA', codigo: '110104008' },
              { produto: 'ESPIRITO SANTO', codigo: '110104002' },
              { produto: 'FAZENDA ALEGRE', codigo: '110104012' },
              { produto: 'FAZENDA SÃO RAFAEL', codigo: '110104003' },
              { produto: 'GAIVOTA', codigo: '110104009' },
              { produto: 'GOLFINHO', codigo: '110104005' },
              { produto: 'LAGOA PARDA', codigo: '110104004' },
              { produto: 'PARQUE DAS CONCHAS', codigo: '110104007' },
              { produto: 'PEROA', codigo: '110104010' },
            ],
          },
          {
            subsubgrupo: 'TERRA BAHIA CATU',
            produtos: [
              { produto: 'CANÁRIO', codigo: '110111002' },
              { produto: 'PAU LAVADO', codigo: '110111001' },
            ],
          },
          {
            subsubgrupo: 'BACIA DO PARNAÍBA',
            produtos: [
              { produto: 'GAVIÃO BRANCO', codigo: '110114003' },
              { produto: 'GAVIÃO REAL', codigo: '110114001' },
              { produto: 'GAVIÃO VERMELHO', codigo: '110114002' },
            ],
          },
          {
            subsubgrupo: 'BACIA DE CAMAMU',
            produtos: [{ produto: 'JIRIBATUBA', codigo: '110113001' }],
          },
          {
            subsubgrupo: 'OUTROS PETRÓLEOS NACIONAIS',
            produtos: [
              { produto: 'NACIONAL MISTURA', codigo: '110110001' },
              { produto: 'OUTROS PETRÓLEOS NACIONAIS', codigo: '110110002' },
            ],
          },
          {
            subsubgrupo: 'BACIA DO SOLIMÕES',
            produtos: [{ produto: 'URUCU', codigo: '110109001' }],
          },
        ],
      },
      {
        grupo: 'CONDENSADO',
        subgrupo: 'IMPORTADO',
        subsubgrupos: [
          {
            subsubgrupo: 'CONDENSADOS DO ORIENTE MÉDIO',
            produtos: [
              { produto: 'AL KHAYMAH', codigo: '120204001' },
              { produto: 'DOLPHIN', codigo: '120204010' },
              { produto: 'KHUFF', codigo: '120204009' },
              { produto: 'LIBIA', codigo: '120204002' },
              { produto: 'MARGHAM', codigo: '120204003' },
              { produto: 'MELLITAH', codigo: '120204010' },
              { produto: 'NORTH FIELD', codigo: '120204004' },
              { produto: 'RAS GAS', codigo: '120204008' },
              { produto: 'SHARJAH', codigo: '120204005' },
              { produto: 'THAMAMA', codigo: '120204006' },
              { produto: 'UMM SAIF', codigo: '120204007' },
            ],
          },
          {
            subsubgrupo: 'CONDENSADOS DA EUROPA E EX-URSS',
            produtos: [
              { produto: 'ALBA FIELD', codigo: '120206001' },
              { produto: 'PUROVSKY', codigo: '120206003' },
              { produto: 'SLEIPNER', codigo: '120206002' },
              { produto: 'SNOHVIT', codigo: '120206004' },
            ],
          },
          {
            subsubgrupo: 'CONDENSADOS DA ÁSIA',
            produtos: [
              { produto: 'ANOA', codigo: '120205010' },
              { produto: 'ARUM', codigo: '120205001' },
              { produto: 'BINTULU', codigo: '120205002' },
              { produto: 'BRUNEI', codigo: '120205003' },
              { produto: 'CONDENSADO SENIPAH', codigo: '120205009' },
              { produto: 'ERAWAN', codigo: '120205004' },
              { produto: 'GERAGAI', codigo: '120205012' },
              { produto: 'INDIANO', codigo: '120205005' },
              { produto: 'MALAMPAYA', codigo: '120205011' },
              { produto: 'PEMBINA', codigo: '120205006' },
              { produto: 'TERENGANU', codigo: '120205007' },
              { produto: 'THAI', codigo: '120205008' },
            ],
          },
          {
            subsubgrupo: 'CONDENSADOS DA ÁFRICA',
            produtos: [
              { produto: 'ARGELINO', codigo: '120203002' },
              { produto: 'AR-720', codigo: '120203001' },
              { produto: 'BREGA', codigo: '120203004' },
              { produto: 'ESPOIR', codigo: '120203007' },
              { produto: 'LION', codigo: '120203006' },
              { produto: 'MELLITAH', codigo: '120203005' },
              { produto: 'MISKAR', codigo: '120203008' },
              { produto: 'OSO', codigo: '120203003' },
            ],
          },
          {
            subsubgrupo: 'CONDENSADOS DA AMÉRICA DO NORTE & CARIBE',
            produtos: [
              { produto: 'BADAK', codigo: '120202001' },
              { produto: 'CARLINE', codigo: '120202002' },
            ],
          },
          {
            subsubgrupo: 'CONDENSADOS DA OCEANIA',
            produtos: [
              { produto: 'BAYU UNDAN', codigo: '120207003' },
              { produto: 'COSSACK', codigo: '120207001' },
              { produto: 'KITAN', codigo: '120207004' },
              { produto: 'MAUI', codigo: '120207002' },
              { produto: 'VARANUS', codigo: '120207006' },
              { produto: 'WOOLLYBUTT CRUDE', codigo: '120207005' },
            ],
          },
          {
            subsubgrupo: 'CONDENSADOS DA AMÉRICA DO SUL',
            produtos: [
              { produto: 'BOLIVIANO', codigo: '120201001' },
              { produto: 'SANTA ROSA', codigo: '120201002' },
              { produto: 'TERRA DEL FUEGO', codigo: '120201003' },
            ],
          },
        ],
      },
      {
        grupo: 'RENOVAVEIS',
        subgrupo: 'ETANOL',
        subsubgrupos: [
          {
            subsubgrupo: 'MATÉRIA - PRIMA DE 2ª GERAÇÃO',
            produtos: [
              { produto: 'BAGAÇO OU PALHA DE CANA', codigo: '140202001' },
            ],
          },
          {
            subsubgrupo: 'MATÉRIA - PRIMA DE 1ª GERAÇÃO',
            produtos: [
              { produto: 'CANA DE AÇÚCAR', codigo: '140201001' },
              { produto: 'MELAÇO', codigo: '140201002' },
              { produto: 'MILHO', codigo: '140201003' },
              { produto: 'OUTRAS MATÉRIAS - PRIMAS', codigo: '140201004' },
            ],
          },
        ],
      },
      {
        grupo: 'RENOVAVEIS',
        subgrupo: 'BIOMETANO',
        subsubgrupos: [
          {
            subsubgrupo: 'BIOGÁS',
            produtos: [
              { produto: 'BIOGÁS DE OUTRAS ORIGENS', codigo: '140301005' },
              {
                produto: 'BIOGÁS DE RESÍDUO AGROSSILVOPASTORIL',
                codigo: '140301002',
              },
              { produto: 'BIOGÁS DE RESÍDUO DE ESGOTO', codigo: '140301003' },
              { produto: 'BIOGÁS DE RESÍDUO ORGÂNICO', codigo: '140301004' },
              {
                produto: 'BIOGÁS DE RESÍDUO SÓLIDO URBANO',
                codigo: '140301001',
              },
            ],
          },
        ],
      },
      {
        grupo: 'CONDENSADO',
        subgrupo: 'NACIONAL',
        subsubgrupos: [
          {
            subsubgrupo: 'BACIA DO ESPIRITO SANTO',
            produtos: [
              { produto: 'CONDENSADO CAMARUPIM', codigo: '120104001' },
              { produto: 'CONDENSADO PEROA', codigo: '120104002' },
            ],
          },
          {
            subsubgrupo: 'OUTROS CONDENSADOS',
            produtos: [
              { produto: 'CONDENSADO PARA PETROQUÍMICA', codigo: '120102001' },
            ],
          },
          {
            subsubgrupo: 'CAMAMU',
            produtos: [{ produto: 'MANATI', codigo: '120103001' }],
          },
          {
            subsubgrupo: 'BACIA DE SANTOS',
            produtos: [{ produto: 'MERLUZA', codigo: '120101001' }],
          },
        ],
      },
      {
        grupo: 'OUTROS INSUMOS BRUTOS',
        subgrupo: 'OUTROS INSUMOS BRUTOS',
        subsubgrupos: [
          {
            subsubgrupo: 'PRODUTOS PARA REPROCESSAMENTO',
            produtos: [
              {
                produto: 'DERIVADOS LEVES PARA REPROCESSAMENTO',
                codigo: '130202002',
              },
              {
                produto: 'DERIVADOS MÉDIOS PARA REPROCESSAMENTO',
                codigo: '130202003',
              },
              {
                produto: 'DERIVADOS PESADOS PARA REPROCESSAMENTO',
                codigo: '130202004',
              },
              { produto: 'DILUENTE PARA REPROCESSAMENTO', codigo: '130202006' },
              {
                produto: 'GASES LIQUEFEITOS PARA REPROCESSAMENTO',
                codigo: '130202001',
              },
              { produto: 'GASÓLEO PARA REPROCESSAMENTO', codigo: '130202005' },
              {
                produto: 'OUTROS PRODUTOS PARA REPROCESSAMENTO',
                codigo: '130202008',
              },
              { produto: 'RESÍDUO PARA REPROCESSAMENTO', codigo: '130202007' },
            ],
          },
          {
            subsubgrupo: 'OUTROS INSUMOS BRUTOS',
            produtos: [
              {
                produto: 'ETANOL ANIDRO INSUMO PARA BIODIESEL',
                codigo: '130201002',
              },
              { produto: 'OUTROS INSUMOS BRUTOS', codigo: '130201001' },
            ],
          },
        ],
      },
      {
        grupo: 'PETRÓLEO',
        subgrupo: 'MISTURA',
        subsubgrupos: [
          {
            subsubgrupo: 'MISTURA',
            produtos: [
              { produto: 'MISTURA DE PETRÓLEOS', codigo: '110301001' },
            ],
          },
        ],
      },
      {
        grupo: 'OUTROS INSUMOS BRUTOS',
        subgrupo: 'XISTO',
        subsubgrupos: [
          {
            subsubgrupo: 'XISTO',
            produtos: [{ produto: 'XISTO BRUTO', codigo: '130101001' }],
          },
        ],
      },
    ],
  },
  {
    familia: 'COMBUSTÍVEIS ALTERNATIVOS',
    grupos: [
      {
        grupo: 'QUEROSENE ALTERNATIVO',
        subgrupo: 'QUEROSENE ALTERNATIVO',
        subsubgrupos: [
          {
            subsubgrupo: 'QUEROSENE DE AVIAÇÃO ALTERNATIVO',
            produtos: [
              {
                produto: 'Ácidos graxos e ésteres hidroprocessados (SPK-HEFA)',
                codigo: '850101002',
              },
              {
                produto: 'Isoparafinas sintetizadas (SIP)',
                codigo: '850101003',
              },
              {
                produto:
                  'Querosene parafínico sintetizado hidroprocessado por Fischer-Tropsch (SPK-FT)',
                codigo: '850101001',
              },
            ],
          },
        ],
      },
      {
        grupo: 'ÁLCOOL',
        subgrupo: 'OUTROS ALCOÓIS',
        subsubgrupos: [
          {
            subsubgrupo: 'OUTROS ALCOÓIS',
            produtos: [
              { produto: 'ÁLCOOL METÍLICO', codigo: '810201001' },
              { produto: 'OUTROS ALCOÓIS', codigo: '810201002' },
            ],
          },
        ],
      },
      {
        grupo: 'BIODIESEL',
        subgrupo: 'BIODIESEL',
        subsubgrupos: [
          {
            subsubgrupo: 'BIODIESEL',
            produtos: [
              { produto: 'BIODIESEL B100', codigo: '820101001' },
              {
                produto: 'BIODIESEL FORA DE ESPECIFICAÇÃO',
                codigo: '820101010',
              },
              {
                produto: 'BIODIESEL FORA DE ESPECIFICAÇÃO',
                codigo: '820101999',
              },
              {
                produto: 'DIESEL B S10 PARA GERAÇÃO DE ENERGIA ELÉTRICA',
                codigo: '820101032',
              },
              {
                produto:
                  'DIESEL B S1800 NÃO RODOVIÁRIO PARA GERAÇÃO DE ENERGIA ELÉTRICA',
                codigo: '820101026',
              },
              {
                produto: 'DIESEL B S1800 PARA GERAÇÃO DE ENERGIA ELÉTRICA',
                codigo: '820101026',
              },
              {
                produto: 'DIESEL B S50 PARA GERAÇÃO DE ENERGIA ELÉTRICA',
                codigo: '820101032',
              },
              {
                produto: 'DIESEL B S500 PARA GERAÇÃO DE ENERGIA ELÉTRICA',
                codigo: '820101027',
              },
              { produto: 'DIESEL B10', codigo: '820101004' },
              { produto: 'DIESEL B15', codigo: '820101005' },
              {
                produto: 'DIESEL B2 ESPECIAL - 200 PPM ENXOFRE',
                codigo: '820101022',
              },
              { produto: 'DIESEL B2 INTERIOR ADITIVADO', codigo: '820101007' },
              { produto: 'DIESEL B2 INTERIOR COMUM', codigo: '820101002' },
              {
                produto: 'DIESEL B2 METROPOLITANO ADITIVADO',
                codigo: '820101009',
              },
              { produto: 'DIESEL B2 METROPOLITANO COMUM', codigo: '820101008' },
              { produto: 'DIESEL B20 INTERIOR ADITIVADO', codigo: '820101014' },
              { produto: 'DIESEL B20 INTERIOR COMUM', codigo: '820101006' },
              {
                produto: 'DIESEL B20 METROPOLITANDO ADITIVADO',
                codigo: '820101016',
              },
              {
                produto: 'DIESEL B20 METROPOLITANO COMUM',
                codigo: '820101015',
              },
              { produto: 'DIESEL B20 S10 ADITIVADO', codigo: '820101031' },
              { produto: 'DIESEL B20 S10 COMUM', codigo: '820101030' },
              { produto: 'DIESEL B20 S1800 - ADITIVADO', codigo: '820101014' },
              { produto: 'DIESEL B20 S1800 - COMUM', codigo: '820101006' },
              {
                produto: 'DIESEL B20 S1800 NÃO RODOVIÁRIO - ADITIVADO',
                codigo: '820101014',
              },
              {
                produto: 'DIESEL B20 S1800 NÃO RODOVIÁRIO - COMUM',
                codigo: '820101006',
              },
              { produto: 'DIESEL B20 S50 ADITIVADO', codigo: '820101031' },
              { produto: 'DIESEL B20 S50 COMUM', codigo: '820101030' },
              { produto: 'DIESEL B20 S500 - ADITIVADO', codigo: '820101016' },
              { produto: 'DIESEL B20 S500 - COMUM', codigo: '820101015' },
              { produto: 'DIESEL B30', codigo: '820101025' },
              { produto: 'DIESEL B4 INTERIOR ADITIVADO', codigo: '820101007' },
              { produto: 'DIESEL B4 INTERIOR COMUM', codigo: '820101002' },
              {
                produto: 'DIESEL B4 INTERIOR PARA GERAÇÃO DE ENERGIA ELÉTRICA',
                codigo: '820101026',
              },
              {
                produto: 'DIESEL B4 METROPOLITANO ADITIVADO',
                codigo: '820101009',
              },
              { produto: 'DIESEL B4 METROPOLITANO COMUM', codigo: '820101008' },
              {
                produto:
                  'DIESEL B4 METROPOLITANO PARA GERAÇÃO DE ENERGIA ELÉTRICA',
                codigo: '820101027',
              },
              { produto: 'DIESEL B4 S1800 - ADITIVADO', codigo: '820101007' },
              { produto: 'DIESEL B4 S1800 - COMUM', codigo: '820101002' },
              { produto: 'DIESEL B4 S50 ADITIVADO', codigo: '820101028' },
              { produto: 'DIESEL B4 S50 COMUM', codigo: '820101029' },
              { produto: 'DIESEL B4 S500 - ADITIVADO', codigo: '820101009' },
              { produto: 'DIESEL B4 S500 - COMUM', codigo: '820101008' },
              { produto: 'DIESEL B5 INTERIOR ADITIVADO', codigo: '820101011' },
              { produto: 'DIESEL B5 INTERIOR COMUM', codigo: '820101003' },
              {
                produto: 'DIESEL B5 METROPOLITANO ADITIVADO',
                codigo: '820101013',
              },
              { produto: 'DIESEL B5 METROPOLITANO COMUM', codigo: '820101012' },
              { produto: 'DIESEL MARÍTIMO - DMA B2', codigo: '820101017' },
              { produto: 'DIESEL MARÍTIMO - DMA B5', codigo: '820101018' },
              { produto: 'DIESEL MARÍTIMO - DMB B2', codigo: '820101019' },
              { produto: 'DIESEL MARÍTIMO - DMB B5', codigo: '820101020' },
              {
                produto: 'DIESEL NÁUTICO B2 ESPECIAL - 200 PPM ENXOFRE',
                codigo: '820101021',
              },
              {
                produto: 'MIST. DIESEL MARÍTIMO-95% / BIODIESEL-5%',
                codigo: '820101018',
              },
              {
                produto: 'MIST. DIESEL MARÍTIMO-98% / BIODIESEL-2%',
                codigo: '820101017',
              },
              {
                produto: 'MIST. DIESEL-80% / BIODIESEL-20% - B20',
                codigo: '820101006',
              },
              {
                produto: 'MIST. DIESEL-80% / BIODIESEL-20% - B20 INT ADITIV',
                codigo: '820101014',
              },
              {
                produto: 'MIST. DIESEL-80% / BIODIESEL-20% - B20 INT COMUM',
                codigo: '820101006',
              },
              {
                produto: 'MIST. DIESEL-80% / BIODIESEL-20% - B20 MET ADITIV',
                codigo: '820101016',
              },
              {
                produto: 'MIST. DIESEL-80% / BIODIESEL-20% - B20 MET COMUM',
                codigo: '820101015',
              },
              {
                produto: 'MIST. DIESEL-80% / BIODIESEL-20% - B5 INT COMUM',
                codigo: '820101006',
              },
              {
                produto: 'MIST. DIESEL-85% / BIODIESEL-15% - B15',
                codigo: '820101005',
              },
              {
                produto: 'MIST. DIESEL-90% / BIODIESEL-10% - B10',
                codigo: '820101004',
              },
              {
                produto: 'MIST. DIESEL-95% / BIODIESEL-5% - B5',
                codigo: '820101003',
              },
              {
                produto: 'MIST. DIESEL-95% / BIODIESEL-5% - B5 INT ADITIVADO',
                codigo: '820101011',
              },
              {
                produto: 'MIST. DIESEL-95% / BIODIESEL-5% - B5 INT COMUM',
                codigo: '820101003',
              },
              {
                produto: 'MIST. DIESEL-95% / BIODIESEL-5% - B5 MET ADITIVADO',
                codigo: '820101013',
              },
              {
                produto: 'MIST. DIESEL-95% / BIODIESEL-5% - B5 MET COMUM',
                codigo: '820101012',
              },
              {
                produto: 'MIST. DIESEL-98% / BIODIESEL-2% - B2',
                codigo: '820101002',
              },
              {
                produto: 'MIST. DIESEL-98% / BIODIESEL-2% - B2 INT ADITIVADO',
                codigo: '820101007',
              },
              {
                produto: 'MIST. DIESEL-98% / BIODIESEL-2% - B2 INT COMUM',
                codigo: '820101002',
              },
              {
                produto: 'MIST. DIESEL-98% / BIODIESEL-2% - B2 MET ADITIVADO',
                codigo: '820101009',
              },
              {
                produto: 'MIST. DIESEL-98% / BIODIESEL-2% - B2 MET COMUM',
                codigo: '820101008',
              },
              { produto: 'ÓLEO DIESEL B S10 - ADITIVADO', codigo: '820101033' },
              { produto: 'ÓLEO DIESEL B S10 - COMUM', codigo: '820101034' },
              {
                produto: 'ÓLEO DIESEL B S1800 - ADITIVADO',
                codigo: '820101011',
              },
              { produto: 'ÓLEO DIESEL B S1800 - COMUM', codigo: '820101003' },
              {
                produto: 'ÓLEO DIESEL B S1800 NÃO RODOVIÁRIO - ADITIVADO',
                codigo: '820101011',
              },
              {
                produto: 'ÓLEO DIESEL B S1800 NÃO RODOVIÁRIO - COMUM',
                codigo: '820101003',
              },
              { produto: 'ÓLEO DIESEL B S50 - ADITIVADO', codigo: '820101028' },
              { produto: 'ÓLEO DIESEL B S50 - COMUM', codigo: '820101029' },
              {
                produto: 'ÓLEO DIESEL B S500 - ADITIVADO',
                codigo: '820101013',
              },
              { produto: 'ÓLEO DIESEL B S500 - COMUM', codigo: '820101012' },
              {
                produto: 'ÓLEO DIESEL S10 B20 AUTORIZATIVO',
                codigo: '820101030',
              },
              {
                produto: 'ÓLEO DIESEL S10 B30 AUTORIZATIVO',
                codigo: '820101025',
              },
              {
                produto: 'ÓLEO DIESEL S1800 NÃO RODOVIÁRIO B20 AUTORIZATIVO',
                codigo: '820101006',
              },
              {
                produto: 'ÓLEO DIESEL S1800 NÃO RODOVIÁRIO B30 AUTORIZATIVO',
                codigo: '820101036',
              },
              {
                produto: 'ÓLEO DIESEL S500 B20 AUTORIZATIVO',
                codigo: '820101015',
              },
              {
                produto: 'ÓLEO DIESEL S500 B30 AUTORIZATIVO',
                codigo: '820101035',
              },
            ],
          },
        ],
      },
      {
        grupo: 'GASOSOS',
        subgrupo: 'BIOMETANO',
        subsubgrupos: [
          {
            subsubgrupo: 'BIOMETANO',
            produtos: [
              { produto: 'BIOMETANO', codigo: '840101001' },
              {
                produto: 'BIOMETANO FORA DE ESPECIFICAÇÃO',
                codigo: '840101002',
              },
            ],
          },
        ],
      },
      {
        grupo: 'ÁLCOOL',
        subgrupo: 'ETANOL',
        subsubgrupos: [
          {
            subsubgrupo: 'ETANOL ANIDRO',
            produtos: [
              { produto: 'ETANOL ANIDRO', codigo: '810102001' },
              { produto: 'ETANOL ANIDRO COM CORANTE', codigo: '810102004' },
              {
                produto: 'ETANOL ANIDRO DE REFERÊNCIA - EAR',
                codigo: '810102003',
              },
              {
                produto: 'ETANOL ANIDRO FORA DE ESPECIFICAÇÃO',
                codigo: '810102002',
              },
              { produto: 'ETANOL ANIDRO PADRÃO', codigo: '810102003' },
            ],
          },
          {
            subsubgrupo: 'ETANOL FORA DE ESPECIFICAÇÃO',
            produtos: [
              { produto: 'ETANOL FORA DE ESPECIFICAÇÃO', codigo: '810103001' },
            ],
          },
          {
            subsubgrupo: 'ETANOL HIDRATADO',
            produtos: [
              { produto: 'ETANOL HIDRATADO ADITIVADO', codigo: '810101002' },
              { produto: 'ETANOL HIDRATADO COMUM', codigo: '810101001' },
              {
                produto: 'ETANOL HIDRATADO DE REFERÊNCIA - EHR',
                codigo: '810101006',
              },
              {
                produto: 'ETANOL HIDRATADO FORA DE ESPECIFICAÇÃO',
                codigo: '810101003',
              },
              { produto: 'ETANOL HIDRATADO PREMIUM', codigo: '810101004' },
              {
                produto: 'ETANOL HIDRATADO PREMIUM ADITIVADO',
                codigo: '810101005',
              },
            ],
          },
        ],
      },
      {
        grupo: 'ÓLEO DIESEL ALTERNATIVO',
        subgrupo: 'ÓLEO DIESEL RENOVÁVEL',
        subsubgrupos: [
          {
            subsubgrupo: 'ÓLEO DIESEL DE CANA',
            produtos: [
              { produto: 'ÓLEO DIESEL DE CANA AMD 100', codigo: '830101001' },
            ],
          },
        ],
      },
    ],
  },
  {
    familia: 'SUBPRODUTOS OU ADITIVOS',
    grupos: [
      {
        grupo: 'ADITIVOS',
        subgrupo: 'ADITIVOS',
        subsubgrupos: [
          {
            subsubgrupo: 'ADITIVOS',
            produtos: [
              {
                produto: 'ADITIVO ANTIOXIDANTE PARA BIODIESEL',
                codigo: '740101008',
              },
              { produto: 'ADITIVOS PARA BIODIESEL', codigo: '740101005' },
              {
                produto: 'ADITIVOS PARA ETANOL HIDRATADO',
                codigo: '740101004',
              },
              { produto: 'ADITIVOS PARA GASOLINA', codigo: '740101001' },
              { produto: 'ADITIVOS PARA LUBRIFICANTES', codigo: '740101006' },
              { produto: 'ADITIVOS PARA ÓLEO DIESEL', codigo: '740101002' },
              { produto: 'METIL TERC BUTIL ETER - MTBE', codigo: '740101007' },
              { produto: 'OUTROS ADITIVOS', codigo: '740101003' },
            ],
          },
        ],
      },
      {
        grupo: 'ENXOFRE',
        subgrupo: 'ENXOFRE',
        subsubgrupos: [
          {
            subsubgrupo: 'ENXOFRE',
            produtos: [
              { produto: 'ENXOFRE LÍQUIDO', codigo: '720101001' },
              { produto: 'ENXOFRE SÓLIDO', codigo: '720101002' },
            ],
          },
        ],
      },
      {
        grupo: 'OUTROS SUB-PRODUTOS',
        subgrupo: 'OUTROS SUB-PRODUTOS',
        subsubgrupos: [
          {
            subsubgrupo: 'OUTROS SUB-PRODUTOS',
            produtos: [
              { produto: 'GLICERINA', codigo: '730101002' },
              { produto: 'OUTROS SUB-PRODUTOS', codigo: '730101001' },
            ],
          },
        ],
      },
      {
        grupo: 'HIDROGÊNIO',
        subgrupo: 'HIDROGÊNIO',
        subsubgrupos: [
          {
            subsubgrupo: 'HIDROGÊNIO',
            produtos: [{ produto: 'HIDROGÊNIO', codigo: '710101001' }],
          },
        ],
      },
    ],
  },
  {
    familia: 'PRODUTOS INORGÂNICOS',
    grupos: [
      {
        grupo: 'ÁGUA',
        subgrupo: 'ÁGUA',
        subsubgrupos: [
          {
            subsubgrupo: 'ÁGUA',
            produtos: [{ produto: 'ÁGUA', codigo: '910101001' }],
          },
        ],
      },
    ],
  },
  {
    familia: 'DERIVADOS LEVES',
    grupos: [
      {
        grupo: 'SOLVENTES',
        subgrupo: 'SOLVENTES',
        subsubgrupos: [
          {
            subsubgrupo: 'SOLVENTES ALIFÁTICOS',
            produtos: [
              { produto: 'AGUARRÁS MINERAL', codigo: '330101001' },
              { produto: 'DILUENTE DE TINTAS', codigo: '330101003' },
              { produto: 'HEPTANO', codigo: '330101008' },
              { produto: 'HEXANO', codigo: '330101002' },
              { produto: 'HEXENO', codigo: '330101009' },
              { produto: 'ISOPENTANO', codigo: '330101010' },
              { produto: 'OUTROS SOLVENTES ALIFÁTICOS', codigo: '330101007' },
              { produto: 'RAFINADO DE PIRÓLISE', codigo: '330101005' },
              { produto: 'RAFINADO DE REFORMA', codigo: '330101006' },
              { produto: 'SOLVENTE PARA BORRACHA', codigo: '330101004' },
            ],
          },
          {
            subsubgrupo: 'SOLVENTES AROMÁTICOS',
            produtos: [
              { produto: 'ALQUILBENZENO AB10', codigo: '330201005' },
              { produto: 'ALQUILBENZENO AB11', codigo: '330201006' },
              { produto: 'ALQUILBENZENO AB9', codigo: '330201004' },
              { produto: 'BENZENO', codigo: '330201001' },
              {
                produto: 'C9 DIHIDROGENADO (OU C9 DE PIRÓLISE)',
                codigo: '330201007',
              },
              { produto: 'ETILBENZENO', codigo: '330201010' },
              { produto: 'OUTROS SOLVENTES AROMÁTICOS', codigo: '330201009' },
              { produto: 'SOLVENTE C9 (OU C9 AROMÁTICO)', codigo: '330201008' },
              { produto: 'TOLUENO', codigo: '330201002' },
              { produto: 'XILENOS', codigo: '330201003' },
            ],
          },
        ],
      },
      {
        grupo: 'OUTROS DERIVADOS LEVES',
        subgrupo: 'OUTROS DERIVADOS LEVES',
        subsubgrupos: [
          {
            subsubgrupo: 'OUTROS DERIVADOS LEVES',
            produtos: [
              {
                produto: 'DERIVADOS LEVES INTERMEDIÁRIOS',
                codigo: '340101002',
              },
              { produto: 'OUTROS DERIVADOS LEVES', codigo: '340101003' },
              { produto: 'REFORMADOS', codigo: '340101001' },
            ],
          },
        ],
      },
      {
        grupo: 'GASOLINAS',
        subgrupo: 'GASOLINAS AUTOMOTIVAS',
        subsubgrupos: [
          {
            subsubgrupo: 'GASOLINA A',
            produtos: [
              { produto: 'GASOLINA A COMUM', codigo: '320101001' },
              {
                produto: 'GASOLINA A FORA DE ESPECIFICAÇÃO',
                codigo: '320101003',
              },
              { produto: 'GASOLINA A PREMIUM', codigo: '320101002' },
            ],
          },
          {
            subsubgrupo: 'OUTRAS GASOLINAS AUTOMOTIVAS',
            produtos: [
              { produto: 'GASOLINA AUTOMOTIVA PADRÃO', codigo: '320103001' },
              { produto: 'GASOLINA DE REFERÊNCIA', codigo: '320103001' },
              {
                produto: 'GASOLINA DE REFERÊNCIA - NBR 16038',
                codigo: '320103001',
              },
              {
                produto: 'GASOLINA DE REFERÊNCIA - PROCONVE L-6',
                codigo: '320103003',
              },
              { produto: 'OUTRAS GASOLINAS AUTOMOTIVAS', codigo: '320103002' },
            ],
          },
          {
            subsubgrupo: 'GASOLINA C',
            produtos: [
              { produto: 'GASOLINA C ADITIVADA', codigo: '320102002' },
              { produto: 'GASOLINA C COMUM', codigo: '320102001' },
              { produto: 'GASOLINA C COMUM ADITIVADA', codigo: '320102002' },
              {
                produto: 'GASOLINA C FORA DE ESPECIFICAÇÃO',
                codigo: '320102004',
              },
              { produto: 'GASOLINA C PREMIUM', codigo: '320102003' },
              { produto: 'GASOLINA C PREMIUM ADITIVADA', codigo: '320102005' },
            ],
          },
        ],
      },
      {
        grupo: 'GASOLINAS',
        subgrupo: 'GASOLINAS DE AVIAÇÃO',
        subsubgrupos: [
          {
            subsubgrupo: 'GASOLINAS DE AVIAÇÃO',
            produtos: [
              { produto: 'GASOLINA DE AVIAÇÃO', codigo: '320201001' },
              {
                produto: 'GASOLINA DE AVIAÇÃO FORA DE ESPECIFICAÇÃO',
                codigo: '320201002',
              },
            ],
          },
        ],
      },
      {
        grupo: 'GASOLINAS',
        subgrupo: 'OUTRAS GASOLINAS',
        subsubgrupos: [
          {
            subsubgrupo: 'OUTRAS GASOLINAS',
            produtos: [
              { produto: 'GASOLINA PARA EXPORTAÇÃO', codigo: '320301002' },
              { produto: 'OUTRAS GASOLINAS', codigo: '320301001' },
            ],
          },
        ],
      },
      {
        grupo: 'NAFTA',
        subgrupo: 'NAFTA',
        subsubgrupos: [
          {
            subsubgrupo: 'NAFTA PETROQUÍMICA',
            produtos: [
              { produto: 'NAFTA', codigo: '310101001' },
              { produto: 'NAFTA PETROQUÍMICA', codigo: '310101001' },
            ],
          },
          {
            subsubgrupo: 'OUTRAS NAFTAS',
            produtos: [
              { produto: 'NAFTA DE XISTO', codigo: '310102001' },
              { produto: 'OUTRAS NAFTAS', codigo: '310102002' },
            ],
          },
          {
            subsubgrupo: 'NAFTA FORA DE ESPECIFICAÇÃO',
            produtos: [
              { produto: 'NAFTA FORA DE ESPECIFICAÇÃO', codigo: '310103001' },
            ],
          },
        ],
      },
    ],
  },
  {
    familia: 'DERIVADOS PESADOS',
    grupos: [
      {
        grupo: 'ASFALTOS',
        subgrupo: 'INDUSTRIALIZADOS',
        subsubgrupos: [
          {
            subsubgrupo: 'CAP MODIFICADO POR BORRACHA',
            produtos: [
              {
                produto: 'AP MODIFICADO POR BORRACHA DE PNEU AB22',
                codigo: '530206002',
              },
              {
                produto: 'CAP MODIFICADO POR BORRACHA DE PNEU AB8',
                codigo: '530206001',
              },
            ],
          },
          {
            subsubgrupo: 'ASFALTOS DILUÍDOS',
            produtos: [
              { produto: 'ASFALTOS DILUÍDOS CM-30', codigo: '530202003' },
              { produto: 'ASFALTOS DILUÍDOS CM-70', codigo: '530202004' },
              { produto: 'ASFALTOS DILUÍDOS CR-250', codigo: '530202002' },
              { produto: 'ASFALTOS DILUÍDOS CR-70', codigo: '530202001' },
            ],
          },
          {
            subsubgrupo: 'CAP MODIFICADO POR POLÍMEROS',
            produtos: [
              {
                produto: 'CAP MODIFICADO POR POLÍMERO 55/75-E',
                codigo: '530204001',
              },
              {
                produto: 'CAP MODIFICADO POR POLÍMERO 60/85-E',
                codigo: '530204002',
              },
              {
                produto: 'CAP MODIFICADO POR POLÍMERO 65/90-E',
                codigo: '530204003',
              },
            ],
          },
          {
            subsubgrupo: 'CIMENTOS ASFÁLTICOS',
            produtos: [
              {
                produto: 'CIMENTOS ASFÁLTICOS CAP-150-200',
                codigo: '530201004',
              },
              { produto: 'CIMENTOS ASFÁLTICOS CAP-30-45', codigo: '530201001' },
              { produto: 'CIMENTOS ASFÁLTICOS CAP-50-70', codigo: '530201002' },
              {
                produto: 'CIMENTOS ASFÁLTICOS CAP-85-100',
                codigo: '530201003',
              },
            ],
          },
          {
            subsubgrupo: 'EMULSÕES ASFÁLTICAS',
            produtos: [
              {
                produto:
                  'EMULSÃO ASFÁLTICA CATIÔNICA DE RUPTURA CONTROLADA PARA SERVIÇO DE LAMA ASFÁLTICA',
                codigo: '530203009',
              },
              {
                produto:
                  'EMULSÃO ASFÁLTICA DE RUPTURA LENTA CATIÔNICA PARA SERVIÇO DE LAMA ASFÁLTICA',
                codigo: '530203006',
              },
              {
                produto:
                  'EMULSÃO ASFÁLTICA DE RUPTURA LENTA DE CARGA NEUTRA PARA SERVIÇO DE LAMA ASFÁLTICA',
                codigo: '530203007',
              },
              {
                produto: 'EMULSÃO ASFÁLTICA PARA SERVIÇO DE IMPRIMAÇÃO',
                codigo: '530203008',
              },
              { produto: 'EMULSÕES ASFÁLTICAS RL-1C', codigo: '530203005' },
              { produto: 'EMULSÕES ASFÁLTICAS RM-1C', codigo: '530203003' },
              { produto: 'EMULSÕES ASFÁLTICAS RM-2C', codigo: '530203004' },
              { produto: 'EMULSÕES ASFÁLTICAS RR-1C', codigo: '530203001' },
              { produto: 'EMULSÕES ASFÁLTICAS RR-2C', codigo: '530203002' },
            ],
          },
          {
            subsubgrupo: 'EMULSÕES ASFÁLTICAS CATIÔNICAS MODIFICADAS',
            produtos: [
              {
                produto: 'EMULSÕES ASF. MOD. POR POLÍMEROS RC1C-E',
                codigo: '530205004',
              },
              {
                produto: 'EMULSÕES ASF. MOD. POR POLÍMEROS RL1C-E',
                codigo: '530205005',
              },
              {
                produto: 'EMULSÕES ASF. MOD. POR POLÍMEROS RM1C-E',
                codigo: '530205003',
              },
              {
                produto: 'EMULSÕES ASF. MOD. POR POLÍMEROS RR1C-E',
                codigo: '530205001',
              },
              {
                produto: 'EMULSÕES ASF. MOD. POR POLÍMEROS RR2C-E',
                codigo: '530205002',
              },
            ],
          },
        ],
      },
      {
        grupo: 'ASFALTOS',
        subgrupo: 'ASFALTOS',
        subsubgrupos: [
          {
            subsubgrupo: 'ASFALTOS NATURAIS',
            produtos: [{ produto: 'ASFALTO NATURAL', codigo: '530102001' }],
          },
          {
            subsubgrupo: 'INDUSTRIALIZADOS',
            produtos: [
              { produto: 'ASFALTOS DILUÍDOS', codigo: '530101002' },
              { produto: 'CIMENTOS ASFÁLTICOS', codigo: '530101001' },
              {
                produto:
                  'CIMENTOS ASFÁLTICOS DE PETRÓLEO MODIFICADOS POR BORRACHA MOÍDA DE PNEUS (ASFALTOS BORRACHA)',
                codigo: '530101020',
              },
              {
                produto:
                  'CIMENTOS ASFÁLTICOS DE PETRÓLEO MODIFICADOS POR POLÍMEROS',
                codigo: '530101018',
              },
              { produto: 'EMULSÕES ASFÁLTICAS', codigo: '530101003' },
              {
                produto:
                  'EMULSÕES ASFÁLTICAS CATIÔNICAS MODIFICADAS POR POLÍMEROS ELASTOMÉRICOS',
                codigo: '530101019',
              },
            ],
          },
          {
            subsubgrupo: 'OUTROS ASFALTOS',
            produtos: [{ produto: 'OUTROS ASFALTOS', codigo: '530103001' }],
          },
          {
            subsubgrupo: 'INSUMOS NÃO REGULADOS',
            produtos: [
              { produto: 'OUTROS INSUMOS PARA ASFALTOS', codigo: '530104001' },
            ],
          },
        ],
      },
      {
        grupo: 'COQUE',
        subgrupo: 'COQUE',
        subsubgrupos: [
          {
            subsubgrupo: 'COQUE',
            produtos: [
              { produto: 'COQUE CALCINADO', codigo: '540101002' },
              { produto: 'COQUE VERDE', codigo: '540101001' },
            ],
          },
        ],
      },
      {
        grupo: 'OUTROS DERIVADOS PESADOS',
        subgrupo: 'OUTROS DERIVADOS PESADOS',
        subsubgrupos: [
          {
            subsubgrupo: 'OUTROS DERIVADOS PESADOS',
            produtos: [
              {
                produto: 'DERIVADOS PESADOS INTERMEDIÁRIOS',
                codigo: '560101002',
              },
              { produto: 'ÓLEO DE XISTO', codigo: '560101001' },
              { produto: 'OUTROS DERIVADOS PESADOS', codigo: '560101003' },
            ],
          },
        ],
      },
      {
        grupo: 'GASÓLEOS',
        subgrupo: 'GASÓLEOS',
        subsubgrupos: [
          {
            subsubgrupo: 'GASÓLEOS',
            produtos: [{ produto: 'GASÓLEOS', codigo: '520101001' }],
          },
        ],
      },
      {
        grupo: 'ÓLEOS COMBUSTÍVEIS',
        subgrupo: 'ÓLEOS COMBUSTÍVEIS INDUSTRIAIS',
        subsubgrupos: [
          {
            subsubgrupo: 'ÓLEO COMBUSTÍVEL A - ALTO TEOR DE ENXOFRE',
            produtos: [
              {
                produto: 'ÓLEO COMBUSTÍVEL A FORA DE ESPECIFICAÇÃO',
                codigo: '510101003',
              },
              { produto: 'ÓLEO COMBUSTÍVEL A1', codigo: '510101001' },
              { produto: 'ÓLEO COMBUSTÍVEL A2', codigo: '510101002' },
            ],
          },
          {
            subsubgrupo: 'ÓLEO COMBUSTÍVEL B - BAIXO TEOR DE ENXOFRE',
            produtos: [
              {
                produto: 'ÓLEO COMBUSTÍVEL B FORA DE ESPECIFICAÇÃO',
                codigo: '510102003',
              },
              { produto: 'ÓLEO COMBUSTÍVEL B1', codigo: '510102001' },
              { produto: 'ÓLEO COMBUSTÍVEL B2', codigo: '510102002' },
            ],
          },
          {
            subsubgrupo: 'ÓLEO COMBUSTÍVEL 3 (OC3)',
            produtos: [
              { produto: 'ÓLEO COMBUSTÍVEL 3 (OC3)', codigo: '510103001' },
            ],
          },
        ],
      },
      {
        grupo: 'ÓLEOS COMBUSTÍVEIS',
        subgrupo: 'ÓLEOS COMBUSTÍVEIS MARÍTIMOS',
        subsubgrupos: [
          {
            subsubgrupo: 'ÓLEOS COMBUSTÍVEIS MARÍTIMOS',
            produtos: [
              { produto: 'ÓLEO COMBUSTÍVEL MARÍTIMO', codigo: '510201001' },
              {
                produto: 'ÓLEO COMBUSTÍVEL MARÍTIMO FORA DE ESPECIFICAÇÃO',
                codigo: '510201002',
              },
              {
                produto: 'ÓLEO COMBUSTÍVEL MARÍTIMO MISTURA (MF)',
                codigo: '510201003',
              },
              {
                produto: 'ÓLEO COMBUSTÍVEL MARÍTIMO 120 (OCM 120)',
                codigo: '510201004',
              },
              {
                produto: 'ÓLEO COMBUSTÍVEL MARÍTIMO 180 (OCM 180)',
                codigo: '510201005',
              },
              {
                produto: 'ÓLEO COMBUSTÍVEL MARÍTIMO 380 (OCM 380)',
                codigo: '510201006',
              },
            ],
          },
        ],
      },
      {
        grupo: 'ÓLEOS COMBUSTÍVEIS',
        subgrupo: 'OUTROS ÓLEOS COMBUSTÍVEIS',
        subsubgrupos: [
          {
            subsubgrupo: 'OUTROS ÓLEOS COMBUSTÍVEIS',
            produtos: [
              {
                produto: 'ÓLEO COMBUSTÍVEL PARA GERAÇÃO ELÉTRICA',
                codigo: '510301003',
              },
              {
                produto: 'ÓLEOS COMBUSTÍVEIS PARA EXPORTAÇÃO',
                codigo: '510301002',
              },
              { produto: 'OUTROS ÓLEOS COMBUSTÍVEIS', codigo: '510301001' },
            ],
          },
        ],
      },
      {
        grupo: 'RESÍDUOS PESADOS',
        subgrupo: 'RESÍDUOS PESADOS',
        subsubgrupos: [
          {
            subsubgrupo: 'RESÍDUOS PESADOS',
            produtos: [
              { produto: 'RESÍDUO AROMÁTICO (RARO)', codigo: '550101001' },
              { produto: 'RESÍDUO ASFÁLTICO(RASF)', codigo: '550101005' },
              { produto: 'RESÍDUO ATMOSFÉRICO (RAT)', codigo: '550101002' },
              { produto: 'RESÍDUO DE VÁCUO', codigo: '550101003' },
              {
                produto: 'RESÍDUO DE VÁCUO DE ALTO TEOR DE ENXOGRE',
                codigo: '550101004',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    familia: 'ÓLEOS LUBRIFICANTES, PARAFINAS E GRAXAS',
    grupos: [
      {
        grupo: 'ÓLEOS LUBRIFICANTES BÁSICOS',
        subgrupo: 'PARAFÍNICOS',
        subsubgrupos: [
          {
            subsubgrupo: 'PARAFÍNICOS - GRUPO I',
            produtos: [
              { produto: 'BRIGHT STOCK', codigo: '610101009' },
              { produto: 'CILINDRO I', codigo: '610101005' },
              { produto: 'CILINDRO II', codigo: '610101006' },
              { produto: 'NEUTRO LEVE', codigo: '610101002' },
              { produto: 'NEUTRO MÉDIO', codigo: '610101003' },
              { produto: 'NEUTRO PESADO', codigo: '610101004' },
              { produto: 'OUTROS PARAFÍNICOS', codigo: '610101010' },
              { produto: 'SPINDLE', codigo: '610101001' },
              { produto: 'TURBINA LEVE', codigo: '610101007' },
              { produto: 'TURBINA PESADO', codigo: '610101008' },
            ],
          },
        ],
      },
      {
        grupo: 'ÓLEOS LUBRIFICANTES BÁSICOS',
        subgrupo: 'GRUPO I - CLASSIFICAÇÃO API',
        subsubgrupos: [
          {
            subsubgrupo: 'YPF/ARGENTINA',
            produtos: [
              { produto: 'BRIGHT STOCK', codigo: '610801001' },
              { produto: 'NEUTRAL OIL 150', codigo: '610801002' },
              { produto: 'NEUTRAL OIL 500', codigo: '610801004' },
              { produto: 'NEUTRAL OIL 60', codigo: '610801005' },
              { produto: 'NEUTRAL OIL300', codigo: '610801003' },
            ],
          },
          {
            subsubgrupo: 'REPSOL YPF/ESPANHA',
            produtos: [
              { produto: 'BS', codigo: '610811001' },
              { produto: 'SN 150', codigo: '610811002' },
              { produto: 'SN 500', codigo: '610811003' },
            ],
          },
          {
            subsubgrupo: 'CEPSA LUBRIFICANTES/ESPANHA',
            produtos: [
              { produto: 'BS', codigo: '610803003' },
              { produto: 'N 500', codigo: '610803002' },
              { produto: 'SN 150', codigo: '610803001' },
            ],
          },
          {
            subsubgrupo: 'TOTAL LUBRICANTS/FRANÇA',
            produtos: [
              { produto: 'BS', codigo: '610812001' },
              { produto: 'SN 150', codigo: '610812002' },
              { produto: 'SN 330', codigo: '610812003' },
              { produto: 'SN 500', codigo: '610812004' },
              { produto: 'SN 600', codigo: '610812005' },
              { produto: 'SN 85', codigo: '610812006' },
            ],
          },
          {
            subsubgrupo: 'ENI SPA./ITÁLIA',
            produtos: [
              { produto: 'BS 150', codigo: '610805001' },
              { produto: 'SN 150', codigo: '610805002' },
              { produto: 'SN 500', codigo: '610805003' },
            ],
          },
          {
            subsubgrupo: 'EXXON MOBIL/EUA',
            produtos: [
              { produto: 'BS 2500', codigo: '610806003' },
              { produto: 'CORE 100', codigo: '610806006' },
              { produto: 'CORE 150', codigo: '610806007' },
              { produto: 'CORE 2500', codigo: '610806008' },
              { produto: 'CORE 600', codigo: '610806009' },
              { produto: 'SN 150', codigo: '610806001' },
              { produto: 'SN 275', codigo: '610806004' },
              { produto: 'SN 330', codigo: '610806005' },
              { produto: 'SN 600', codigo: '610806002' },
            ],
          },
          {
            subsubgrupo: 'CALUMET/EUA',
            produtos: [
              { produto: 'CALPAR 150', codigo: '610802001' },
              { produto: 'CALPAR 500', codigo: '610802002' },
            ],
          },
          {
            subsubgrupo: 'PENRECO/USA',
            produtos: [{ produto: 'CONOSOL 260', codigo: '610804001' }],
          },
          {
            subsubgrupo: 'SHELL/ALEMANHA',
            produtos: [
              { produto: 'HVI 120', codigo: '610808001' },
              { produto: 'HVI 60', codigo: '610808002' },
            ],
          },
          {
            subsubgrupo: 'RERREFINADOR/BRASIL',
            produtos: [
              { produto: 'NEUTRO LEVE RR', codigo: '610813002' },
              { produto: 'NEUTRO MÉDIO RR', codigo: '610813003' },
              { produto: 'NEUTRO PESADO RR', codigo: '610813004' },
              { produto: 'SPINDLE RR', codigo: '610813001' },
            ],
          },
          {
            subsubgrupo: 'OUTRO',
            produtos: [{ produto: 'OUTRO', codigo: '610814001' }],
          },
          {
            subsubgrupo: 'PETROBRÁS/BRASIL',
            produtos: [
              { produto: 'PBS 30', codigo: '610809002' },
              { produto: 'PBS 33', codigo: '610809001' },
              { produto: 'PCL 45', codigo: '610809003' },
              { produto: 'PCL 60', codigo: '610809004' },
              { produto: 'PNL 30', codigo: '610809005' },
              { produto: 'PNM 55', codigo: '610809006' },
              { produto: 'PNM 80', codigo: '610809007' },
              { produto: 'PNP 95', codigo: '610809008' },
              { produto: 'PSP 09', codigo: '610809009' },
              { produto: 'PTL 25', codigo: '610809010' },
              { produto: 'PTP 85', codigo: '610809011' },
            ],
          },
          {
            subsubgrupo: 'HAIFA/ISRAEL',
            produtos: [
              { produto: 'SN 150', codigo: '610807001' },
              { produto: 'SN 500', codigo: '610807002' },
            ],
          },
          {
            subsubgrupo: 'PETROGAL/PORTUGAL',
            produtos: [
              { produto: 'SN 150', codigo: '610810001' },
              { produto: 'SN 500', codigo: '610810002' },
            ],
          },
        ],
      },
      {
        grupo: 'ÓLEOS LUBRIFICANTES ACABADOS',
        subgrupo: 'ÓLEOS LUBRIFICANTES AUTOMOTIVOS',
        subsubgrupos: [
          {
            subsubgrupo: 'MOTORES 4 TEMPOS',
            produtos: [
              { produto: 'CICLO DIESEL', codigo: '620501002' },
              { produto: 'CICLO OTTO', codigo: '620501001' },
            ],
          },
          {
            subsubgrupo: 'MOTORES 2 TEMPOS',
            produtos: [{ produto: 'MOTORES 2 TEMPOS', codigo: '620502001' }],
          },
          {
            subsubgrupo: 'OUTROS ÓLEOS LUBRIFICANTES AUTOMOTIVOS',
            produtos: [
              {
                produto: 'OUTROS ÓLEOS LUBRIFICANTES AUTOMOTIVOS',
                codigo: '620505001',
              },
            ],
          },
          {
            subsubgrupo: 'TRANSMISSÃO AUTOMÁTICA',
            produtos: [
              { produto: 'TRANSMISSÃO AUTOMÁTICA', codigo: '620504001' },
            ],
          },
          {
            subsubgrupo: 'TRANSMISSÕES E SISTEMAS HIDRÁULICOS',
            produtos: [
              {
                produto: 'TRANSMISSÕES E SISTEMAS HIDRÁULICOS',
                codigo: '620503001',
              },
            ],
          },
        ],
      },
      {
        grupo: 'ÓLEOS LUBRIFICANTES ACABADOS',
        subgrupo: 'ÓLEOS LUBRIFICANTES ACABADOS',
        subsubgrupos: [
          {
            subsubgrupo: 'ÓLEOS LUBRIFICANTES ACABADOS',
            produtos: [
              { produto: 'CORRENTE DE MOTOSSERRA', codigo: '620601003' },
              {
                produto: 'ÓLEOS EXTENSORES E PLASTIFICANTES',
                codigo: '620601001',
              },
              {
                produto: 'OUTROS ÓLEOS LUBRIFICANTES ACABADOS',
                codigo: '620601004',
              },
              { produto: 'PULVERIZAÇÃO AGRÍCOLA', codigo: '620601002' },
            ],
          },
        ],
      },
      {
        grupo: 'ÓLEOS LUBRIFICANTES BÁSICOS',
        subgrupo: 'GRUPO II - CLASSIFICAÇÃO API',
        subsubgrupos: [
          {
            subsubgrupo: 'EXXO MOBIL/EUA',
            produtos: [
              { produto: 'EHC 45', codigo: '610903001' },
              { produto: 'EHC 60', codigo: '610903002' },
            ],
          },
          {
            subsubgrupo: 'EXCEL PARALUBES/FILIPINAS',
            produtos: [{ produto: 'FLINT HILLS', codigo: '610904001' }],
          },
          {
            subsubgrupo: 'MOTIVA/EUA',
            produtos: [
              { produto: 'NEUTRAL 110', codigo: '610905001' },
              { produto: 'STAR 10', codigo: '610905002' },
              { produto: 'STAR 12', codigo: '610905003' },
              { produto: 'STAR 4', codigo: '610905004' },
              { produto: 'STAR 6', codigo: '610905005' },
            ],
          },
          {
            subsubgrupo: 'LWART/BRASIL',
            produtos: [
              { produto: 'NEUTRO LEVE RR', codigo: '610906002' },
              { produto: 'NEUTRO MÉDIO RR', codigo: '610906003' },
              { produto: 'NEUTRO PESADO RR', codigo: '610906004' },
              { produto: 'SPINDLE RR', codigo: '610906001' },
            ],
          },
          {
            subsubgrupo: 'OUTRO',
            produtos: [{ produto: 'OUTRO', codigo: '610907001' }],
          },
          {
            subsubgrupo: 'PHILIPS 66/EUA',
            produtos: [
              { produto: '100N', codigo: '610902001' },
              { produto: '225N', codigo: '610902002' },
              { produto: '600N', codigo: '610902003' },
            ],
          },
          {
            subsubgrupo: 'CHEVRON/EUA',
            produtos: [
              { produto: '100N', codigo: '610901005' },
              { produto: '100R', codigo: '610901001' },
              { produto: '150R', codigo: '610901002' },
              { produto: '220R', codigo: '610901003' },
              { produto: '600R', codigo: '610901004' },
            ],
          },
        ],
      },
      {
        grupo: 'ÓLEOS LUBRIFICANTES ACABADOS',
        subgrupo: 'ÓLEOS LUBRIFICANTES INDUSTRIAIS',
        subsubgrupos: [
          {
            subsubgrupo: 'ÓLEOS LUBRIFICANTES INDUSTRIAIS',
            produtos: [
              {
                produto: 'ENGRENAGENS E SISTEMAS CIRCULATÓRIOS',
                codigo: '620101002',
              },
              { produto: 'ESTAMPAGEM', codigo: '620101007' },
              { produto: 'HIDRÁULICO', codigo: '620101001' },
              { produto: 'ISOLANTE TIPO A', codigo: '620101004' },
              { produto: 'ISOLANTE TIPO B', codigo: '620101005' },
              {
                produto: 'OUTROS ÓLEOS LUBRIFICANTES INDUSTRIAIS',
                codigo: '620101008',
              },
              { produto: 'PROCESSO', codigo: '620101003' },
              { produto: 'TÊXTIL / AMACIANTE DE FIBRAS', codigo: '620101006' },
            ],
          },
        ],
      },
      {
        grupo: 'ÓLEOS LUBRIFICANTES BÁSICOS',
        subgrupo: 'GRUPO III - CLASSIFICAÇÃO API',
        subsubgrupos: [
          {
            subsubgrupo: 'PETRONAS/MALÁSIA',
            produtos: [
              { produto: 'ETRO 4', codigo: '611003001' },
              { produto: 'ETRO 6', codigo: '611003002' },
              { produto: 'ETRO 8', codigo: '611003003' },
            ],
          },
          {
            subsubgrupo: 'NESTE/FINLÂNDIA',
            produtos: [
              { produto: 'NEXBASE 3030', codigo: '611001001' },
              { produto: 'NEXBASE 3043', codigo: '611001002' },
              { produto: 'NEXBASE 3050', codigo: '611001003' },
              { produto: 'NEXBASE 3060', codigo: '611001004' },
              { produto: 'NEXBASE 3080', codigo: '611001005' },
            ],
          },
          {
            subsubgrupo: 'OUTRO',
            produtos: [{ produto: 'OUTRO', codigo: '611007001' }],
          },
          {
            subsubgrupo: 'S OIL/COREIA DO SUL',
            produtos: [
              { produto: 'ULTRA-S 2', codigo: '611004001' },
              { produto: 'ULTRA-S 4', codigo: '611004002' },
              { produto: 'ULTRA-S 6', codigo: '611004003' },
              { produto: 'ULTRA-S 8', codigo: '611004004' },
            ],
          },
          {
            subsubgrupo: 'PETROCANADA/CANADA',
            produtos: [
              { produto: 'VHVI 4', codigo: '611002001' },
              { produto: 'VHVI 6', codigo: '611002002' },
              { produto: 'VHVI 8', codigo: '611002003' },
            ],
          },
          {
            subsubgrupo: 'SHELL/QATAR',
            produtos: [
              { produto: 'XHVI 4', codigo: '611005001' },
              { produto: 'XHVI 8', codigo: '611005002' },
            ],
          },
          {
            subsubgrupo: 'SK/COREIA DO SUL',
            produtos: [
              { produto: 'YUBASE 3', codigo: '611006001' },
              { produto: 'YUBASE 4', codigo: '611006002' },
              { produto: 'YUBASE 6', codigo: '611006003' },
            ],
          },
        ],
      },
      {
        grupo: 'GRAXAS',
        subgrupo: 'GRAXAS',
        subsubgrupos: [
          {
            subsubgrupo: 'GRAXAS',
            produtos: [
              { produto: 'GRAXAS DE CALCIO', codigo: '650101004' },
              { produto: 'GRAXAS DE LITIO', codigo: '650101003' },
              { produto: 'GRAXAS MINERAIS', codigo: '650101001' },
              { produto: 'OUTRAS GRAXAS', codigo: '650101002' },
            ],
          },
        ],
      },
      {
        grupo: 'ÓLEOS LUBRIFICANTES BÁSICOS',
        subgrupo: 'NAFTÊNICOS',
        subsubgrupos: [
          {
            subsubgrupo: 'NAFTÊNICOS - GRUPO V',
            produtos: [
              { produto: 'HIDROGENADO LEVE', codigo: '610201001' },
              { produto: 'HIDROGENADO MÉDIO', codigo: '610201002' },
              { produto: 'HIDROGENADO PESADO', codigo: '610201003' },
              { produto: 'OUTROS NAFTÊNICOS', codigo: '610201004' },
            ],
          },
        ],
      },
      {
        grupo: 'PARAFINAS',
        subgrupo: 'MACRO',
        subsubgrupos: [
          {
            subsubgrupo: 'MACROCRISTALINAS',
            produtos: [{ produto: 'MACROOLEOSAS', codigo: '640201001' }],
          },
        ],
      },
      {
        grupo: 'PARAFINAS',
        subgrupo: 'MICRO',
        subsubgrupos: [
          {
            subsubgrupo: 'MICROCRISTALINAS',
            produtos: [{ produto: 'MICROOLEOSAS', codigo: '640101001' }],
          },
        ],
      },
      {
        grupo: 'ÓLEOS LUBRIFICANTES BÁSICOS',
        subgrupo: 'GRUPO V - CLASSIFICAÇÃO API',
        subsubgrupos: [
          {
            subsubgrupo: 'SHELL/ALEMANHA',
            produtos: [
              { produto: 'MVI (N) 40 - NAFTÊNICO', codigo: '611201002' },
              { produto: 'MVI 1050 - NAFTÊNICO', codigo: '611201003' },
              { produto: 'MVI(N) 170 - NAFTÊNICO', codigo: '611201001' },
            ],
          },
          {
            subsubgrupo: 'OUTRO',
            produtos: [
              { produto: 'NAFTALENOS ALQUILADOS (AN)', codigo: '611207003' },
              { produto: 'ÓLEO MINERAL BRANCO', codigo: '611207002' },
              { produto: 'ÓLEOS VEGETAIS', codigo: '611207004' },
              { produto: 'OUTRO', codigo: '611207006' },
              { produto: 'OUTROS ÉSTERES SINTÉTICOS', codigo: '611207001' },
              { produto: 'PLIGLICÓIS', codigo: '611207005' },
            ],
          },
          {
            subsubgrupo: 'PETROBRAS/BRASIL',
            produtos: [
              { produto: 'NH 10 - NAFTÊNICO', codigo: '611202001' },
              { produto: 'NH 140 - NAFTÊNICO', codigo: '611202002' },
              { produto: 'NH 20 - NAFTÊNICO', codigo: '611202003' },
            ],
          },
          {
            subsubgrupo: 'NYNAS/FINLÂNDIA',
            produtos: [
              { produto: 'NYNAS T22 - NAFTÊNICO', codigo: '611203002' },
              { produto: 'SR 130 - NAFTÊNICO', codigo: '611203001' },
              { produto: 'T 9 - NAFTÊNICO', codigo: '611203003' },
            ],
          },
          {
            subsubgrupo: 'BRASKEN/BRASIL',
            produtos: [{ produto: 'PIB 24 - POLIBUTENO', codigo: '611204001' }],
          },
          {
            subsubgrupo: 'CRODA DO BRASIL/BRASIL',
            produtos: [
              { produto: 'PRIOLUBE 3970 - ÉSTER', codigo: '611206001' },
              { produto: 'PRIOLUBE 3999 - ÉSTER', codigo: '611206002' },
            ],
          },
          {
            subsubgrupo: 'INFINEUM BRASIL/BRASIL',
            produtos: [
              { produto: 'VISTONE A-10 - ÉSTER', codigo: '611205001' },
            ],
          },
        ],
      },
      {
        grupo: 'ÓLEOS LUBRIFICANTES BÁSICOS',
        subgrupo: 'RERREFINADOS',
        subsubgrupos: [
          {
            subsubgrupo: 'RERREFINADOS',
            produtos: [
              { produto: 'NEUTRO LEVE RR', codigo: '610401002' },
              { produto: 'NEUTRO MÉDIO RR', codigo: '610401003' },
              { produto: 'NEUTRO PESADO RR', codigo: '610401004' },
              { produto: 'SPINDLE RR', codigo: '610401001' },
            ],
          },
        ],
      },
      {
        grupo: 'ÓLEOS LUBRIFICANTES BÁSICOS',
        subgrupo: 'GRUPO IV - CLASSIFICAÇÃO API',
        subsubgrupos: [
          {
            subsubgrupo: 'NESTE/FINLÂNDIA',
            produtos: [
              { produto: 'NEXBASE 2002', codigo: '611102001' },
              { produto: 'NEXBASE 2004', codigo: '611102002' },
              { produto: 'NEXBASE 2006', codigo: '611102003' },
              { produto: 'NEXBASE 2008', codigo: '611102004' },
            ],
          },
          {
            subsubgrupo: 'OUTRO',
            produtos: [{ produto: 'OUTRO', codigo: '611107001' }],
          },
          {
            subsubgrupo: 'INEOS/EUA',
            produtos: [
              { produto: 'PAO 4', codigo: '611106002' },
              { produto: 'PAO 6', codigo: '611106003' },
              { produto: 'PAO 8', codigo: '611106001' },
            ],
          },
          {
            subsubgrupo: 'CHEVRON PHILIPS/EUA',
            produtos: [{ produto: 'PAO 4', codigo: '611103001' }],
          },
          {
            subsubgrupo: 'CHEMTURA/EUA',
            produtos: [{ produto: 'PAO 40', codigo: '611104001' }],
          },
          {
            subsubgrupo: 'EXXON MOBIL/EUA',
            produtos: [
              { produto: 'PAO 8', codigo: '611101007' },
              { produto: 'SPECTRASYN 100', codigo: '611101001' },
              { produto: 'SPECTRASYN 2', codigo: '611101002' },
              { produto: 'SPECTRASYN 4', codigo: '611101003' },
              { produto: 'SPECTRASYN 40', codigo: '611101004' },
              { produto: 'SPECTRASYN 6', codigo: '611101005' },
              { produto: 'SPECTRASYN 8', codigo: '611101006' },
            ],
          },
          {
            subsubgrupo: 'CHEVRON PHILLIPS/EUA',
            produtos: [
              { produto: 'SYNFLUID PAO 100', codigo: '611105001' },
              { produto: 'SYNFLUID PAO 4', codigo: '611105002' },
              { produto: 'SYNFLUID PAO 40', codigo: '611105003' },
              { produto: 'SYNFLUID PAO 6', codigo: '611105004' },
              { produto: 'SYNFLUID PAO 8', codigo: '611105005' },
            ],
          },
        ],
      },
      {
        grupo: 'ÓLEOS LUBRIFICANTES BÁSICOS',
        subgrupo: 'ÓLEOS BÁSICOS -  GRUPO I',
        subsubgrupos: [
          {
            subsubgrupo: 'ÓLEOS BÁSICOS  - GRUPO I',
            produtos: [
              { produto: 'ÓLEOS BÁSICOS - GRUPO I', codigo: '611301001' },
            ],
          },
        ],
      },
      {
        grupo: 'ÓLEOS LUBRIFICANTES BÁSICOS',
        subgrupo: 'ÓLEOS BÁSICOS - GRUPO II',
        subsubgrupos: [
          {
            subsubgrupo: 'ÓLEOS BÁSICOS - GRUPO II',
            produtos: [
              { produto: 'ÓLEOS BÁSICOS - GRUPO II', codigo: '610601001' },
            ],
          },
        ],
      },
      {
        grupo: 'ÓLEOS LUBRIFICANTES BÁSICOS',
        subgrupo: 'ÓLEOS BÁSICOS - GRUPO III',
        subsubgrupos: [
          {
            subsubgrupo: 'ÓLEOS BÁSICOS - GRUPO III',
            produtos: [
              { produto: 'ÓLEOS BÁSICOS - GRUPO III', codigo: '610701001' },
            ],
          },
        ],
      },
      {
        grupo: 'OUTROS ÓLEOS LUB. PARAF. E GRAXAS',
        subgrupo: 'OUTROS ÓLEOS LUB. PARAF. E GRAXAS',
        subsubgrupos: [
          {
            subsubgrupo: 'OUTROS ÓLEOS LUB. PARAF. E GRAXAS',
            produtos: [
              {
                produto: 'ÓLEOS LUB. PARAF E GRAXAS INTERMEDIÁRIOS',
                codigo: '660101001',
              },
            ],
          },
        ],
      },
      {
        grupo: 'ÓLEOS LUBRIFICANTES ACABADOS',
        subgrupo: 'ÓLEOS LUBRIFICANTES FERROVIÁRIOS',
        subsubgrupos: [
          {
            subsubgrupo: 'ÓLEOS LUBRIFICANTES FERROVIÁRIOS',
            produtos: [
              {
                produto: 'ÓLEOS LUBRIFICANTES FERROVIÁRIOS',
                codigo: '620401001',
              },
            ],
          },
        ],
      },
      {
        grupo: 'ÓLEOS LUBRIFICANTES ACABADOS',
        subgrupo: 'ÓLEOS LUBRIFICANTES MARÍTIMOS',
        subsubgrupos: [
          {
            subsubgrupo: 'ÓLEOS LUBRIFICANTES MARÍTIMOS',
            produtos: [
              { produto: 'ÓLEOS LUBRIFICANTES MARÍTIMOS', codigo: '620301001' },
            ],
          },
        ],
      },
      {
        grupo: 'ÓLEOS LUBRIFICANTES ACABADOS',
        subgrupo: 'ÓLEOS LUBRIFICANTES PARA AVIAÇÃO',
        subsubgrupos: [
          {
            subsubgrupo: 'ÓLEOS LUBRIFICANTES PARA AVIAÇÃO',
            produtos: [
              {
                produto: 'ÓLEOS LUBRIFICANTES PARA AVIAÇÃO',
                codigo: '620201001',
              },
            ],
          },
        ],
      },
      {
        grupo: 'ÓLEOS LUBRIFICANTES USADOS OU CONTAMINADOS',
        subgrupo: 'ÓLEOS LUBRIFICANTES USADOS OU CONTAMINADOS',
        subsubgrupos: [
          {
            subsubgrupo: 'ÓLEOS LUBRIFICANTES USADOS OU CONTAMINADOS',
            produtos: [
              {
                produto: 'ÓLEOS LUBRIFICANTES USADOS OU CONTAMINADOS',
                codigo: '630101001',
              },
            ],
          },
        ],
      },
      {
        grupo: 'PARAFINAS',
        subgrupo: 'OUTRAS PARAFINAS',
        subsubgrupos: [
          {
            subsubgrupo: 'OUTRAS PARAFINAS',
            produtos: [{ produto: 'OUTRAS PARAFINAS', codigo: '640401001' }],
          },
        ],
      },
      {
        grupo: 'ÓLEOS LUBRIFICANTES BÁSICOS',
        subgrupo: 'OUTROS ÓLEOS LUBRIFICANTES BÁSICOS',
        subsubgrupos: [
          {
            subsubgrupo: 'OUTROS ÓLEOS LUBRIFICANTES BÁSICOS - GRUPO VI',
            produtos: [
              {
                produto: 'OUTROS ÓLEOS LUBRIFICANTES BÁSICOS',
                codigo: '610501001',
              },
            ],
          },
        ],
      },
      {
        grupo: 'ÓLEOS LUBRIFICANTES BÁSICOS',
        subgrupo: 'SINTÉTICOS',
        subsubgrupos: [
          {
            subsubgrupo: 'SINTÉTICOS - GRUPO IV',
            produtos: [
              { produto: 'OUTROS SINTÉTICOS', codigo: '610301002' },
              { produto: 'POLIALFAOLEFINA', codigo: '610301001' },
            ],
          },
          {
            subsubgrupo: 'SINTÉTICOS - GRUPO V',
            produtos: [{ produto: 'OUTROS SINTÉTICOS', codigo: '610302001' }],
          },
        ],
      },
      {
        grupo: 'PARAFINAS',
        subgrupo: 'VASELINA',
        subsubgrupos: [
          {
            subsubgrupo: 'VASELINA',
            produtos: [{ produto: 'VASELINA', codigo: '640301001' }],
          },
        ],
      },
    ],
  },
  {
    familia: 'GASES',
    grupos: [
      {
        grupo: 'GASES',
        subgrupo: 'GASES LIQUEFEITOS',
        subsubgrupos: [
          {
            subsubgrupo: 'C4',
            produtos: [
              { produto: 'BUTADIENO', codigo: '210202003' },
              { produto: 'BUTANO', codigo: '210202001' },
              { produto: 'BUTANO ESPECIAL', codigo: '210202002' },
            ],
          },
          {
            subsubgrupo: 'GASES LIQUEFEITO DE PETRÓLEO - GLP',
            produtos: [
              { produto: 'BUTANO COMERCIAL', codigo: '210203005' },
              { produto: 'GLP', codigo: '210203001' },
              { produto: 'GLP FORA DE ESPECIFICAÇÃO', codigo: '210203002' },
              { produto: 'PROPANO COMERCIAL', codigo: '210203003' },
              { produto: 'PROPANO ESPECIAL', codigo: '210203004' },
            ],
          },
          {
            subsubgrupo: 'OUTROS GASES LIQUEFEITOS',
            produtos: [
              { produto: 'GÁS LIQUEFEITO INTERMEDIÁRIO', codigo: '210204001' },
              { produto: 'OUTROS GASES LIQUEFEITOS', codigo: '210204002' },
            ],
          },
          {
            subsubgrupo: 'C3',
            produtos: [
              { produto: 'PROPANO', codigo: '210201001' },
              { produto: 'PROPANO ESPECIAL', codigo: '210201002' },
              { produto: 'PROPENO', codigo: '210201003' },
            ],
          },
        ],
      },
      {
        grupo: 'GASES',
        subgrupo: 'OUTROS GASES',
        subsubgrupos: [
          {
            subsubgrupo: 'C2',
            produtos: [
              { produto: 'ETANO', codigo: '210301001' },
              { produto: 'ETENO', codigo: '210301002' },
            ],
          },
          {
            subsubgrupo: 'OUTROS GASES',
            produtos: [
              { produto: 'GÁS ÁCIDO', codigo: '210302004' },
              { produto: 'GÁS DE XISTO', codigo: '210302003' },
              { produto: 'GÁS INTERMEDIÁRIO', codigo: '210302002' },
              { produto: 'OUTROS GASES', codigo: '210302001' },
            ],
          },
        ],
      },
      {
        grupo: 'GASES',
        subgrupo: 'GÁS COMBUSTÍVEL',
        subsubgrupos: [
          {
            subsubgrupo: 'GÁS COMBUSTÍVEL',
            produtos: [{ produto: 'GÁS COMBUSTÍVEL', codigo: '210101001' }],
          },
        ],
      },
      {
        grupo: 'GÁS NATURAL',
        subgrupo: 'GÁS NATURAL',
        subsubgrupos: [
          {
            subsubgrupo: 'GÁS NATURAL',
            produtos: [
              { produto: 'GÁS NATURAL COMPRIMIDO', codigo: '220101003' },
              { produto: 'GÁS NATURAL LIQUEFEITO', codigo: '220101004' },
              { produto: 'GÁS NATURAL SECO', codigo: '220101002' },
              { produto: 'GÁS NATURAL ÚMIDO', codigo: '220101001' },
              { produto: 'GÁS NATURAL VEICULAR', codigo: '220101005' },
              { produto: 'GÁS NATURAL VEICULAR PADRÃO', codigo: '220101006' },
            ],
          },
          {
            subsubgrupo: 'LÍQUIDO DE GÁS NATURAL',
            produtos: [
              { produto: 'GASOLINA NATURAL (C5+)', codigo: '220102001' },
              { produto: 'LÍQUIDO DE GÁS NATURAL', codigo: '220102002' },
            ],
          },
        ],
      },
    ],
  },
  {
    familia: 'DERIVADOS MÉDIOS',
    grupos: [
      {
        grupo: 'OUTROS DERIVADOS MÉDIOS',
        subgrupo: 'OUTROS DERIVADOS MÉDIOS',
        subsubgrupos: [
          {
            subsubgrupo: 'OUTROS DERIVADOS MÉDIOS',
            produtos: [
              {
                produto: 'DERIVADOS MÉDIOS INTERMEDIÁRIOS',
                codigo: '430101002',
              },
              { produto: 'NORMAL PARAFINAS', codigo: '430101001' },
              {
                produto: 'ÓLEO COMB. P/ TURBINA GERADORA DE ENERGIA ELÉTRICA',
                codigo: '430101004',
              },
              { produto: 'OUTROS DERIVADOS MÉDIOS', codigo: '430101003' },
            ],
          },
        ],
      },
      {
        grupo: 'ÓLEO DIESEL',
        subgrupo: 'ÓLEO DIESEL MARÍTIMO',
        subsubgrupos: [
          {
            subsubgrupo: 'ÓLEO DIESEL MARÍTIMO',
            produtos: [
              { produto: 'DMA - MGO', codigo: '420201001' },
              { produto: 'DMB - MDO', codigo: '420201003' },
              { produto: 'MGO', codigo: '420201003' },
              { produto: 'ÓLEO DIESEL MARÍTIMO', codigo: '420201001' },
              {
                produto: 'ÓLEO DIESEL MARÍTIMO FORA DE ESPECIFICAÇÃO',
                codigo: '420201002',
              },
            ],
          },
          {
            subsubgrupo: 'ÓLEO DIESEL MARÍTIMO COM BIOCOMBUSTÍVEL',
            produtos: [
              {
                produto: 'ÓLEO DIESEL MARÍTIMO A2 ou DMA2',
                codigo: '420203001',
              },
              {
                produto: 'ÓLEO DIESEL MARÍTIMO B2 ou DMB2',
                codigo: '420203002',
              },
            ],
          },
          {
            subsubgrupo: 'ÓLEO DIESEL ESPECIAIS',
            produtos: [
              {
                produto: 'ÓLEO DIESEL NÁUTICO ESPECIAL - ENXOFRE 200 PPM',
                codigo: '420202001',
              },
            ],
          },
        ],
      },
      {
        grupo: 'ÓLEO DIESEL',
        subgrupo: 'OUTROS ÓLEOS DIESEL',
        subsubgrupos: [
          {
            subsubgrupo: 'OUTROS ÓLEOS DIESEL',
            produtos: [
              {
                produto: 'ÓLEO DIESEL A FORA DE ESPECIFICAÇÃO',
                codigo: '420301003',
              },
              {
                produto: 'ÓLEO DIESEL B FORA DE ESPECIFICAÇÃO',
                codigo: '420301005',
              },
              {
                produto: 'ÓLEO DIESEL DE REFERÊNCIA - L-6 E P-7',
                codigo: '420301001',
              },
              {
                produto: 'OLEO DIESEL DE REFERÊNCIA - MAR-I',
                codigo: '420301004',
              },
              {
                produto: 'OLEO DIESEL DE REFERÊNCIA S300',
                codigo: '420301004',
              },
              {
                produto: 'ÓLEO DIESEL FORA DE ESPECIFICAÇÃO',
                codigo: '420301003',
              },
              { produto: 'ÓLEO DIESEL PADRÃO', codigo: '420301001' },
              { produto: 'OUTROS ÓLEOS DIESEL', codigo: '420301002' },
            ],
          },
        ],
      },
      {
        grupo: 'ÓLEO DIESEL',
        subgrupo: 'ÓLEOS DIESEL AUTOMOTIVOS',
        subsubgrupos: [
          {
            subsubgrupo: 'ÓLEOS DIESEL A S10',
            produtos: [{ produto: 'ÓLEO DIESEL A S10', codigo: '420105001' }],
          },
          {
            subsubgrupo: 'ÓLEOS DIESEL A S1800',
            produtos: [
              {
                produto: 'ÓLEO DIESEL A S1800 - ADITIVADO',
                codigo: '420101005',
              },
              { produto: 'ÓLEO DIESEL A S1800 - COMUM', codigo: '420101004' },
              {
                produto: 'ÓLEO DIESEL A S1800 - FORA DE ESPECIFICAÇÃO',
                codigo: '420101003',
              },
              {
                produto: 'ÓLEO DIESEL A S1800 NÃO RODOVIÁRIO',
                codigo: '420101004',
              },
              {
                produto: 'ÓLEO DIESEL A S1800 NÃO RODOVIÁRIO - ADITIVADO',
                codigo: '420101005',
              },
              {
                produto: 'ÓLEO DIESEL A S1800 NÃO RODOVIÁRIO - COMUM',
                codigo: '420101004',
              },
              {
                produto:
                  'ÓLEO DIESEL A S1800 NÃO RODOVIÁRIO - FORA DE ESPECIFICAÇÃO',
                codigo: '420101003',
              },
              {
                produto: 'ÓLEO DIESEL INTERIOR ADITIVADO - ENXOFRE 1800 PPM',
                codigo: '420101005',
              },
              {
                produto: 'ÓLEO DIESEL INTERIOR (B) ADITIVADO',
                codigo: '420101002',
              },
              {
                produto: 'ÓLEO DIESEL INTERIOR (B) COMUM',
                codigo: '420101001',
              },
              {
                produto: 'ÓLEO DIESEL INTERIOR (B) FORA DE ESPECIFICAÇÃO',
                codigo: '420101003',
              },
              {
                produto: 'ÓLEO DIESEL INTERIOR COMUM - ENXOFRE 1800 PPM',
                codigo: '420101004',
              },
              {
                produto: 'ÓLEO DIESEL INTERIOR FORA DE ESPECIFICAÇÃO',
                codigo: '420101003',
              },
            ],
          },
          {
            subsubgrupo: 'ÓLEOS DIESEL A S500',
            produtos: [
              { produto: 'ÓLEO DIESEL A S50', codigo: '420102006' },
              { produto: 'ÓLEO DIESEL A S500', codigo: '420102004' },
              {
                produto: 'ÓLEO DIESEL A S500 - ADITIVADO',
                codigo: '420102005',
              },
              { produto: 'ÓLEO DIESEL A S500 - COMUM', codigo: '420102004' },
              {
                produto: 'ÓLEO DIESEL A S500 - FORA DE ESPECIFICAÇÃO',
                codigo: '420102003',
              },
              {
                produto:
                  'ÓLEO DIESEL METROPOLITANO ADITIVADO - ENXOFRE 500 PPM',
                codigo: '420102005',
              },
              {
                produto: 'ÓLEO DIESEL METROPOLITANO COMUM - ENXOFRE 500 PPM',
                codigo: '420102004',
              },
              {
                produto: 'ÓLEO DIESEL METROPOLITANO (D) ADITIVADO',
                codigo: '420102002',
              },
              {
                produto: 'ÓLEO DIESEL METROPOLITANO (D) COMUM',
                codigo: '420102001',
              },
              {
                produto: 'ÓLEO DIESEL METROPOLITANO (D) FORA DE ESPECIFICAÇÃO',
                codigo: '420102003',
              },
              {
                produto: 'ÓLEO DIESEL METROPOLITANO FORA DE ESPECIFICAÇÃO',
                codigo: '420102003',
              },
              { produto: 'ÓLEO DIESEL S50', codigo: '420102006' },
            ],
          },
          {
            subsubgrupo: 'ÓLEOS DIESEL ESPECIAIS',
            produtos: [
              {
                produto: 'ÓLEO DIESEL AUTOMOTIVO ESPECIAL - ENXOFRE 200 PPM',
                codigo: '420104001',
              },
            ],
          },
          {
            subsubgrupo: 'ÓLEOS DIESEL AMD',
            produtos: [
              { produto: 'ÓLEO DIESEL B S10 AMD 10', codigo: '420106001' },
              { produto: 'ÓLEO DIESEL B S500 AMD 10', codigo: '420106002' },
            ],
          },
          {
            subsubgrupo: 'ÓLEOS DIESEL A S50',
            produtos: [
              { produto: 'ÓLEO DIESEL S500 ADITIVADO', codigo: '420103002' },
              { produto: 'ÓLEO DIESEL S500 COMUM', codigo: '420103001' },
              {
                produto: 'ÓLEO DIESEL S500 FORA DE ESPECIFICAÇÃO',
                codigo: '420103003',
              },
            ],
          },
        ],
      },
      {
        grupo: 'QUEROSENES',
        subgrupo: 'QUEROSENES',
        subsubgrupos: [
          {
            subsubgrupo: 'OUTROS QUEROSENES',
            produtos: [{ produto: 'OUTROS QUEROSENES', codigo: '410103001' }],
          },
          {
            subsubgrupo: 'QUEROSENES DE AVIAÇÃO',
            produtos: [
              { produto: 'QUEROSENE DE AVIAÇÃO', codigo: '410101001' },
              {
                produto: 'QUEROSENE DE AVIAÇÃO FORA DE ESPECIFICAÇÃO',
                codigo: '410101002',
              },
            ],
          },
          {
            subsubgrupo: 'QUEROSENES ILUMINANTES',
            produtos: [
              { produto: 'QUEROSENE ILUMINANTE', codigo: '410102001' },
              {
                produto: 'QUEROSENE ILUMINANTE FORA DE ESPECIFICAÇÃO',
                codigo: '410102002',
              },
            ],
          },
        ],
      },
    ],
  },
]
