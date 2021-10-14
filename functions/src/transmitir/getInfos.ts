import * as admin from 'firebase-admin'
import { Ambientes, IInfos } from '../commom/tipos'

export async function getInfos(
  coluna: FirebaseFirestore.CollectionReference,
  infNFe: any
) {
  const serie: string = infNFe.ide.serie.$t
  const numero: number = +infNFe.ide.nNF.$t
  const ambiente: Ambientes = infNFe.ide.tpAmb.$t
  const modelo: '55' | '65' = infNFe.ide.mod.$t
  const UF: string = infNFe.emit.enderEmit.UF.$t
  corrigirDestinatario(infNFe, ambiente)
  const infos = { serie, numero, ambiente, modelo, UF }
  infos.numero =
    numero > 0 //Analisamos se devemos usar o preenchimento manual
      ? numero //Se sim, usamos o valor manual
      : await calcularNovoNumero(coluna, infos) //Se não, calculamos
  return infos
}

function corrigirDestinatario(infNFe: any, ambiente: Ambientes) {
  if (!infNFe.dest) return
  const xNome = infNFe.dest.xNome
  if (ambiente == Ambientes.Homologacao && xNome?.$t) {
    const clienteHomologacao =
      'NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL'
    xNome.$t = clienteHomologacao
  }
}

async function calcularNovoNumero(
  coluna: admin.firestore.CollectionReference,
  infos: IInfos
) {
  const maxNota = await coluna
    .where('infNFe.ide.mod', '==', infos.modelo)
    .where('infNFe.ide.serie', '==', infos.serie)
    .where('infNFe.ide.tpAmb', '==', infos.ambiente)
    .orderBy('infNFe.ide.nNF', 'desc')
    .select('infNFe.ide.nNF')
    .limit(1)
    .get()
  if (maxNota.empty) return 1
  return +maxNota.docs[0].get('infNFe.ide.nNF') + 1
}
