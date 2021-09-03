export default {
  autorizacao: {
    method: 'http://www.portalfiscal.inf.br/nfe/wsdl/NFeAutorizacao4',
    action:
      'http://www.portalfiscal.inf.br/nfe/wsdl/NFeAutorizacao4/nfeAutorizacaoLote',
  },
  retAutorizacao: {
    method: 'http://www.portalfiscal.inf.br/nfe/wsdl/NFeRetAutorizacao4',
    action:
      'http://www.portalfiscal.inf.br/nfe/wsdl/NFeRetAutorizacao4/nfeRetAutorizacaoLote',
  },
  consultarStatusServico: {
    method: 'http://www.portalfiscal.inf.br/nfe/wsdl/NFeStatusServico4',
    action:
      'http://www.portalfiscal.inf.br/nfe/wsdl/NFeStatusServico4/nfeStatusServicoNF',
  },
  recepcaoEvento: {
    method: 'http://www.portalfiscal.inf.br/nfe/wsdl/NFeRecepcaoEvento4',
    action:
      'http://www.portalfiscal.inf.br/nfe/wsdl/NFeRecepcaoEvento4/nfeRecepcaoEvento',
  },
  inutilizacao: {
    method: 'http://www.portalfiscal.inf.br/nfe/wsdl/NFeInutilizacao4',
    action:
      'http://www.portalfiscal.inf.br/nfe/wsdl/NFeInutilizacao4/nfeInutilizacaoNF',
  },
  consultarProtocolo: {
    method: 'http://www.portalfiscal.inf.br/nfe/wsdl/NFeConsultaProtocolo4',
    action:
      'http://www.portalfiscal.inf.br/nfe/wsdl/NFeConsultaProtocolo4/nfeConsultaNF',
  },
  consultarCadastro: {
    method: 'http://www.portalfiscal.inf.br/nfe/wsdl/CadConsultaCadastro4/',
    action:
      'http://www.portalfiscal.inf.br/nfe/wsdl/CadConsultaCadastro4/consultaCadastro',
  },
}
