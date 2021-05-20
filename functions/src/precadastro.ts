import { onDefaultRequest, db } from './core'
import * as forge from 'node-forge'

export default onDefaultRequest(true, async (user, res, body) => {
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
  //Interessante pôr análise de CA (autoridade certificadora)
  const p12Der = forge.util.decode64(body.cert)
  const p12Asn1 = forge.asn1.fromDer(p12Der)
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, body.senha)
  const certBags = p12.getBags({ bagType: forge.pki.oids.certBag })
  const pkeyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })
  const certBag = certBags[forge.pki.oids.certBag]![0]
  const keybag = pkeyBags[forge.pki.oids.pkcs8ShroudedKeyBag]![0]
  const privateCert = forge.pki.privateKeyToPem(keybag.key!)
  const cert = certBag.cert!
  const publicCert = forge.pki.certificateToPem(cert)

  const certUser = cert.subject.getField('CN').value as string
  const certParts = certUser.split(':')
  if (certParts.length != 2) {
    res.status(400).send('Certificado inválido')
    return
  }
  const cnpj = certParts[1]

  const empresa = await db.collection('empresas').doc(cnpj).get()
  if (empresa.exists) {
    res.status(400).send('Empresa já existe')
    return
  }
  await db.collection('certificados').doc(cnpj).set({
    publicCert,
    privateCert,
  })
  const empresaRef = db.collection('empresas').doc(cnpj)
  await empresaRef.set({
    emit: {
      CNPJ: cnpj,
      xNome: certParts[0]
    },
    serieNFe: "1"
  })
  await empresaRef.collection('usuarios').doc(user.sub).set({
    status: 3,
    ident: body.ident,
    id: user.sub,
  })
  res.sendStatus(201)
})
