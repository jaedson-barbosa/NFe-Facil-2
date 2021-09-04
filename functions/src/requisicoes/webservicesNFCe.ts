const AMP = 'https://nfce.sefaz.am.gov.br/nfce-services/services/'
const AMH = 'https://homnfce.sefaz.am.gov.br/nfce-services/services/'
const AM = {
  autorizacao: {
    producao: AMP + 'NfeAutorizacao4',
    homologacao: AMH + 'NfeAutorizacao4.asmx?wsdl',
  },
  retAutorizacao: {
    producao: AMP + 'NfeRetAutorizacao4',
    homologacao: AMH + 'NfeRetAutorizacao4.asmx?wsdl',
  },
  consultarStatusServico: {
    producao: AMP + 'NfeStatusServico4',
    homologacao: AMH + 'NfeStatusServico4.asmx?wsdl',
  },
  inutilizacao: {
    producao: AMP + 'NFeInutilizacao4',
    homologacao: AMH + 'NFeInutilizacao4.asmx?wsdl',
  },
}

const CEP = 'https://nfce.sefaz.ce.gov.br/nfce4/services/'
const CEH = 'https://nfceh.sefaz.ce.gov.br/nfce4/services/'
const CE = {
  autorizacao: {
    producao: CEP + 'NFeAutorizacao4?WSDL',
    homologacao: CEH + 'NFeAutorizacao4?WSDL',
  },
  retAutorizacao: {
    producao: CEP + 'NFeRetAutorizacao4?WSDL',
    homologacao: CEH + 'NFeRetAutorizacao4?WSDL',
  },
  consultarStatusServico: {
    producao: CEP + 'NFeStatusServico4?WSDL',
    homologacao: CEH + 'NFeStatusServico4?WSDL',
  },
  inutilizacao: {
    producao: CEP + 'NFeInutilizacao4?WSDL',
    homologacao: CEH + 'NFeInutilizacao4?WSDL',
  },
}

const GOP = 'https://nfe.sefaz.go.gov.br/nfe/services/'
const GOH = 'https://homolog.sefaz.go.gov.br/nfe/services/'
const GO = {
  autorizacao: {
    producao: GOP + 'NFeAutorizacao4?wsdl',
    homologacao: GOH + 'NFeAutorizacao4?wsdl',
  },
  retAutorizacao: {
    producao: GOP + 'NFeRetAutorizacao4?wsdl',
    homologacao: GOH + 'NFeRetAutorizacao4?wsdl',
  },
  consultarStatusServico: {
    producao: GOP + 'NFeStatusServico4?wsdl',
    homologacao: GOH + 'NFeStatusServico4?wsdl',
  },
  inutilizacao: {
    producao: GOP + 'NFeInutilizacao4',
    homologacao: GOH + 'Nfeinutilizacao4.asmx',
  },
}

const MTP = 'https://nfce.sefaz.mt.gov.br/nfcews/services/'
const MTH = 'https://homologacao.sefaz.mt.gov.br/nfcews/services/'
const MT = {
  autorizacao: {
    producao: MTP + 'NfeAutorizacao4',
    homologacao: MTH + 'NfeAutorizacao4',
  },
  retAutorizacao: {
    producao: MTP + 'NfeRetAutorizacao4',
    homologacao: MTH + 'NfeRetAutorizacao4',
  },
  consultarStatusServico: {
    producao: MTP + 'NfeStatusServico4',
    homologacao: MTH + 'NfeStatusServico4',
  },
  inutilizacao: {
    producao: MTP + 'NfeInutilizacao4',
    homologacao: MTH + 'Nfeinutilizacao4.asmx',
  },
}

const MSP = 'https://nfce.sefaz.ms.gov.br/ws/'
const MSH = 'https://hom.nfce.sefaz.ms.gov.br/ws/'
const MS = {
  autorizacao: {
    producao: MSP + 'NFeAutorizacao4',
    homologacao: MSH + 'NFeAutorizacao4',
  },
  retAutorizacao: {
    producao: MSP + 'NFeRetAutorizacao4',
    homologacao: MSH + 'NFeRetAutorizacao4',
  },
  consultarStatusServico: {
    producao: MSP + 'NFeStatusServico4',
    homologacao: MSH + 'NFeStatusServico4',
  },
  inutilizacao: {
    producao: MSP + 'NFeInutilizacao4',
    homologacao: MSH + 'Nfeinutilizacao4.asmx',
  },
}

const MGP = 'https://nfce.fazenda.mg.gov.br/nfce/services/'
const MGH = 'https://hnfce.fazenda.mg.gov.br/nfce/services/'
const MG = {
  autorizacao: {
    producao: MGP + 'NFeAutorizacao4',
    homologacao: MGH + 'NFeAutorizacao4',
  },
  retAutorizacao: {
    producao: MGP + 'NFeRetAutorizacao4',
    homologacao: MGH + 'NFeRetAutorizacao4',
  },
  consultarStatusServico: {
    producao: MGP + 'NFeStatusServico4',
    homologacao: MGH + 'NFeStatusServico4',
  },
  inutilizacao: {
    producao: MGP + 'NFeInutilizacao4',
    homologacao: MGH + 'Nfeinutilizacao4.asmx',
  },
}

const PRP = 'https://nfce.sefa.pr.gov.br/nfce/'
const PRH = 'https://homologacao.nfce.sefa.pr.gov.br/nfce/'
const PR = {
  autorizacao: {
    producao: PRP + 'NFeAutorizacao4',
    homologacao: PRH + 'NFeAutorizacao4',
  },
  retAutorizacao: {
    producao: PRP + 'NFeRetAutorizacao4',
    homologacao: PRH + 'NFeRetAutorizacao4',
  },
  consultarStatusServico: {
    producao: PRP + 'NFeStatusServico4',
    homologacao: PRH + 'NFeStatusServico4',
  },
  inutilizacao: {
    producao: PRP + 'NFeInutilizacao4',
    homologacao: PRH + 'Nfeinutilizacao4.asmx',
  },
}

const RSP = 'https://nfce.sefazrs.rs.gov.br/ws/'
const RSH = 'https://nfce-homologacao.sefazrs.rs.gov.br/ws/'
const RS = {
  autorizacao: {
    producao: RSP + 'NfeAutorizacao/NFeAutorizacao4.asmx',
    homologacao: RSH + '/NfeAutorizacao/NFeAutorizacao4.asmx?wsdl',
  },
  retAutorizacao: {
    producao: RSP + 'NfeRetAutorizacao/NFeRetAutorizacao4.asmx',
    homologacao: RSH + '/NfeRetAutorizacao/NFeRetAutorizacao4.asmx?wsdl',
  },
  consultarStatusServico: {
    producao: RSP + 'NfeStatusServico/NfeStatusServico4.asmx',
    homologacao: RSH + '/NfeStatusServico/NfeStatusServico4.asmx?wsdl',
  },
  inutilizacao: {
    producao: RSP + 'nfeinutilizacao/nfeinutilizacao4.asmx',
    homologacao: RSH + '/nfeinutilizacao/nfeinutilizacao4.asmx',
  },
}

const SVRSP = 'https://nfce.svrs.rs.gov.br/ws/'
const SVRSH = 'https://nfce-homologacao.svrs.rs.gov.br/ws/'
const SVRS = {
  autorizacao: {
    producao: SVRSP + 'NfeAutorizacao/NFeAutorizacao4.asmx',
    homologacao: SVRSH + 'NfeAutorizacao/NFeAutorizacao4.asmx',
  },
  retAutorizacao: {
    producao: SVRSP + 'NfeRetAutorizacao/NFeRetAutorizacao4.asmx',
    homologacao: SVRSH + 'NfeRetAutorizacao/NFeRetAutorizacao4.asmx',
  },
  consultarStatusServico: {
    producao: SVRSP + 'NfeStatusServico/NfeStatusServico4.asmx',
    homologacao: SVRSH + 'NfeStatusServico/NfeStatusServico4.asmx',
  },
  inutilizacao: {
    producao: SVRSP + 'nfeinutilizacao/nfeinutilizacao4.asmx',
    homologacao: SVRSH + 'nfeinutilizacao/nfeinutilizacao4.asmx',
  },
}

const SPP = 'https://nfce.fazenda.sp.gov.br/ws/'
const SPH = 'https://homologacao.nfce.fazenda.sp.gov.br/ws/'
const SP = {
  autorizacao: {
    producao: SPP + 'NFeAutorizacao4.asmx',
    homologacao: SPH + 'NFeAutorizacao4.asmx',
  },
  retAutorizacao: {
    producao: SPP + 'NFeRetAutorizacao4.asmx',
    homologacao: SPH + 'NFeRetAutorizacao4.asmx',
  },
  consultarStatusServico: {
    producao: SPP + 'NFeStatusServico4.asmx',
    homologacao: SPH + 'NFeStatusServico4.asmx',
  },
  inutilizacao: {
    producao: SPP + 'NFeInutilizacao4.asmx',
    homologacao: SPH + 'NFeInutilizacao4.asmx',
  },
}

export default { AM, CE, GO, MT, MS, MG, PR, RS, SVRS, SP }
