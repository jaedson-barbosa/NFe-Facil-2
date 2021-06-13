import { firestore } from 'firebase-admin'
import { onDefaultRequest } from './onDefaultRequest'
import { consultarStatusServico } from './statusServico'
import * as forge from 'node-forge'
import { TAmb } from './TAmb'

const pki = forge.pki

const db = firestore()

export const precadastro = onDefaultRequest(async ({ user, body }, res) => {
  if (!body.cert) {
    res.status(400).send('Certificado inválido')
    return
  }
  if (!body.senha) {
    res.status(400).send('Senha inválida')
    return
  }
  if (!body.ident) {
    res.status(400).send('Nome inválido')
    return
  }

  const password = body.senha
  const p12Der = forge.util.decode64(body.cert)
  const p12Asn1 = forge.asn1.fromDer(p12Der)
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password)
  // Dá erro quando a senha está errada
  const certBags = p12.getBags({ bagType: pki.oids.certBag })
  const pkeyBags = p12.getBags({ bagType: pki.oids.pkcs8ShroudedKeyBag })
  const certBag = certBags[pki.oids.certBag]![0]
  const keybag = pkeyBags[pki.oids.pkcs8ShroudedKeyBag]![0]
  const privateKey = keybag.key!
  const privateCert = pki.privateKeyToPem(privateKey)
  const cert = certBag.cert!
  const publicCert = pki.certificateToPem(cert)

  const certUser = cert.subject.getField('CN').value as string
  const certParts = certUser.split(':')
  if (certParts.length != 2) {
    res.status(400).send('Certificado inválido')
    return
  }
  const cnpj = certParts[1]
  if (cnpj.length != 14) {
    res.status(400).send('CNPJ inválido')
    return
  }

  // A melhor análise existente é a da SEFAZ
  const UF = cert.subject.getField('ST').value as string
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
    res.status(400).send('Certificado inválido')
    return
  }

  const empresaRef = db.collection('empresas').doc(cnpj)
  const empresa = await empresaRef.get()
  if (!empresa.exists) {
    const sha256 = forge.md.sha256.create()
    sha256.update(password)
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
      CSC: ''
    })
  }
  await empresaRef.collection('usuarios').doc(user.sub).set({
    status: 4,
    ident: body.ident,
    id: user.sub,
  })
  res.sendStatus(201)
})
