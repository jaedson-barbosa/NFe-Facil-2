import { firestore, auth } from 'firebase-admin'
import { onDefaultRequest } from './onDefaultRequest'
import { consultarStatusServico } from './statusServico'
import * as forge from 'node-forge'
import { TAmb } from './TAmb'
import { https } from 'firebase-functions'

const pki = forge.pki

const db = firestore()

export const precadastro = onDefaultRequest(
  async ({ cert, senha }, context) => {
    if (!cert) {
      throw new https.HttpsError(
        'failed-precondition',
        'Campo "cert" (certificado do emitente) ausente.'
      )
    }
    if (!senha) {
      throw new https.HttpsError(
        'failed-precondition',
        'Campo "senha" (senha do certificado) ausente.'
      )
    }

    const p12Der = forge.util.decode64(cert)
    const p12Asn1 = forge.asn1.fromDer(p12Der)
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, senha)
    // Dá erro quando a senha está errada
    const certBags = p12.getBags({ bagType: pki.oids.certBag })
    const pkeyBags = p12.getBags({ bagType: pki.oids.pkcs8ShroudedKeyBag })
    const certBag = certBags[pki.oids.certBag]![0]
    const keybag = pkeyBags[pki.oids.pkcs8ShroudedKeyBag]![0]
    const privateKey = keybag.key!
    const privateCert = pki.privateKeyToPem(privateKey)
    const certificado = certBag.cert!
    const publicCert = pki.certificateToPem(certificado)

    const certUser = certificado.subject.getField('CN').value as string
    const certParts = certUser.split(':')
    if (certParts.length != 2) {
      throw new https.HttpsError('invalid-argument', 'Certificado inválido.')
    }
    const cnpj = certParts[1]
    if (cnpj.length != 14) {
      throw new https.HttpsError(
        'invalid-argument',
        'Certificado com CNPJ inválido.'
      )
    }

    // A melhor análise existente é a da SEFAZ
    const UF = certificado.subject.getField('ST').value as string
    let valido = true
    try {
      const resp = await consultarStatusServico(UF, TAmb.Producao, {
        privateCert,
        publicCert,
      })
      valido = resp.cStat == '107' || resp.cStat == '108' || resp.cStat == '109'
    } catch (error) {
      valido = false
    }
    if (!valido) {
      throw new https.HttpsError(
        'invalid-argument',
        'Certificado possivelmente inválido.',
        'Não foi possível se comunicar com a SEFAZ usando este certificado.' +
          'É possível que os servidores da SEFAZ estejam com algum problema e ' +
          'por isso ele não foi aceito. Por isso, por enquanto, este ' +
          'certificado não será aceito para efetuar o seu cadastro.'
      )
    }

    const empresaRef = db.collection('empresas').doc(cnpj)
    const empresa = await empresaRef.get()
    if (!empresa.exists) {
      const sha256 = forge.md.sha256.create()
      sha256.update(senha)
      const encryptedPassword = sha256.digest().toHex()
      const endPass = cnpj + encryptedPassword
      const encryptedPrivateKey = pki.encryptRsaPrivateKey(privateKey, endPass)

      await db.collection('certificados').doc(cnpj).set({
        publicCert,
        privateCert: encryptedPrivateKey,
      })
      await empresaRef.set({
        emit: {
          CNPJ: cnpj,
          xNome: certParts[0],
        },
        serieNFe: '1',
        serieNFCe: '1',
        IDCSC: '',
        CSC: '',
      })
    }

    const niveis = [NiveisAcesso.R, NiveisAcesso.RW, NiveisAcesso.A]
    const liberacoes = { [cnpj]: NiveisAcesso.A }
    Object.entries(context.auth!.token)
      .filter(([_, v]) => niveis.includes(v))
      .forEach(([key, v]) => (liberacoes[key] = v))
    await auth().setCustomUserClaims(context.auth!.uid, liberacoes)
    return { cnpj }
  }
)


