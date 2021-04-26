import { onLoggedRequest } from './core'
// import { ambientes, autorizacao } from './requisicoes'
// import { IBGESimplificado } from './requisicoes/IBGESimplificado.json'

// const ambiente = ambientes.Homologacao

export const apenasSalvarNFe = onLoggedRequest(
  async (user, res, empresaRef, empresa, body) => {
    // empresaRef.collection('notas').add()
    // res.status(200).send(resp)
  }
)

export const assinarTransmitirNFe = onLoggedRequest(
  async (user, res, empresaRef, empresa, body) => {}
)
