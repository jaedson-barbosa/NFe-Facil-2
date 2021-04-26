import { toJson } from 'xml2json'
import { db, onLoggedRequest } from './core'

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
  e.forEach((v) => (obj[v[0]] = removePrefix(v[1])))
  return obj
}

function getLastItens<T extends { lastUpdate: Date }>(
  itens: T[],
  keyGetter: (v: T) => string
) {
  return itens
    .reduce((p, c) => {
      const key: string = keyGetter(c)
      const last = p.find((v) => v[0] == key)
      if (last) {
        if (last[1].lastUpdate < c.lastUpdate) {
          last[1] = c
        }
      } else p.push([key, c])
      return p
    }, [] as [string, T][])
    .map((v) => v[1])
}

//Adicionar importação de dados base a partir da NFe, por enquanto sem processamento.
export const importar = onLoggedRequest(
  async (user, res, empresaRef, empresa, body) => {
    const notasCollection = empresaRef.collection('notas')
    let batch = db.batch()
    const notas = (body.xmls as string[])
      .map((v) => {
        const root = toJson(v, { object: true, reversible: true }) as any
        if (!root?.NFe && !root?.nfeProc) return undefined
        const json = removePrefix((root.NFe ?? root.nfeProc.NFe).infNFe)
        return {
          json,
          xml: v,
          emitido: !!root.nfeProc,
          lastUpdate: new Date(json.ide.dhEmi),
        }
      })
      .filter((v) => v)
      .map((v) => v!)
    batch = notas.reduce((p, c) => p.create(notasCollection.doc(), c), batch)

    const dadosCollection = empresaRef.collection('dados')
    const clientes = getLastItens(
      notas
        .filter((v) => {
          const d = v.json.dest
          return d && d.xNome && d.enderDest
        })
        .map((v) => {
          return {
            dest: v.json.dest,
            lastUpdate: v.lastUpdate,
          }
        }),
      (v) => v.dest.CPF ?? v.dest.CNPJ
    )
    batch = clientes.reduce((p, c) => p.create(dadosCollection.doc(), c), batch)

    const camposProdutos = [
      'xProd',
      'cProd',
      'EXTIPI',
      'uCom',
      'uTrib',
      'CFOP',
      'NCM',
      'vUnCom',
      'vUnTrib',
    ]
    const produtos = getLastItens(
      notas
        .map((j) => {
          const dets: any[] = Array.isArray(j.json.det)
            ? j.json.det
            : [j.json.det]
          return dets.map((v: any) => {
            const prod = v.prod
            return {
              prod: {
                cEAN: prod.cEAN ?? 'SEM GTIN',
                cEANTrib: prod.cEANTrib ?? 'SEM GTIN',
                ...camposProdutos.reduce((p, c) => {
                  p[c] = prod[c]
                  return p
                }, {} as any),
              },
              lastUpdate: j.lastUpdate,
            }
          })
        })
        .reduce((p, c) => {
          p.push(...c)
          return p
        }, []),
      (v) => `${v.prod.cProd}${v.prod.xProd}`
    )
    batch = produtos.reduce((p, c) => p.create(dadosCollection.doc(), c), batch)

    const motoristas = getLastItens(
      notas
        .filter((v) => {
          const t = v.json.transp.transporta
          return t && (t.CPF || t.CNPJ)
        })
        .map((v) => {
          return {
            transporta: v.json.transp.transporta,
            lastUpdate: v.lastUpdate,
          }
        }),
      (v) => v.transporta.CPF ?? v.transporta.CNPJ
    )
    batch = motoristas.reduce(
      (p, c) => p.create(dadosCollection.doc(), c),
      batch
    )
    const commitRes = await batch.commit()
    res.status(200).send({ newItens: commitRes.length })
  }
)
