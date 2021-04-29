import { IResultadoSincronizacao } from '../../commom'
import { onLoggedRequest } from './core'
import { INotaDB } from './types'

export const sincronizar = onLoggedRequest(
  async (user, res, empresaRef, empresa, body) => {
    const lastUpdate = body.lastUpdate
    const dadosCollection = empresaRef.collection('dados')
    const notasCollection = empresaRef.collection('notas')
    const novosDados = await (lastUpdate
      ? dadosCollection.where('lastUpdate', '>=', new Date(lastUpdate))
      : dadosCollection
    ).get()
    const novasNotas = await (lastUpdate
      ? notasCollection.where('lastUpdate', '>=', new Date(lastUpdate))
      : dadosCollection
    ).get()
    const resp: IResultadoSincronizacao = {
      novosDados: novosDados.docs.map((v) => {
        const data = v.data() as any
        delete data['lastUpdate']
        return { id: v.id, data }
      }),
      novasNotas: novasNotas.docs.map((v) => {
        const data = v.data() as INotaDB<FirebaseFirestore.Timestamp>
        return { id: v.id, infNFe: data.view }
      }),
      now: new Date().valueOf(),
    }
    res.status(200).send(resp)
  }
)
