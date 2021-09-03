export default {
  AM: {
    nome: 'Amazonas',
    servicos: {
      autorizacao: {
        url_producao:
          'https://nfce.sefaz.am.gov.br/nfce-services/services/NfeAutorizacao4',
        url_homologacao:
          'https://homnfce.sefaz.am.gov.br/nfce-services/services/NfeAutorizacao4.asmx?wsdl',
      },
      retAutorizacao: {
        url_producao:
          'https://nfce.sefaz.am.gov.br/nfce-services/services/NfeRetAutorizacao4',
        url_homologacao:
          'https://homnfce.sefaz.am.gov.br/nfce-services/services/NfeRetAutorizacao4.asmx?wsdl',
      },
      consultarStatusServico: {
        url_producao:
          'https://nfce.sefaz.am.gov.br/nfce-services/services/NfeStatusServico4',
        url_homologacao:
          'https://homnfce.sefaz.am.gov.br/nfce-services/services/NfeStatusServico4.asmx?wsdl',
      },
      inutilizacao: {
        url_producao:
          'https://nfce.sefaz.am.gov.br/nfce-services/services/NFeInutilizacao4',
        url_homologacao:
          'https://homnfce.sefaz.am.gov.br/nfce-services/services/NFeInutilizacao4.asmx?wsdl',
      },
    },
  },
  CE: {
    nome: 'Ceará',
    servicos: {
      autorizacao: {
        url_producao:
          'https://nfce.sefaz.ce.gov.br/nfce4/services/NFeAutorizacao4?WSDL',
        url_homologacao:
          'https://nfceh.sefaz.ce.gov.br/nfce4/services/NFeAutorizacao4?WSDL',
      },
      retAutorizacao: {
        url_producao:
          'https://nfce.sefaz.ce.gov.br/nfce4/services/NFeRetAutorizacao4?WSDL',
        url_homologacao:
          'https://nfceh.sefaz.ce.gov.br/nfce4/services/NFeRetAutorizacao4?WSDL',
      },
      consultarStatusServico: {
        url_producao:
          'https://nfce.sefaz.ce.gov.br/nfce4/services/NFeStatusServico4?WSDL',
        url_homologacao:
          'https://nfceh.sefaz.ce.gov.br/nfce4/services/NFeStatusServico4?WSDL',
      },
      inutilizacao: {
        url_producao:
          'https://nfce.sefaz.ce.gov.br/nfce4/services/NFeInutilizacao4?WSDL',
        url_homologacao:
          'https://nfceh.sefaz.ce.gov.br/nfce4/services/NFeInutilizacao4?WSDL',
      },
    },
  },
  GO: {
    nome: 'Goiás',
    servicos: {
      autorizacao: {
        url_producao:
          'https://nfe.sefaz.go.gov.br/nfe/services/NFeAutorizacao4?wsdl',
        url_homologacao:
          'https://homolog.sefaz.go.gov.br/nfe/services/NFeAutorizacao4?wsdl',
      },
      retAutorizacao: {
        url_producao:
          'https://nfe.sefaz.go.gov.br/nfe/services/NFeRetAutorizacao4?wsdl',
        url_homologacao:
          'https://homolog.sefaz.go.gov.br/nfe/services/NFeRetAutorizacao4?wsdl',
      },
      consultarStatusServico: {
        url_producao:
          'https://nfe.sefaz.go.gov.br/nfe/services/NFeStatusServico4?wsdl',
        url_homologacao:
          'https://homolog.sefaz.go.gov.br/nfe/services/NFeStatusServico4?wsdl',
      },
      inutilizacao: {
        url_producao:
          'https://nfe.sefaz.go.gov.br/nfe/services/NFeInutilizacao4',
        url_homologacao:
          'https://homolog.sefaz.go.gov.br/nfe/services/Nfeinutilizacao4.asmx',
      },
    },
  },
  MT: {
    nome: 'Mato Grosso',
    servicos: {
      autorizacao: {
        url_producao:
          'https://nfce.sefaz.mt.gov.br/nfcews/services/NfeAutorizacao4',
        url_homologacao:
          'https://homologacao.sefaz.mt.gov.br/nfcews/services/NfeAutorizacao4',
      },
      retAutorizacao: {
        url_producao:
          'https://nfce.sefaz.mt.gov.br/nfcews/services/NfeRetAutorizacao4',
        url_homologacao:
          'https://homologacao.sefaz.mt.gov.br/nfcews/services/NfeRetAutorizacao4',
      },
      consultarStatusServico: {
        url_producao:
          'https://nfce.sefaz.mt.gov.br/nfcews/services/NfeStatusServico4',
        url_homologacao:
          'https://homologacao.sefaz.mt.gov.br/nfcews/services/NfeStatusServico4',
      },
      inutilizacao: {
        url_producao:
          'https://nfe.sefaz.mt.gov.br/nfews/v2/services/NfeInutilizacao4',
        url_homologacao:
          'https://homologacao.sefaz.mt.gov.br/nfcews/services/Nfeinutilizacao4.asmx',
      },
    },
  },
  MS: {
    nome: 'Mato Grosso do Sul',
    servicos: {
      autorizacao: {
        url_producao: 'https://nfce.sefaz.ms.gov.br/ws/NFeAutorizacao4',
        url_homologacao: 'https://hom.nfce.sefaz.ms.gov.br/ws/NFeAutorizacao4',
      },
      retAutorizacao: {
        url_producao: 'https://nfce.sefaz.ms.gov.br/ws/NFeRetAutorizacao4',
        url_homologacao:
          'https://hom.nfce.sefaz.ms.gov.br/ws/NFeRetAutorizacao4',
      },
      consultarStatusServico: {
        url_producao: 'https://nfce.sefaz.ms.gov.br/ws/NFeStatusServico4',
        url_homologacao:
          'https://hom.nfce.sefaz.ms.gov.br/ws/NFeStatusServico4',
      },
      inutilizacao: {
        url_producao: 'https://nfe.sefaz.ms.gov.br/ws/NFeInutilizacao4',
        url_homologacao:
          'https://hom.nfce.sefaz.ms.gov.br/ws/Nfeinutilizacao4.asmx',
      },
    },
  },
  MG: {
    nome: 'Minas Gerais',
    servicos: {
      autorizacao: {
        url_producao:
          'https://nfce.fazenda.mg.gov.br/nfce/services/NFeAutorizacao4',
        url_homologacao:
          'https://hnfce.fazenda.mg.gov.br/nfce/services/NFeAutorizacao4',
      },
      retAutorizacao: {
        url_producao:
          'https://nfce.fazenda.mg.gov.br/nfce/services/NFeRetAutorizacao4',
        url_homologacao:
          'https://hnfce.fazenda.mg.gov.br/nfce/services/NFeRetAutorizacao4',
      },
      consultarStatusServico: {
        url_producao:
          'https://nfce.fazenda.mg.gov.br/nfce/services/NFeStatusServico4',
        url_homologacao:
          'https://hnfce.fazenda.mg.gov.br/nfce/services/NFeStatusServico4',
      },
      inutilizacao: {
        url_producao:
          'https://nfe.fazenda.mg.gov.br/nfe2/services/NFeInutilizacao4',
        url_homologacao:
          'https://hnfce.fazenda.mg.gov.br/nfce/services/Nfeinutilizacao4.asmx',
      },
    },
  },
  PR: {
    nome: 'Paraná',
    servicos: {
      autorizacao: {
        url_producao: 'https://nfce.sefa.pr.gov.br/nfce/NFeAutorizacao4',
        url_homologacao:
          'https://homologacao.nfce.sefa.pr.gov.br/nfce/NFeAutorizacao4',
      },
      retAutorizacao: {
        url_producao: 'https://nfce.sefa.pr.gov.br/nfce/NFeRetAutorizacao4',
        url_homologacao:
          'https://homologacao.nfce.sefa.pr.gov.br/nfce/NFeRetAutorizacao4',
      },
      consultarStatusServico: {
        url_producao: 'https://nfce.sefa.pr.gov.br/nfce/NFeStatusServico4',
        url_homologacao:
          'https://homologacao.nfce.sefa.pr.gov.br/nfce/NFeStatusServico4',
      },
      inutilizacao: {
        url_producao: 'https://nfe.sefa.pr.gov.br/nfe/NFeInutilizacao4',
        url_homologacao:
          'https://homologacao.nfce.sefa.pr.gov.br/nfce/Nfeinutilizacao4.asmx',
      },
    },
  },
  RS: {
    nome: 'Rio Grande do Sul',
    servicos: {
      autorizacao: {
        url_producao:
          'https://nfce.sefazrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
        url_homologacao:
          'https://nfce-homologacao.sefazrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx?wsdl',
      },
      retAutorizacao: {
        url_producao:
          'https://nfce.sefazrs.rs.gov.br/ws/NfeRetAutorizacao/NFeRetAutorizacao4.asmx',
        url_homologacao:
          'https://nfce-homologacao.sefazrs.rs.gov.br/ws/NfeRetAutorizacao/NFeRetAutorizacao4.asmx?wsdl',
      },
      consultarStatusServico: {
        url_producao:
          'https://nfce.sefazrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx',
        url_homologacao:
          'https://nfce-homologacao.sefazrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx?wsdl',
      },
      inutilizacao: {
        url_producao:
          'https://nfe.sefazrs.rs.gov.br/ws/nfeinutilizacao/nfeinutilizacao4.asmx',
        url_homologacao:
          'https://nfce-homologacao.sefazrs.rs.gov.br/ws/nfeinutilizacao/nfeinutilizacao4.asmx',
      },
    },
  },
  SVRS: {
    nome: 'SEFAZ Virtual – SVRS',
    servicos: {
      autorizacao: {
        url_producao:
          'https://nfce.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
        url_homologacao:
          'https://nfce-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
      },
      retAutorizacao: {
        url_producao:
          'https://nfce.svrs.rs.gov.br/ws/NfeRetAutorizacao/NFeRetAutorizacao4.asmx',
        url_homologacao:
          'https://nfce-homologacao.svrs.rs.gov.br/ws/NfeRetAutorizacao/NFeRetAutorizacao4.asmx',
      },
      consultarStatusServico: {
        url_producao:
          'https://nfce.svrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx',
        url_homologacao:
          'https://nfce-homologacao.svrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx',
      },
      inutilizacao: {
        url_producao:
          'https://nfe.svrs.rs.gov.br/ws/nfeinutilizacao/nfeinutilizacao4.asmx',
        url_homologacao:
          'https://nfce-homologacao.svrs.rs.gov.br/ws/nfeinutilizacao/nfeinutilizacao4.asmx',
      },
    },
  },
  SP: {
    nome: 'São Paulo',
    servicos: {
      autorizacao: {
        url_producao: 'https://nfce.fazenda.sp.gov.br/ws/NFeAutorizacao4.asmx',
        url_homologacao:
          'https://homologacao.nfce.fazenda.sp.gov.br/ws/NFeAutorizacao4.asmx',
      },
      retAutorizacao: {
        url_producao:
          'https://nfce.fazenda.sp.gov.br/ws/NFeRetAutorizacao4.asmx',
        url_homologacao:
          'https://homologacao.nfce.fazenda.sp.gov.br/ws/NFeRetAutorizacao4.asmx',
      },
      consultarStatusServico: {
        url_producao:
          'https://nfce.fazenda.sp.gov.br/ws/NFeStatusServico4.asmx',
        url_homologacao:
          'https://homologacao.nfce.fazenda.sp.gov.br/ws/NFeStatusServico4.asmx',
      },
      inutilizacao: {
        url_producao: 'https://nfe.fazenda.sp.gov.br/ws/nfeinutilizacao4.asmx',
        url_homologacao:
          'https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeinutilizacao4.asmx',
      },
      consultarProtocolo: {
        url_producao:
          'https://nfe.fazenda.sp.gov.br/ws/nfeconsultaprotocolo4.asmx',
        url_homologacao:
          'https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeconsultaprotocolo4.asmx',
      },
      consultarCadastro: {
        url_producao:
          'https://nfe.fazenda.sp.gov.br/ws/cadconsultacadastro4.asmx',
        url_homologacao:
          'https://homologacao.nfe.fazenda.sp.gov.br/ws/cadconsultacadastro4.asmx',
      },
      recepcaoEvento: {
        url_producao:
          'https://nfe.fazenda.sp.gov.br/ws/nferecepcaoevento4.asmx',
        url_homologacao:
          'https://homologacao.nfe.fazenda.sp.gov.br/ws/nferecepcaoevento4.asmx',
      },
    },
  },
}
