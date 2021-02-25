const express = require('express')
const fs = require('fs')
const https = require('https')
var forge = require('node-forge');
const xmlCrypto = require('xml-crypto')
const axios = require('axios')

const app = express()
app.get('/', (req, res) => {
    var keyFile = fs.readFileSync('./1001569634.pfx');
    var keyBase64 = keyFile.toString('base64');
    var p12Der = forge.util.decode64(keyBase64);
    var p12Asn1 = forge.asn1.fromDer(p12Der);
    var p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, '12345678');
    var certBags = p12.getBags({bagType: forge.pki.oids.certBag});
    var pkeyBags = p12.getBags({bagType: forge.pki.oids.pkcs8ShroudedKeyBag});
    var certBag = certBags[forge.pki.oids.certBag][0];
    var keybag = pkeyBags[forge.pki.oids.pkcs8ShroudedKeyBag][0];
    var privateKeyPem = forge.pki.privateKeyToPem(keybag.key);
    var certificate = forge.pki.certificateToPem(certBag.cert);
    
    const xml = "<library><book><name>Harry Potter</name></book></library>"
    const sig = new xmlCrypto.SignedXml()
    // Esse pra assinar
    // sig.addReference("//*[local-name(.)='book']")  
    // sig.signingKey = privateKeyPem
    // sig.computeSignature(xml)
    // const signed = sig.getSignedXml()
    // console.log(signed)
    // res.send(signed)
    //Esse pra enviar
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
        cert: certificate,
        key: privateKeyPem
    })
    //Agora é implementar as demais funções (testar algumas pelo menos).
    const xmls = 
    `<Envelope xmlns="http://www.w3.org/2003/05/soap-envelope">
    <Body>
        <nfeDadosMsg xmlns="http://www.portalfiscal.inf.br/nfe/wsdl/NFeStatusServico4">
            <consStatServ versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
                <tpAmb>1</tpAmb>
                <cUF>25</cUF>
                <xServ>STATUS</xServ>
            </consStatServ>
        </nfeDadosMsg>
    </Body>
    </Envelope>`.replace(/>\s+</g, "><")
    axios.default.post('https://nfe.svrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx', xmls, {
        httpsAgent: httpsAgent,
        headers: { 'Content-Type': 'application/soap+xml' }
    }).then(resp => res.send(resp.data))
})
app.get('/ok', (req, res) => {
    const Xsd2JsonSchema = require('xsd2jsonschema').Xsd2JsonSchema;
    const xs2js = new Xsd2JsonSchema();
    const basicPath = fs.readFileSync("C:\\Users\\jaeds\\Desktop\\PL_009\\tiposBasico_v4.00.xsd", 'utf-8')
    const nfePath = fs.readFileSync("C:\\Users\\jaeds\\Desktop\\PL_009\\leiauteNFe_v4.00.xsd", 'utf-8');
    const schemas = { 'basic': basicPath, 'nfe': nfePath }
    const convertedSchemas = xs2js.processAllSchemas({ schemas: schemas });
    fs.writeFile('basic.json', JSON.stringify(convertedSchemas['basic'].getJsonSchema(), null, 4), (err) => {
        if (err) throw err;
        console.log("JSON data is saved.");
    });
    fs.writeFile('nfe.json', JSON.stringify(convertedSchemas['nfe'].getJsonSchema(), null, 4), (err) => {
        if (err) throw err;
        console.log("JSON data is saved.");
    });
})
app.listen(8080, () => console.log('Started'))

app.get('/sign', (req, res) => {
    if (!('getPeerCertificate' in req.connection)) {
        res.status(401)
            .send(`Sorry, but you need to provide a client certificate to continue.`)
        return
    }
    const cert = req.connection.getPeerCertificate()
    if (req.client.authorized) {
        const xml = "<library><book><name>Harry Potter</name></book></library>"
        const sig = new xmlCrypto.SignedXml()
        sig.addReference("//*[local-name(.)='book']")  
        sig.signingKey = fs.readFileSync('./test2.cer')
        sig.computeSignature(xml)
        res.send(sig.getSignedXml())
    } else if (cert.subject) {
        res.status(403)
            .send(`Sorry ${cert.subject.CN}, certificates from ${cert.issuer.CN} are not welcome here.`)
    } else {
        res.status(401)
            .send(`Sorry, but you need to provide a client certificate to continue.`)
    }
})/*

const serverKey = 
`-----BEGIN PRIVATE KEY-----
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
iFsYU+o5r7Dm7q617dGFbUAQZD4zFg==
-----END PRIVATE KEY-----
`
const serverCert = 
`-----BEGIN CERTIFICATE-----
MIIFPzCCAyegAwIBAgIJAO7JNyx6NH7mMA0GCSqGSIb3DQEBCwUAMDYxEjAQBgNV
BAMMCWxvY2FsaG9zdDEgMB4GA1UECgwXQ2xpZW50IENlcnRpZmljYXRlIERlbW8w
HhcNMTcwNzIyMTYxNDUwWhcNMTgwNzIyMTYxNDUwWjA2MRIwEAYDVQQDDAlsb2Nh
bGhvc3QxIDAeBgNVBAoMF0NsaWVudCBDZXJ0aWZpY2F0ZSBEZW1vMIICIjANBgkq
hkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAwczYpuRJOfF5sr2wZFespNhDS9BHlTqn
vF1N1TiizCZTPpEVKxAsqFqhekf/o/7lKoG3IZIjFdIdPOfvUjmcZ2iRPjdEb/QN
JBELhux3V7J7F69rlJ0DfhYgzNppZx5TGwM/ltcNc38JxSluJNC3ZbE58RWeO7vP
6cuqPIQodE2zXMVZplaXpSfkZpjIdCbeM2CaGFOSjteznpI/pxTQE5sVrF7jcWwg
fJFWZdqi12YinNpkNls3GUCbiFkmxNNpLEphCqnjYVrqCtoiAuwmSIC5mjtiJ7eI
nX3laCI7VVcNuiKJuto6fPRJvhB4Lqo9To6vZ0/t9d1LB59ho1+hc92negnEj0Hj
sGVo0PVxHels9UXyicVBDCz7m7/DLio703Up/PW9llPb+oV+L06tEt1Q/IlJaxBe
x/7hTNGZAwWhcfl49cxTRsiQr/xfDJ7iI6KYLRDjH10WSH1uGW164CsX3N6c8296
VzOYISVV9zAOQ7LqXMMw0iqX4Za05J1cMEaZHZzbqspaNgU0WwyzCXFrr4eGC8CS
Alg6XmXPJHYZAiIj7x5NCsJ6nP4dBJ195ai0oHMS0Fz3P5tU8vUV9NYmdNWYn4jp
EoS6gnz2WvUUoTViimfC1cRIjOL4iWfNgpMso4Lf/WS7K8zWKELSVSuvNDsYJ4FC
h11eNyf0htsCAwEAAaNQME4wHQYDVR0OBBYEFFaYMWjyfRHuDcGc5HtJxfudacXT
MB8GA1UdIwQYMBaAFFaYMWjyfRHuDcGc5HtJxfudacXTMAwGA1UdEwQFMAMBAf8w
DQYJKoZIhvcNAQELBQADggIBABdNbP5h924HQsZv12JbLJLtwJgowmEU1r3zjbRv
DtChkbmNblgX4PaANpcnvQpjtVOixWVRYPiWhIdtOc6ZRQGCqVQG6i5H10sDuNVa
w4OiUP4CVwnAdY/ZxZyDfwdumvdgFjXAxCj1VzAV3+FIzBmgDD29etRKi28JPwEj
nyt9GWtFJZKYAhUjmMijEiwG7XG/NvFTIHGYkNtVDVaWaAfidnDBJRqoDtNROTUD
JcZrL9BmINuRjgPaVpB5vnPhnUiQ2Ti61Wy265PSQnbJ2OP/WmdmSRcRpIPZHjfX
/n+MhsznZsx+KmyweXpHUjLo0zBSsgnI787GK4naP7lpGPruYQPw1yPOqnUsfcGh
805JL0XQu5SzKXEAbklgrLBBL8I+qoLMLCVUg/chUP63BhowQqBzs3tJXi09kyWE
HCb7KEvBBpsm7UEpjz1RgPwDMKYCIJFukL+qZQi0Pz6MwNSYANcCLT/ewczTzESI
1NMBF6gYc4Ds6Z/xDlDRC+bSPumGNtPC76L9sErmqFSIJBPGjTirNefgPJI3b2uq
0ZC5r8KqqDFLqLogqkqmFcC7y0BKg+oFGNE2yQ2xBXxQ0akLD2UAXytB0WeZ4aGB
aaBofCjg05aViDK/KoROVpbmpxBdidceC6u6ZXv2GuXmjB0VCvzWJH/mt34k9r20
K7zh
-----END CERTIFICATE-----
`

https.createServer({
    // key: fs.readFileSync('/etc/letsencrypt/live/nfefacilapi.xyz/privkey.pem'),
    // cert: fs.readFileSync('/etc/letsencrypt/live/nfefacilapi.xyz/fullchain.pem'),
    key: serverKey,
    cert: serverCert,
    requestCert: true,
    rejectUnauthorized: false,
    ca: [fs.readFileSync('./icpbrasilv5.crt')]
}, app).listen(443, () => console.log('started'))
*/