import { getCert } from './assinatura/getCert'
import { onLoggedRequest } from './onLoggedRequest'
import { enviarRequisicao } from './requisicoes'
import { TAmb } from './TAmb'

export const statusServico = onLoggedRequest(
  async ({ empRef, empData, body }, res) => {
    const dataCert = await getCert(empRef.id)
    if (!dataCert) {
      res.status(400).send('Certificado não encontrado.')
      return
    }
    const cUF = body.cUF
    if (!cUF) {
      res.status(400).send('Código da UF não informado.')
      return
    }
    const ambiente = TAmb.Homologacao
    res.status(200).send(
      await enviarRequisicao(
        `<consStatServ versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
          <tpAmb>${ambiente}</tpAmb>
          <cUF>${cUF}</cUF>
          <xServ>STATUS</xServ>
        </consStatServ>`,
        'consultarStatusServico',
        ambiente,
        empData,
        dataCert
      )
    )
  }
)
