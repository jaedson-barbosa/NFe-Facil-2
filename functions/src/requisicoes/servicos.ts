const urlBase = 'http://www.portalfiscal.inf.br/nfe/wsdl/'

export default {
  autorizacao: {
    metodo: urlBase + 'NFeAutorizacao4',
    acao: urlBase + 'NFeAutorizacao4/nfeAutorizacaoLote',
  },
  retAutorizacao: {
    metodo: urlBase + 'NFeRetAutorizacao4',
    acao: urlBase + 'NFeRetAutorizacao4/nfeRetAutorizacaoLote',
  },
  consultarStatusServico: {
    metodo: urlBase + 'NFeStatusServico4',
    acao: urlBase + 'NFeStatusServico4/nfeStatusServicoNF',
  },
  recepcaoEvento: {
    metodo: urlBase + 'NFeRecepcaoEvento4',
    acao: urlBase + 'NFeRecepcaoEvento4/nfeRecepcaoEvento',
  },
  inutilizacao: {
    metodo: urlBase + 'NFeInutilizacao4',
    acao: urlBase + 'NFeInutilizacao4/nfeInutilizacaoNF',
  },
  consultarProtocolo: {
    metodo: urlBase + 'NFeConsultaProtocolo4',
    acao: urlBase + 'NFeConsultaProtocolo4/nfeConsultaNF',
  },
  consultarCadastro: {
    metodo: urlBase + 'CadConsultaCadastro4/',
    acao: urlBase + 'CadConsultaCadastro4/consultaCadastro',
  },
}
