import { toJson } from 'xml2json'
import { db, FieldValue, onLoggedRequest } from './core'

// function addPrefix(obj: any) {
//     Object.entries(obj).forEach(
//         v => {
//             if (typeof v[1] != 'object') {
//                 obj[v[0]] = { '$t': v[1] }
//             } else addPrefix(v[1])
//         }
//     )
// }

function removePrefix(obj: any) {
  if (typeof obj != 'object') return obj
  const e = Object.entries(obj)
  if (!e[0]) return obj
  if (e[0][0] == '$t') return e[0][1]
  e.forEach(v => obj[v[0]] = removePrefix(v[1]))
  return obj
}

//Adicionar importação de dados base a partir da NFe, por enquanto sem processamento.
export const importar = onLoggedRequest(
  async (user, res, empresaRef, empresa, body) => {
    const notasCollection = empresaRef.collection('notas')
    res.status(200).send(
      await (
        body.xmls as string[]
      ).map(
        v => {
          const root = toJson(v,
            { object: true, reversible: true }
          ) as any
          return root?.NFe || root?.nfeProc ? {
            json: removePrefix((root.NFe ?? root.nfeProc.NFe).infNFe),
            xml: v,
            emitido: !!root.nfeProc,
            lastUpdate: FieldValue.serverTimestamp()
          } : undefined
        }
      ).filter(v => v).reduce(
        (p, c) => p.create(notasCollection.doc(), c),
        db.batch()
      ).commit()
    )
  }
)
