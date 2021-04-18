import { cors, functions, db, getUser } from './core'
import { SignedXml } from 'xml-crypto'

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
    // TO-DO: Implementar análise de permissões
    const dataEmpresa = empresa.data()!
    const xml = `<NFe xmlns="http://www.portalfiscal.inf.br/nfe"><infNFe Id="NFe25130412931158000164550010000000031230000149" versao="2.00"><ide><cUF>25</cUF><cNF>23000014</cNF><natOp>Venda</natOp><indPag>0</indPag><mod>55</mod><serie>1</serie><nNF>3</nNF><dEmi>2013-04-12</dEmi><dSaiEnt>2013-04-12</dSaiEnt><tpNF>1</tpNF><cMunFG>2505204</cMunFG><tpImp>1</tpImp><tpEmis>1</tpEmis><cDV>9</cDV><tpAmb>1</tpAmb><finNFe>1</finNFe><procEmi>3</procEmi><verProc>2.2.8</verProc></ide><emit><CNPJ>12931158000164</CNPJ><xNome>SEVERINO ALVES SERAFIM - ME</xNome><enderEmit><xLgr>SITIO BARRA DE CUITEGI</xLgr><nro>SN</nro><xBairro>ZONA RURAL</xBairro><cMun>2505204</cMun><xMun>Cuitegi</xMun><UF>PB</UF><CEP>58208000</CEP><cPais>1058</cPais><xPais>BRASIL</xPais><fone>8388962808</fone></enderEmit><IE>161813470</IE><IM>0012012</IM><CNAE>4744004</CNAE><CRT>1</CRT></emit><dest><CNPJ>12596298000123</CNPJ><xNome>LOJA OLIVEIRA CONSTRUÇÕES LTDA ME</xNome><enderDest><xLgr>RUA DELFINO COSME</xLgr><nro>SN</nro><xBairro>NORDESTE I</xBairro><cMun>2506301</cMun><xMun>Guarabira</xMun><UF>PB</UF><CEP>58200000</CEP><cPais>1058</cPais><xPais>BRASIL</xPais><fone>8332717396</fone></enderDest><IE>161869203</IE></dest><det nItem="1"><prod><cProd>001</cProd><cEAN/><xProd>AREIA LAVADA</xProd><NCM>25059001</NCM><CFOP>5120</CFOP><uCom>1</uCom><qCom>40.0000</qCom><vUnCom>11.5000000000</vUnCom><vProd>460.00</vProd><cEANTrib/><uTrib>1</uTrib><qTrib>40.0000</qTrib><vUnTrib>11.5000000000</vUnTrib><indTot>1</indTot></prod><imposto><ICMS><ICMSSN101><orig>0</orig><CSOSN>101</CSOSN><pCredSN>0.00</pCredSN><vCredICMSSN>0.00</vCredICMSSN></ICMSSN101></ICMS><PIS><PISNT><CST>07</CST></PISNT></PIS><COFINS><COFINSNT><CST>07</CST></COFINSNT></COFINS></imposto></det><total><ICMSTot><vBC>0.00</vBC><vICMS>0.00</vICMS><vBCST>0.00</vBCST><vST>0.00</vST><vProd>460.00</vProd><vFrete>0.00</vFrete><vSeg>0.00</vSeg><vDesc>0.00</vDesc><vII>0.00</vII><vIPI>0.00</vIPI><vPIS>0.00</vPIS><vCOFINS>0.00</vCOFINS><vOutro>0.00</vOutro><vNF>460.00</vNF></ICMSTot></total><transp><modFrete>9</modFrete></transp></infNFe></NFe>`

    const sig = new SignedXml()
    sig.addReference(
        "//*[local-name(.)='infNFe']",
        [
            'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
            'http://www.w3.org/2000/09/xmldsig#enveloped-signature'
        ],
        'http://www.w3.org/2000/09/xmldsig#sha1')
    sig.signingKey = dataEmpresa.privateCert
    sig.computeSignature(xml)
    const keyInfo = sig.keyInfoProvider.getKeyInfo()
    const signature = sig.getSignatureXml()
    const signed = sig.getSignedXml()
    //testar keyinfo e ver se tem como já ir direto sem manipulação
    res.status(200).send(`${keyInfo}\n${signature}\n${signed}`)
}))