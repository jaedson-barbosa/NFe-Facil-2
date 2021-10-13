const AMP = 'https://nfce.sefaz.am.gov.br/nfce-services/services/'
const AMH = 'https://homnfce.sefaz.am.gov.br/nfce-services/services/'
const AM = {
  autorizacao: {
    '1': AMP + 'NfeAutorizacao4',
    '2': AMH + 'NfeAutorizacao4',
  },
  retAutorizacao: {
    '1': AMP + 'NfeRetAutorizacao4',
    '2': AMH + 'NfeRetAutorizacao4',
  },
  consultarStatusServico: {
    '1': AMP + 'NfeStatusServico4',
    '2': AMH + 'NfeStatusServico4',
  },
  inutilizacao: {
    '1': AMP + 'NFeInutilizacao4',
    '2': AMH + 'NFeInutilizacao4',
  },
  recepcaoEvento: {
    '1': AMP + 'RecepcaoEvento4',
    '2': AMH + 'RecepcaoEvento4',
  },
}

const CEP = 'https://nfce.sefaz.ce.gov.br/nfce4/services/'
const CEH = 'https://nfceh.sefaz.ce.gov.br/nfce4/services/RecepcaoEvento4?WSDL'
const CE = {
  autorizacao: {
    '1': CEP + 'NFeAutorizacao4?WSDL',
    '2': CEH + 'NFeAutorizacao4?WSDL',
  },
  retAutorizacao: {
    '1': CEP + 'NFeRetAutorizacao4?WSDL',
    '2': CEH + 'NFeRetAutorizacao4?WSDL',
  },
  consultarStatusServico: {
    '1': CEP + 'NFeStatusServico4?WSDL',
    '2': CEH + 'NFeStatusServico4?WSDL',
  },
  inutilizacao: {
    '1': CEP + 'NFeInutilizacao4?WSDL',
    '2': CEH + 'NFeInutilizacao4?WSDL',
  },
  recepcaoEvento: {
    '1': CEP + 'RecepcaoEvento4?WSDL',
    '2': CEH + 'RecepcaoEvento4?WSDL',
  },
}

const GOP = 'https://nfe.sefaz.go.gov.br/nfe/services/'
const GOH = 'https://homolog.sefaz.go.gov.br/nfe/services/'
const GO = {
  autorizacao: {
    '1': GOP + 'NFeAutorizacao4?wsdl',
    '2': GOH + 'NFeAutorizacao4?wsdl',
  },
  retAutorizacao: {
    '1': GOP + 'NFeRetAutorizacao4?wsdl',
    '2': GOH + 'NFeRetAutorizacao4?wsdl',
  },
  consultarStatusServico: {
    '1': GOP + 'NFeStatusServico4?wsdl',
    '2': GOH + 'NFeStatusServico4?wsdl',
  },
  inutilizacao: {
    '1': GOP + 'NFeInutilizacao4',
    '2': GOH + 'Nfeinutilizacao4.asmx',
  },
  recepcaoEvento: {
    '1': GOP + 'NFeRecepcaoEvento4?wsdl',
    '2': GOH + 'NFeRecepcaoEvento4?wsdl',
  },
}

const MTP = 'https://nfce.sefaz.mt.gov.br/nfcews/services/'
const MTH = 'https://homologacao.sefaz.mt.gov.br/nfcews/services/'
const MT = {
  autorizacao: {
    '1': MTP + 'NfeAutorizacao4',
    '2': MTH + 'NfeAutorizacao4',
  },
  retAutorizacao: {
    '1': MTP + 'NfeRetAutorizacao4',
    '2': MTH + 'NfeRetAutorizacao4',
  },
  consultarStatusServico: {
    '1': MTP + 'NfeStatusServico4',
    '2': MTH + 'NfeStatusServico4',
  },
  inutilizacao: {
    '1': MTP + 'NfeInutilizacao4',
    '2': MTH + 'Nfeinutilizacao4',
  },
  recepcaoEvento: {
    '1': MTP + 'RecepcaoEvento4',
    '2': MTH + 'RecepcaoEvento4',
  },
}

const MSP = 'https://nfce.sefaz.ms.gov.br/ws/'
const MSH = 'https://hom.nfce.sefaz.ms.gov.br/ws/'
const MS = {
  autorizacao: {
    '1': MSP + 'NFeAutorizacao4',
    '2': MSH + 'NFeAutorizacao4',
  },
  retAutorizacao: {
    '1': MSP + 'NFeRetAutorizacao4',
    '2': MSH + 'NFeRetAutorizacao4',
  },
  consultarStatusServico: {
    '1': MSP + 'NFeStatusServico4',
    '2': MSH + 'NFeStatusServico4',
  },
  inutilizacao: {
    '1': MSP + 'NFeInutilizacao4',
    '2': MSH + 'Nfeinutilizacao4.asmx',
  },
  recepcaoEvento: {
    '1': MSP + 'NFeRecepcaoEvento4',
    '2': MSH + 'NFeRecepcaoEvento4',
  },
}

const MGP = 'https://nfce.fazenda.mg.gov.br/nfce/services/'
const MGH = 'https://hnfce.fazenda.mg.gov.br/nfce/services/'
const MG = {
  autorizacao: {
    '1': MGP + 'NFeAutorizacao4',
    '2': MGH + 'NFeAutorizacao4',
  },
  retAutorizacao: {
    '1': MGP + 'NFeRetAutorizacao4',
    '2': MGH + 'NFeRetAutorizacao4',
  },
  consultarStatusServico: {
    '1': MGP + 'NFeStatusServico4',
    '2': MGH + 'NFeStatusServico4',
  },
  inutilizacao: {
    '1': MGP + 'NFeInutilizacao4',
    '2': MGH + 'Nfeinutilizacao4',
  },
  recepcaoEvento: {
    '1': MGP + 'NFeRecepcaoEvento4',
    '2': MGH + 'NFeRecepcaoEvento4',
  },
}

const PRP = 'https://nfce.sefa.pr.gov.br/nfce/'
const PRH = 'https://homologacao.nfce.sefa.pr.gov.br/nfce/'
const PR = {
  autorizacao: {
    '1': PRP + 'NFeAutorizacao4',
    '2': PRH + 'NFeAutorizacao4',
  },
  retAutorizacao: {
    '1': PRP + 'NFeRetAutorizacao4',
    '2': PRH + 'NFeRetAutorizacao4',
  },
  consultarStatusServico: {
    '1': PRP + 'NFeStatusServico4',
    '2': PRH + 'NFeStatusServico4',
  },
  inutilizacao: {
    '1': PRP + 'NFeInutilizacao4',
    '2': PRH + 'Nfeinutilizacao4',
  },
  recepcaoEvento: {
    '1': PRP + 'NFeRecepcaoEvento4',
    '2': PRH + 'NFeRecepcaoEvento4',
  },
}

const RSP = 'https://nfce.sefazrs.rs.gov.br/ws/'
const RSH = 'https://nfce-homologacao.sefazrs.rs.gov.br/ws/'
const RS = {
  autorizacao: {
    '1': RSP + 'NfeAutorizacao/NFeAutorizacao4.asmx',
    '2': RSH + 'NfeAutorizacao/NFeAutorizacao4.asmx?wsdl',
  },
  retAutorizacao: {
    '1': RSP + 'NfeRetAutorizacao/NFeRetAutorizacao4.asmx',
    '2': RSH + 'NfeRetAutorizacao/NFeRetAutorizacao4.asmx?wsdl',
  },
  consultarStatusServico: {
    '1': RSP + 'NfeStatusServico/NfeStatusServico4.asmx',
    '2': RSH + 'NfeStatusServico/NfeStatusServico4.asmx?wsdl',
  },
  inutilizacao: {
    '1': RSP + 'nfeinutilizacao/nfeinutilizacao4.asmx',
    '2': RSH + 'nfeinutilizacao/nfeinutilizacao4.asmx',
  },
  recepcaoEvento: {
    '1': RSP + 'recepcaoevento/recepcaoevento4.asmx',
    '2': RSH + 'recepcaoevento/recepcaoevento4.asmx',
  },
}

const SVRSP = 'https://nfce.svrs.rs.gov.br/ws/'
const SVRSH = 'https://nfce-homologacao.svrs.rs.gov.br/ws/'
const SVRS = {
  autorizacao: {
    '1': SVRSP + 'NfeAutorizacao/NFeAutorizacao4.asmx',
    '2': SVRSH + 'NfeAutorizacao/NFeAutorizacao4.asmx',
  },
  retAutorizacao: {
    '1': SVRSP + 'NfeRetAutorizacao/NFeRetAutorizacao4.asmx',
    '2': SVRSH + 'NfeRetAutorizacao/NFeRetAutorizacao4.asmx',
  },
  consultarStatusServico: {
    '1': SVRSP + 'NfeStatusServico/NfeStatusServico4.asmx',
    '2': SVRSH + 'NfeStatusServico/NfeStatusServico4.asmx',
  },
  inutilizacao: {
    '1': SVRSP + 'nfeinutilizacao/nfeinutilizacao4.asmx',
    '2': SVRSH + 'nfeinutilizacao/nfeinutilizacao4.asmx',
  },
  recepcaoEvento: {
    '1': SVRSP + 'recepcaoevento/recepcaoevento4.asmx',
    '2': SVRSH + 'recepcaoevento/recepcaoevento4.asmx',
  },
}

const SPP = 'https://nfce.fazenda.sp.gov.br/ws/'
const SPH = 'https://homologacao.nfce.fazenda.sp.gov.br/ws/'
const SP = {
  autorizacao: {
    '1': SPP + 'NFeAutorizacao4.asmx',
    '2': SPH + 'NFeAutorizacao4.asmx',
  },
  retAutorizacao: {
    '1': SPP + 'NFeRetAutorizacao4.asmx',
    '2': SPH + 'NFeRetAutorizacao4.asmx',
  },
  consultarStatusServico: {
    '1': SPP + 'NFeStatusServico4.asmx',
    '2': SPH + 'NFeStatusServico4.asmx',
  },
  inutilizacao: {
    '1': SPP + 'NFeInutilizacao4.asmx',
    '2': SPH + 'NFeInutilizacao4.asmx',
  },
  recepcaoEvento: {
    '1': SPP + 'NFeRecepcaoEvento4.asmx',
    '2': SPH + 'NFeRecepcaoEvento4.asmx',
  },
}

export default {
  AM: AM,
  CE: CE,
  GO: GO,
  MT: MT,
  MS: MS,
  MG: MG,
  PR: PR,
  RS: RS,
  SP: SP,
  AC: SVRS,
  AL: SVRS,
  AP: SVRS,
  BA: SVRS,
  DF: SVRS,
  ES: SVRS,
  MA: SVRS,
  PA: SVRS,
  PB: SVRS,
  PE: SVRS,
  PI: SVRS,
  RJ: SVRS,
  RN: SVRS,
  RO: SVRS,
  RR: SVRS,
  SE: SVRS,
  TO: SVRS,
} as {
  [uf: string]: {
    autorizacao: {
      '1': string
      '2': string
    }
    retAutorizacao: {
      '1': string
      '2': string
    }
    consultarStatusServico: {
      '1': string
      '2': string
    }
    inutilizacao: {
      '1': string
      '2': string
    }
    recepcaoEvento: {
      '1': string
      '2': string
    }
  }
}
