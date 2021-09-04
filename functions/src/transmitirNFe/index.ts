import { toXml } from 'xml2json'
import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import gerarXml from './gerarXml'
import solicitar from './autorizacao'
import consultarResposta, { retConsReciNFe } from './retAutorizacao'
import validarAutenticacao from '../commom/validarAutenticacao'
import validarPermissao from '../commom/validarPermissao'
import carregarEmpresa from '../commom/carregarEmpresa'
import { Ambientes, Dados, IInfos, IReqTransmitir, IResTransmitir } from '../commom/tipos'

export default async function (
  req: IReqTransmitir,
  context: https.CallableContext
): Promise<IResTransmitir> {
  validarAutenticacao(context)
  const infNFe = req.infNFe
  validarRequisicao(infNFe)
  const token = context.auth!.token
  const CNPJ = infNFe.emit.CNPJ.$t
  validarPermissao(token, CNPJ)
  const { certificado, refEmpresa } = await carregarEmpresa(CNPJ)
  const infos = getInfos(infNFe)
  corrigirDestinatario(infNFe, infos.ambiente)
  const coluna = refEmpresa.collection(Dados.NFes)
  const numeroInicial =
    infos.numero > 0 //Devemos usar o preenchimento manual
      ? infos.numero //Então devemos usar o valor manual
      : await calcularNovoNumero(coluna, infos) //Se não, calculamos
  let adicionalNumero = 0
  while (adicionalNumero < 3) {
    const numero = numeroInicial + adicionalNumero++
    const xml = gerarXml(infNFe, certificado, numero)
    const numeroRecibo = await solicitar(infos, certificado, xml)
    const resultado = await consultarResposta(infos, certificado, numeroRecibo)
    if (resultado) return finalizar(coluna, infNFe, xml, resultado, req.oldId)
  }
  const mensagemLimiteAtingido =
    'Foi tentado autorizar a nota fiscal com 3 números seguidos e todos já ' +
    'foram emitidos. Caso você tenha emitido algumas notas em outro emissor, ' +
    'por favor, importe todas as novas notas emitidas ou então preencha ' +
    'manualmente o campo de número da nota fiscal.'
  throw new https.HttpsError('aborted', mensagemLimiteAtingido)
}

function validarRequisicao(infNFe: any) {
  if (!infNFe) {
    throw new https.HttpsError(
      'failed-precondition',
      'Campo informações da nota ausente.'
    )
  }
}

function getInfos(infNFe: any): IInfos {
  const serie: string = infNFe.ide.serie.$t
  const numero: number = +infNFe.ide.nNF.$t
  const ambiente: Ambientes = infNFe.ide.tpAmb.$t
  const modelo: '55' | '65' = infNFe.ide.mod.$t
  const UF: string = infNFe.emit.enderEmit.UF.$t
  return { serie, numero, ambiente, modelo, UF }
}

function corrigirDestinatario(infNFe: any, ambiente: Ambientes) {
  const xNome = infNFe.dest.xNome
  if (ambiente == Ambientes.Homologacao && xNome?.$t) {
    const clienteHomologacao =
      'NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL'
    xNome.$t = clienteHomologacao
  }
}

async function calcularNovoNumero(
  coluna: firestore.CollectionReference,
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

function removePrefix(obj: any) {
  if (typeof obj != 'object') return obj
  const e = Object.entries(obj)
  if (!e[0]) return obj
  if (e[0][0] == '$t') return e[0][1]
  e.forEach(([v0, v1]) => (obj[v0] = removePrefix(v1)))
  return obj
}

async function finalizar(
  coluna: firestore.CollectionReference,
  infNFe: any,
  xmlAssinado: string,
  respostaAutorizacao: retConsReciNFe,
  idAntigo: string
) {
  const nfeProc =
    '<nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">' +
    xmlAssinado +
    toXml({ protNFe: respostaAutorizacao.protNFe }) +
    '</nfeProc>'
  const nProt = Number(respostaAutorizacao.protNFe.infProt.nProt.$t)
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
  return novoRegistro
}
