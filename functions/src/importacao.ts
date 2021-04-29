import { toJson } from 'xml2json'
import { db, onLoggedRequest } from './core'
import { IResultadoImportacao } from '../../commom'
import { INotaDB } from './types'

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
    const notas = (body.xmls as string[])
      .map((v) => {
        const root = toJson(v, { object: true, reversible: true }) as any
        if (!root?.NFe && !root?.nfeProc) return undefined
        const json = removePrefix((root.NFe ?? root.nfeProc.NFe).infNFe)
        const dhEmi = new Date(json.ide.dhEmi)
        const nota: INotaDB<Date> = {
          json,
          xml: v,
          emitido: !!root.nfeProc,
          lastUpdate: dhEmi,
          view: {
            serie: json.ide.serie,
            nNF: json.ide.nNF,
            dhEmi,
            xNome: json.dest.xNome,
          },
        }
        return nota
      })
      .filter((v) => v)
      .map((v) => v!)

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
    ).map((data) => {
      return { id: dadosCollection.doc(), data }
    })

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
                cEAN: typeof prod.cEAN == 'string' ? prod.cEAN : 'SEM GTIN',
                cEANTrib:
                  typeof prod.cEANTrib == 'string' ? prod.cEANTrib : 'SEM GTIN',
                ...camposProdutos.reduce((p, c) => {
                  const f = prod[c]
                  if (f) p[c] = f
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
    ).map((data) => {
      return { id: dadosCollection.doc(), data }
    })

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
    ).map((data) => {
      return { id: dadosCollection.doc(), data }
    })

    const notasDB = notas.map((data) => {
      return { id: notasCollection.doc(), data }
    })
    await notasDB
      .reduce(
        (p, c) => p.create(c.id, c.data),
        clientes.reduce(
          (p, c) => p.create(c.id, c.data),
          produtos.reduce(
            (p, c) => p.create(c.id, c.data),
            motoristas.reduce((p, c) => p.create(c.id, c.data), db.batch())
          )
        )
      )
      .commit()
    const resultado: IResultadoImportacao<Date> = {
      clientes: clientes.map((v) => {
        return { id: v.id.id, dest: v.data.dest }
      }),
      produtos: produtos.map((v) => {
        return { id: v.id.id, prod: v.data.prod }
      }),
      motoristas: motoristas.map((v) => {
        return { id: v.id.id, transporta: v.data.transporta }
      }),
      notas: notasDB.map((v) => {
        return { id: v.id.id, infNFe: v.data.view }
      }),
    }
    res.status(200).send(resultado)
  }
)
