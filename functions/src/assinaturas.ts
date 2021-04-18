import { cors, functions, db, getUser } from './core'
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

export const assinarNFe = functions.https.onRequest((req, res) => cors(req, res, async () => {
    const user = await getUser(req);
    if (!user) {
        // Usuário não foi encontrado, então apenas se rejeita a requisição.
        res.sendStatus(401)
        return
    }
    const body = req.body ? JSON.parse(req.body) : undefined
    if (!body) {
        res.status(400).send('Corpo de requisição inválido')
        return
    }
    const empresa = await db.collection('empresas').doc(body.id).get()
    if (!empresa.exists) {
        res.status(400).send('Empresa não existe')
        return
    }
    // const usuario = await empresa.ref.collection('usuarios').doc(user.sub).get()
    // if (usuario.exists) res.status(200).send(usuario.data())
    // else res.status(400).send('Usuário não cadastrado')
    // TO-DO: Implementar análise de permissões e verificação de XML
    const dataEmpresa = empresa.data()!
    const sig = new SignedXml()
    sig.keyInfoProvider = new keyProvider(dataEmpresa.publicCert)
    sig.addReference(
        "//*[local-name(.)='infNFe']",
        [
            'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
            'http://www.w3.org/2000/09/xmldsig#enveloped-signature'
        ],
        'http://www.w3.org/2000/09/xmldsig#sha1')
    sig.canonicalizationAlgorithm = 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315'
    sig.signingKey = dataEmpresa.privateCert
    sig.computeSignature(body.xml)
    const signed = sig.getSignedXml()
    res.status(200).type('application/xml').send(signed)
}))