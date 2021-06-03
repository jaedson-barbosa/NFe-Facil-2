export class keyProvider {
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