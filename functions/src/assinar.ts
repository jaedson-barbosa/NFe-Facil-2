import { SignedXml } from 'xml-crypto'

export default function (
  cert: ICertificado,
  xml: string,
  campo: 'infNFe' | 'infEvento'
) {
  const sig = new SignedXml()
  sig.keyInfoProvider = new keyProvider(cert.chavePublica)
  sig.addReference(
    `//*[local-name(.)='${campo}']`,
    [
      'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
      'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
    ],
    'http://www.w3.org/2000/09/xmldsig#sha1'
  )
  sig.canonicalizationAlgorithm =
    'http://www.w3.org/TR/2001/REC-xml-c14n-20010315'
  sig.signingKey = cert.chavePrivada
  sig.computeSignature(xml)
  return sig.getSignedXml()
}

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
