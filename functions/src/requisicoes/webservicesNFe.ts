const AMP = 'https://nfe.sefaz.am.gov.br/services2/services/'
const AMH = 'https://homnfe.sefaz.am.gov.br/services2/services/'
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
  recepcaoEvento: {
    '1': AMP + 'RecepcaoEvento4',
    '2': AMH + 'RecepcaoEvento4',
  },
}

const BAP = 'https://nfe.sefaz.ba.gov.br/webservices/'
const BAH = 'https://hnfe.sefaz.ba.gov.br/webservices/'
const BA = {
  autorizacao: {
    '1': BAP + 'NFeAutorizacao4/NFeAutorizacao4.asmx',
    '2': BAH + 'NFeAutorizacao4/NFeAutorizacao4.asmx',
  },
  retAutorizacao: {
    '1': BAP + 'NFeRetAutorizacao4/NFeRetAutorizacao4.asmx',
    '2': BAH + 'NFeRetAutorizacao4/NFeRetAutorizacao4.asmx',
  },
  consultarStatusServico: {
    '1': BAP + 'NFeStatusServico4/NFeStatusServico4.asmx',
    '2': BAH + 'NFeStatusServico4/NFeStatusServico4.asmx',
  },
  recepcaoEvento: {
    '1': BAP + 'NFeRecepcaoEvento4/NFeRecepcaoEvento4.asmx',
    '2': BAH + 'NFeRecepcaoEvento4/NFeRecepcaoEvento4.asmx',
  },
}

const CEP = 'https://nfe.sefaz.ce.gov.br/nfe4/services/'
const CEH = 'https://nfeh.sefaz.ce.gov.br/nfe4/services/'
const CE = {
  autorizacao: {
    '1': CEP + 'NFeAutorizacao4?wsdl',
    '2': CEH + 'NFeAutorizacao4?WSDL',
  },
  retAutorizacao: {
    '1': CEP + 'NFeRetAutorizacao4?wsdl',
    '2': CEH + 'NFeRetAutorizacao4?WSDL',
  },
  consultarStatusServico: {
    '1': CEP + 'NFeStatusServico4?wsdl',
    '2': CEH + 'NFeStatusServico4?WSDL',
  },
  recepcaoEvento: {
    '1': CEP + 'NFeRecepcaoEvento4?wsdl',
    '2': CEH + 'NFeRecepcaoEvento4?WSDL',
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
  recepcaoEvento: {
    '1': GOP + 'NFeRecepcaoEvento4?wsdl',
    '2': GOH + 'NFeRecepcaoEvento4?wsdl',
  },
}

const MGP = 'https://nfe.fazenda.mg.gov.br/nfe2/services/'
const MGH = 'https://hnfe.fazenda.mg.gov.br/nfe2/services/'
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
  recepcaoEvento: {
    '1': MGP + 'NFeRecepcaoEvento4',
    '2': MGH + 'NFeRecepcaoEvento4',
  },
}

const MSP = 'https://nfe.sefaz.ms.gov.br/ws/'
const MSH = 'https://hom.nfe.sefaz.ms.gov.br/ws/'
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
  recepcaoEvento: {
    '1': MSP + 'NFeRecepcaoEvento4',
    '2': MSH + 'NFeRecepcaoEvento4',
  },
}

const MTP = 'https://nfe.sefaz.mt.gov.br/nfews/v2/services/'
const MTH = 'https://homologacao.sefaz.mt.gov.br/nfews/v2/services/'
const MT = {
  autorizacao: {
    '1': MTP + 'NfeAutorizacao4?wsdl',
    '2': MTH + 'NfeAutorizacao4?wsdl',
  },
  retAutorizacao: {
    '1': MTP + 'NfeRetAutorizacao4?wsdl',
    '2': MTH + 'NfeRetAutorizacao4?wsdl',
  },
  consultarStatusServico: {
    '1': MTP + 'NfeStatusServico4?wsdl',
    '2': MTH + 'NfeStatusServico4?wsdl',
  },
  recepcaoEvento: {
    '1': MTP + 'RecepcaoEvento4?wsdl',
    '2': MTH + 'RecepcaoEvento4?wsdl',
  },
}

const PEP = 'https://nfe.sefaz.pe.gov.br/nfe-service/services/'
const PEH = 'https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/'
const PE = {
  autorizacao: {
    '1': PEP + 'NFeAutorizacao4',
    '2': PEH + 'NFeAutorizacao4',
  },
  retAutorizacao: {
    '1': PEP + 'NFeRetAutorizacao4',
    '2': PEH + 'NFeRetAutorizacao4',
  },
  consultarStatusServico: {
    '1': PEP + 'NFeStatusServico4',
    '2': PEH + 'NFeStatusServico4',
  },
  recepcaoEvento: {
    '1': PEP + 'NFeRecepcaoEvento4',
    '2': PEH + 'NFeRecepcaoEvento4',
  },
}

const PRP = 'https://nfe.sefa.pr.gov.br/nfe/'
const PRH = 'https://homologacao.nfe.sefa.pr.gov.br/nfe/'
const PR = {
  autorizacao: {
    '1': PRP + 'NFeAutorizacao4?wsdl',
    '2': PRH + 'NFeAutorizacao4?wsdl',
  },
  retAutorizacao: {
    '1': PRP + 'NFeRetAutorizacao4?wsdl',
    '2': PRH + 'NFeRetAutorizacao4?wsdl',
  },
  consultarStatusServico: {
    '1': PRP + 'NFeStatusServico4?wsdl',
    '2': PRH + 'NFeStatusServico4?wsdl',
  },
  recepcaoEvento: {
    '1': PRP + 'NFeRecepcaoEvento4?wsdl',
    '2': PRH + 'NFeRecepcaoEvento4?wsdl',
  },
}

const RSP = 'https://nfe.sefazrs.rs.gov.br/ws/'
const RSH = 'https://nfe-homologacao.sefazrs.rs.gov.br/ws/'
const RS = {
  autorizacao: {
    '1': RSP + 'NfeAutorizacao/NFeAutorizacao4.asmx',
    '2': RSH + 'NfeAutorizacao/NFeAutorizacao4.asmx',
  },
  retAutorizacao: {
    '1': RSP + 'NfeRetAutorizacao/NFeRetAutorizacao4.asmx',
    '2': RSH + 'NfeRetAutorizacao/NFeRetAutorizacao4.asmx',
  },
  consultarStatusServico: {
    '1': RSP + 'NfeStatusServico/NfeStatusServico4.asmx',
    '2': RSH + 'NfeStatusServico/NfeStatusServico4.asmx',
  },
  recepcaoEvento: {
    '1': RSP + 'recepcaoevento/recepcaoevento4.asmx',
    '2': RSH + 'recepcaoevento/recepcaoevento4.asmx',
  },
}

const SPP = 'https://nfe.fazenda.sp.gov.br/ws/'
const SPH = 'https://homologacao.nfe.fazenda.sp.gov.br/ws/'
const SP = {
  autorizacao: {
    '1': SPP + 'nfeautorizacao4.asmx',
    '2': SPH + 'nfeautorizacao4.asmx',
  },
  retAutorizacao: {
    '1': SPP + 'nferetautorizacao4.asmx',
    '2': SPH + 'nferetautorizacao4.asmx',
  },
  consultarStatusServico: {
    '1': SPP + 'nfestatusservico4.asmx',
    '2': SPH + 'nfestatusservico4.asmx',
  },
  recepcaoEvento: {
    '1': SPP + 'nferecepcaoevento4.asmx',
    '2': SPH + 'nferecepcaoevento4.asmx',
  },
}

const SVANP = 'https://www.sefazvirtual.fazenda.gov.br/'
const SVANH = 'https://hom.sefazvirtual.fazenda.gov.br/'
const SVAN = {
  autorizacao: {
    '1': SVANP + 'NFeAutorizacao4/NFeAutorizacao4.asmx',
    '2': SVANH + 'NFeAutorizacao4/NFeAutorizacao4.asmx',
  },
  retAutorizacao: {
    '1': SVANP + 'NFeRetAutorizacao4/NFeRetAutorizacao4.asmx',
    '2': SVANH + 'NFeRetAutorizacao4/NFeRetAutorizacao4.asmx',
  },
  consultarStatusServico: {
    '1': SVANP + 'NFeStatusServico4/NFeStatusServico4.asmx',
    '2': SVANH + 'NFeStatusServico4/NFeStatusServico4.asmx',
  },
  recepcaoEvento: {
    '1': SVANP + 'NFeRecepcaoEvento4/NFeRecepcaoEvento4.asmx',
    '2': SVANH + 'NFeRecepcaoEvento4/NFeRecepcaoEvento4.asmx',
  },
}

const SVRSP = 'https://nfe.svrs.rs.gov.br/ws/'
const SVRSH = 'https://nfe-homologacao.svrs.rs.gov.br/ws/'
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
  recepcaoEvento: {
    '1': SVRSP + 'recepcaoevento/recepcaoevento4.asmx',
    '2': SVRSH + 'recepcaoevento/recepcaoevento4.asmx',
  },
}

export default { AM, BA, CE, GO, MG, MS, MT, PE, PR, RS, SP, SVAN, SVRS }
