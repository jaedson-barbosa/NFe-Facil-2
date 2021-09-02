import { SignedXml } from 'xml-crypto'
import { keyProvider } from "./keyProvider"

export function assinarEvento(cert: ICertificate, unsignedXml: string) {
  // const usuario = await empresa.ref.collection('usuarios').doc(user.sub).get()
  // if (usuario.exists) res.status(200).send(usuario.data())
  // else res.status(400).send('Usuário não cadastrado')
  // TO-DO: Implementar análise de permissões e verificação de XML
  const sig = new SignedXml()
  sig.keyInfoProvider = new keyProvider(cert.publicCert)
  sig.addReference(
    "//*[local-name(.)='infEvento']",
    [
      'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
      'http://www.w3.org/TR/2001/REC-xml-c14n-20010315'
    ],
    'http://www.w3.org/2000/09/xmldsig#sha1'
  )
  sig.canonicalizationAlgorithm =
    'http://www.w3.org/TR/2001/REC-xml-c14n-20010315'
  sig.signingKey = cert.privateCert
  sig.computeSignature(unsignedXml)
  return sig.getSignedXml()
}
