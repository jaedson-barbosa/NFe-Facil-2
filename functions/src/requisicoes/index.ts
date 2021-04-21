import { onRequest, db } from '../core'
import * as https from 'https'
import * as axios from 'axios'
import * as servicos from './servicos.json'
import * as webservicesNFe from './webservicesNFe.json'
import { IBGESimplificado } from './IBGESimplificado.json'

type nomesServicos = keyof typeof servicos

interface requestConfig {
    httpsAgent: https.Agent
    headers: { 'Content-Type': string }
}

async function enviarRequisicao(address: string, body: string, nomeServico: nomesServicos, config: requestConfig) {
    body = `<Envelope xmlns="http://www.w3.org/2003/05/soap-envelope">
    <Body>
        <nfeDadosMsg xmlns="${servicos[nomeServico].method}">
            ${body}
        </nfeDadosMsg>
    </Body>
    </Envelope>`.replace(/>\s+</g, "><")
    const resp = await axios.default.post(address, body, config)
    return resp.data
}

export const consultarStatus = onRequest(true, async (user, res, body) => {
    if (!body.id) {
        res.status(400).send('Corpo de requisição sem ID')
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
    const uf = dataEmpresa.emit.enderEmit.UF as string
    const cUF = IBGESimplificado.find(v => v.Sigla == uf)?.Codigo
    const servico: nomesServicos = 'consultarStatusServico'
    const url = getWebServiceByUF(uf).servicos[servico].url_homologacao
    const resp = await enviarRequisicao(
        url,
        `<consStatServ versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
            <tpAmb>2</tpAmb>
            <cUF>${cUF}</cUF>
            <xServ>STATUS</xServ>
        </consStatServ>`,
        servico,
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
})

function getWebServiceByUF(uf: string) {
    switch (uf) {
        case 'AM':
            return webservicesNFe.AM;
        case 'BA':
            return webservicesNFe.BA;
        case 'CE':
            return webservicesNFe.CE;
        case 'GO':
            return webservicesNFe.GO;
        case 'MG':
            return webservicesNFe.MG;
        case 'MS':
            return webservicesNFe.MS;
        case 'MT':
            return webservicesNFe.MT;
        case 'PE':
            return webservicesNFe.PE;
        case 'PR':
            return webservicesNFe.PR;
        case 'RS':
            return webservicesNFe.RS;
        case 'SP':
            return webservicesNFe.SP;
        case 'MA':
        case 'PA':
            return webservicesNFe.SVAN;
        case 'AC':
        case 'AL':
        case 'AP':
        case 'DF':
        case 'ES':
        case 'PB':
        case 'PI':
        case 'RJ':
        case 'RN':
        case 'RO':
        case 'RR':
        case 'SC':
        case 'SE':
        case 'TO':
            return webservicesNFe.SVRS;
        default:
            throw new Error('Autorizador não encontrado!');
    }
}
