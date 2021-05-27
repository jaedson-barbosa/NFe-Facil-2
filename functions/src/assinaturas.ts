import { IEmpresaGet } from './core'
import { SignedXml } from 'xml-crypto'

class keyProvider {
  public file: string
  private publicCertificate: string

  constructor(publicCertificate: string) {
    this.file = ''
    this.publicCertificate = publicCertificate
      .replace('-----BEGIN CERTIFICATE-----', '')
      .replace('-----END CERTIFICATE-----', '')
      .replace(/\s/g, '')
      .replace(/(\r\n\t|\n|\r\t)/gm, '')
  }

  public getKeyInfo(): string {
    return `<X509Data><X509Certificate>${this.publicCertificate}</X509Certificate></X509Data>`
  }

  public getKey(): Buffer {
    return Buffer.from(this.publicCertificate)
  }
}

export async function assinarNFe(dataCert: any, unsignedXml: string) {
  // const usuario = await empresa.ref.collection('usuarios').doc(user.sub).get()
  // if (usuario.exists) res.status(200).send(usuario.data())
  // else res.status(400).send('Usuário não cadastrado')
  // TO-DO: Implementar análise de permissões e verificação de XML
  const sig = new SignedXml()
  sig.keyInfoProvider = new keyProvider(dataCert.publicCert)
  sig.addReference(
    "//*[local-name(.)='infNFe']",
    [
      'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
      'http://www.w3.org/TR/2001/REC-xml-c14n-20010315'
    ],
    'http://www.w3.org/2000/09/xmldsig#sha1'
  )
  sig.canonicalizationAlgorithm =
    'http://www.w3.org/TR/2001/REC-xml-c14n-20010315'
  sig.signingKey = dataCert.privateCert
  sig.computeSignature(unsignedXml)
  return sig.getSignedXml()
}

export function assinarEvento(dataEmpresa: IEmpresaGet, unsignedXml: string) {
  // const usuario = await empresa.ref.collection('usuarios').doc(user.sub).get()
  // if (usuario.exists) res.status(200).send(usuario.data())
  // else res.status(400).send('Usuário não cadastrado')
  // TO-DO: Implementar análise de permissões e verificação de XML
  const sig = new SignedXml()
  sig.keyInfoProvider = new keyProvider(dataEmpresa.publicCert)
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
  sig.signingKey = dataEmpresa.privateCert
  sig.computeSignature(unsignedXml)
  return sig.getSignedXml()
}
