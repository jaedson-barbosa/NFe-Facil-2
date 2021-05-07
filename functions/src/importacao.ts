import { toJson } from 'xml2json'
import { db, onLoggedRequest } from './core'
import { IResultadoImportacao } from '../../commom'
import { INotaDB } from './types'

function removePrefix(obj: any) {
  if (typeof obj != 'object') return obj
  const e = Object.entries(obj)
  if (!e[0]) return obj
  if (e[0][0] == '$t') return e[0][1]
  e.forEach(([v0, v1]) => (obj[v0] = removePrefix(v1)))
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
    const notas = getNotas(body.xmls, empresa.emit.CNPJ)
    const clientes = getClientes(notas)
    const produtos = getProdutos(notas)
    const motoristas = getMotoristas(notas)

    const notasCollection = empresaRef.collection('notas')
    const notasAtuais = (
      await notasCollection
        .where(
          'json.Id',
          'in',
          notas.map((v) => v.json.Id)
        )
        .get()
    ).docs.map((v) => {
      return {
        id: v.id,
        data: v.data() as INotaDB<FirebaseFirestore.Timestamp>,
      }
    })

    const dadosCollection = empresaRef.collection('dados')
    const dadosAtuais = (
      await dadosCollection
        .where('idAux', 'in', [
          ...clientes.map((v) => v.idAux),
          ...produtos.map((v) => v.idAux),
          ...motoristas.map((v) => v.idAux),
        ])
        .get()
    ).docs.map((v) => {
      return {
        id: v.id,
        data: v.data() as {
          dest?: any
          prod?: any
          transporta?: any
          idAux: string
          lastUpdate: FirebaseFirestore.Timestamp
        },
      }
    })

    const notasDB = notas
      .filter((v) => !notasAtuais.some((k) => k.data.json.Id == v.json.Id))
      .map((data) => {
        return { id: notasCollection.doc(), data }
      })
    const clientesDB = clientes
      .filter((v) => {
        const atual = dadosAtuais.find(
          (k) => k.data.dest && k.data.idAux == v.idAux
        )
        if (!atual) return true
        return atual.data.lastUpdate.toDate() < v.lastUpdate
      })
      .map((data) => {
        return { id: dadosCollection.doc(), data }
      })
    const produtosDB = produtos
      .filter((v) => {
        const atual = dadosAtuais.find(
          (k) => k.data.prod && k.data.idAux == v.idAux
        )
        if (!atual) return true
        return atual.data.lastUpdate.toDate() < v.lastUpdate
      })
      .map((data) => {
        return { id: dadosCollection.doc(), data }
      })
    const motoristasDB = motoristas
      .filter((v) => {
        const atual = dadosAtuais.find(
          (k) => k.data.transporta && k.data.idAux == v.idAux
        )
        if (!atual) return true
        return atual.data.lastUpdate.toDate() < v.lastUpdate
      })
      .map((data) => {
        return { id: dadosCollection.doc(), data }
      })

    await notasDB
      .reduce(
        (p, c) => p.create(c.id, c.data),
        clientesDB.reduce(
          (p, c) => p.create(c.id, c.data),
          produtosDB.reduce(
            (p, c) => p.create(c.id, c.data),
            motoristasDB.reduce((p, c) => p.create(c.id, c.data), db.batch())
          )
        )
      )
      .commit()
    const resultado: IResultadoImportacao<Date> = {
      notas: notasDB.map((v) => {
        return { id: v.id.id, infNFe: v.data.view }
      }),
      clientes: clientesDB.map((v) => {
        return { id: v.id.id, dest: v.data.dest }
      }),
      produtos: produtosDB.map((v) => {
        return { id: v.id.id, prod: v.data.prod }
      }),
      motoristas: motoristasDB.map((v) => {
        return { id: v.id.id, transporta: v.data.transporta }
      }),
    }
    res.status(200).send(resultado)
  }
)

function getNotas(xmls: string[], cnpj: string) {
  return xmls
    .map((v) => {
      const root = toJson(v, { object: true, reversible: true }) as any
      if (!root?.nfeProc) return undefined
      const json = removePrefix(root.nfeProc.NFe.infNFe)
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
    .filter((v) => v && v.json.emit.CNPJ === cnpj)
    .map((v) => v!)
}

function getClientes(notas: INotaDB<Date>[]) {
  return getLastItens(
    notas
      .filter((v) => {
        const d = v.json.dest
        return d && d.xNome && d.enderDest
      })
      .map((v) => {
        const dest = v.json.dest
        return {
          dest,
          idAux: dest.CPF ?? dest.CNPJ,
          lastUpdate: v.lastUpdate,
        }
      }),
    (v) => v.dest.CPF ?? v.dest.CNPJ
  )
}

function getProdutos(notas: INotaDB<Date>[]) {
  const camposProdutos = [
    'cProd',
    'xProd',
    'EXTIPI',
    'uCom',
    'uTrib',
    'CFOP',
    'NCM',
    'vUnCom',
    'vUnTrib',
  ]
  return getLastItens(
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
            idAux: v.prod.cProd + v.prod.xProd,
            lastUpdate: j.lastUpdate,
          }
        })
      })
      .reduce((p, c) => {
        p.push(...c)
        return p
      }, []),
    (v) => v.prod.cProd + v.prod.xProd
  )
}

function getMotoristas(notas: INotaDB<Date>[]) {
  return getLastItens(
    notas
      .filter((v) => {
        const t = v.json.transp.transporta
        return t && (t.CPF || t.CNPJ)
      })
      .map((v) => {
        const transporta = v.json.transp.transporta
        return {
          transporta,
          idAux: transporta.CPF ?? transporta.CNPJ,
          lastUpdate: v.lastUpdate,
        }
      }),
    (v) => v.transporta.CPF ?? v.transporta.CNPJ
  )
}
