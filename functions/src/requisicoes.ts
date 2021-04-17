import { cors, functions, db, getUser } from './core'
import * as https from 'https'
import * as axios from 'axios'

interface requestConfig {
    httpsAgent: https.Agent
    headers: { 'Content-Type': string }
}

async function enviarRequisicao(address: string, body: string, config: requestConfig) {
    const resp = await axios.default.post(address, body, config)
    return resp.data
}

export const consultarStatus = functions.https.onRequest((req, res) => cors(req, res, async () => {
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
    // TO-DO: Implementar análise de permissões
    const dataEmpresa = empresa.data()!
    const resp = await enviarRequisicao(
        'https://nfe.svrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx',
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
        </Envelope>`.replace(/>\s+</g, "><"),
        {
            httpsAgent: new https.Agent(
                {
                    rejectUnauthorized: false,
                    cert: dataEmpresa.publicCert,
                    key: dataEmpresa.privateCert
                }
            ),
            headers: { 'Content-Type': 'application/soap+xml' }
        }
    )
    // Passar detalhes pro metodo generico e puxar todos os endereços do projeto original UWP, implementar todas aquelas funções
    res.status(200).send(resp)
}))