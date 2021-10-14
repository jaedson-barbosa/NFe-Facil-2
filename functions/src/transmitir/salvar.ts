import { toXml } from 'xml2json'
import * as admin from 'firebase-admin'

export async function salvar(
  coluna: admin.firestore.CollectionReference,
  infNFe: any,
  xmlAssinado: string,
  protNFe: any,
  idAntigo: string
) {
  const nfeProc =
    '<nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">' +
    xmlAssinado +
    toXml({ protNFe }) +
    '</nfeProc>'
  const nProt = Number(protNFe.infProt.nProt.$t)
  if (idAntigo) {
    const oldDocRef = coluna.doc(idAntigo)
    const oldDoc = await oldDocRef.get()
    if (oldDoc.exists) {
      const nProt = oldDoc.get('nProt')
      if (!nProt) await oldDocRef.delete()
    }
  }
  const dhEmi = new Date(infNFe.ide.dhEmi.$t)
  const novoRegistro = {
    cancelada: false,
    infNFe: removePrefix(infNFe),
    dhEmi,
    nProt,
    xml: nfeProc,
  }
  await coluna.doc(infNFe.Id).set(novoRegistro)
  const mensagem = protNFe.infProt.xMsg?.$t
  return mensagem ? { ...novoRegistro, mensagem } : novoRegistro
}

function removePrefix(obj: any) {
  if (typeof obj != 'object') return obj
  const e = Object.entries(obj)
  if (!e[0]) return obj
  if (e[0][0] == '$t') return e[0][1]
  e.forEach(([v0, v1]) => (obj[v0] = removePrefix(v1)))
  return obj
}
