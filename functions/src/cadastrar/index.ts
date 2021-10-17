import * as admin from 'firebase-admin'
import { consultarStatusServico } from './statusServico'
import { https } from 'firebase-functions'
import * as forge from 'node-forge'
import validarAutenticacao from '../commom/validarAutenticacao'
import {
  Ambientes,
  ICertificado,
  IReqCadastrar,
  IResCadastrar,
  NiveisAcesso,
} from '../commom/tipos'

const { firestore, auth } = admin
const db = firestore()

export default async function (
  req: IReqCadastrar,
  context: https.CallableContext
): Promise<IResCadastrar> {
  validarAutenticacao(context)
  validarRequisicao(req)
  const certificado = carregarCertificado(req)
  const { CNPJ, UF, xNome } = getInfosCertificado(certificado)
  const certificadoDB = getCertificadoDB(certificado)
  await validarCertificado(certificadoDB, UF)
  await verificarRegistrarEmpresa(CNPJ, xNome, certificadoDB)
  await registrarUsuario(CNPJ, context.auth!.token)
  return { cnpj: CNPJ }
}

function validarRequisicao(req: IReqCadastrar) {
  if (!req.cert) {
    throw new https.HttpsError(
      'failed-precondition',
      'Campo "cert" (certificado do emitente) ausente.'
    )
  }
  if (!req.senha) {
    throw new https.HttpsError(
      'failed-precondition',
      'Campo "senha" (senha do certificado) ausente.'
    )
  }
}

interface INovoCertificado {
  chavePublica: forge.pki.Certificate
  chavePrivada: forge.pki.PrivateKey
}

function carregarCertificado(req: IReqCadastrar): INovoCertificado {
  const p12Der = forge.util.decode64(req.cert)
  const p12Asn1 = forge.asn1.fromDer(p12Der)
  let p12
  try {
    p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, req.senha)
  } catch (error) {
    throw new https.HttpsError('invalid-argument', 'Senha errada.')
  }
  const certBags = p12.getBags({ bagType: forge.pki.oids.certBag })
  const pkeyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })
  const certBag = certBags[forge.pki.oids.certBag]![0]
  const keybag = pkeyBags[forge.pki.oids.pkcs8ShroudedKeyBag]![0]
  const chavePrivada = keybag.key!
  const chavePublica = certBag.cert!
  return { chavePublica, chavePrivada }
}

function getInfosCertificado({ chavePublica }: INovoCertificado) {
  const certUser = chavePublica.subject.getField('CN').value as string
  const certParts = certUser.split(':')
  if (certParts.length != 2) {
    throw new https.HttpsError('invalid-argument', 'Certificado inválido.')
  }
  const CNPJ = certParts[1]
  if (CNPJ.length != 14) {
    throw new https.HttpsError(
      'invalid-argument',
      'Certificado com CNPJ inválido.'
    )
  }
  const UF = chavePublica.subject.getField('ST').value as string
  return { CNPJ, UF, xNome: certParts[0] }
}

function getCertificadoDB(certificado: INovoCertificado): ICertificado {
  return {
    chavePublica: forge.pki.certificateToPem(certificado.chavePublica),
    chavePrivada: forge.pki.privateKeyToPem(certificado.chavePrivada),
  }
}

async function validarCertificado(certificado: ICertificado, UF: string) {
  try {
    const resp = await consultarStatusServico(
      UF,
      Ambientes.Producao,
      certificado
    )
    const valido =
      resp.cStat == '107' || resp.cStat == '108' || resp.cStat == '109'
    if (!valido) {
      throw new https.HttpsError(
        'invalid-argument',
        'No momento, não foi possível consultar a SEFAZ usando este certificado.'
      )
    }
  } catch (error) {
    throw new https.HttpsError(
      'internal',
      'Erro ao tentar se conectar à SEFAZ com este certificado.'
    )
  }
}

async function verificarRegistrarEmpresa(
  CNPJ: string,
  xNome: string,
  certificado: ICertificado
) {
  const empresaRef = db.collection('empresas').doc(CNPJ)
  const empresa = await empresaRef.get()
  if (empresa.exists) return
  await db.collection('certificados').doc(CNPJ).set(certificado)
  const empresaDoc = {
    emit: { CNPJ, xNome },
    serieNFe: '1',
    serieNFCe: '1',
    IDCSC: '',
    CSC: '',
    IDCSCh: '',
    CSCh: '',
  }
  await empresaRef.set(empresaDoc)
}

async function registrarUsuario(CNPJ: string, token: admin.auth.DecodedIdToken) {
  const niveis = [NiveisAcesso.RW, NiveisAcesso.A]
  const liberacoes = { [CNPJ]: NiveisAcesso.A }
  Object.entries(token)
    .filter(([_, v]) => niveis.includes(v))
    .forEach(([key, v]) => (liberacoes[key] = v))
  await auth().setCustomUserClaims(token.uid, liberacoes)
}
