const express = require('express')
const fs = require('fs')
const https = require('https')

const app = express()
app.get('/', (req, res) => {
    res.send('<a href="authenticate">Log in using client certificate</a>')
})
app.get('/authenticate', (req, res) => {
    if (!('getPeerCertificate' in req.connection)) {
        res.status(401)
            .send(`Sorry, but you need to provide a client certificate to continue.`)
        return
    }
    const cert = req.connection.getPeerCertificate()
    if (req.client.authorized) {
        res.send(`Hello ${cert.subject.CN}, your certificate was issued by ${cert.issuer.CN}!`)
    } else if (cert.subject) {
        res.status(403)
            .send(`Sorry ${cert.subject.CN}, certificates from ${cert.issuer.CN} are not welcome here.`)
    } else {
        res.status(401)
            .send(`Sorry, but you need to provide a client certificate to continue.`)
    }
})

https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/nfefacilapi.xyz/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/nfefacilapi.xyz/fullchain.pem'),
    requestCert: true,
    rejectUnauthorized: false,
    ca: [fs.readFileSync('./icpbrasilv5.crt')]
}, app).listen(3000, () => console.log('started'))
