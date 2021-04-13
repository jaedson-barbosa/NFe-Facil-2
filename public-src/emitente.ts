import { defaultFormSubmit, getForm, defaultForm, genericFormElement } from './form-base'
import { setEmpresa, IEmpresa } from './dados/emitentes'
import { abrirPainel, getEmpresaAtiva, isSessaoIniciada } from './sessao'

async function getCertPostBody(data: any, additionalBody?: (body: any) => void) {
    if (data.cert) {
        const body = {
            cert: btoa(String.fromCharCode(...new Uint8Array(await (data.cert as File).arrayBuffer()))),
            senha: data.senha
        }
        if (additionalBody) additionalBody(body)
        return {
            method: 'POST',
            body: JSON.stringify(body)
        }
    } return {}
}

async function acessar(cnpj: string, data?: any) {
    const acessarUrl = `http://localhost:5001/nfe-facil-980bc/us-central1/requisitarAcesso?cnpj=${cnpj}`
    const respAcesso = await fetch(acessarUrl, await getCertPostBody(data))
    if (respAcesso.status == 401) {
        location.href = './login.html'
        return
    }
    if (respAcesso.status != 200) {
        alert(await respAcesso.text())
        return
    }
    const contResp = await respAcesso.json() as IEmpresa
    setEmpresa(contResp)
    if (contResp.status == 0) {
        alert('O pedido de registro já foi enviado, aguarde a autorização pela administração.')
    }
    location.href = './emitentes.html'
}

function cadastrarEmpresa() {
    const additionalBody = document.createElement('div')
    additionalBody.innerHTML = /*html*/`
    <label for="cert">Certificado</label>
    <input type="file" id="cert" name="cert" accept=".pfx" required>
    <label for="senha">Senha</label>
    <input type="text" id="senha" name="senha" required>`
    const emitView = defaultForm.generateView(defaultForm.elementosNFe[1])
    const certView = new genericFormElement(additionalBody)
    const form = new defaultForm(...emitView, certView).generateForm()
    document.body.appendChild(form)
    form.onsubmit = e => defaultFormSubmit(e, async data => {
        const opcoes = await getCertPostBody(data, v => v.emit = data.emit)
        if (!opcoes) {
            alert('Por favor, selecione o certificado e insira a senha.')
            return
        }
        const cadastroUrl = 'http://localhost:5001/nfe-facil-980bc/us-central1/cadastrarCNPJ'
        const cadastro = await fetch(cadastroUrl, opcoes)
        if (cadastro.status == 401) {
            location.href = './login.html'
            return
        } else if (cadastro.status != 200) {
            alert(await cadastro.text())
            return
        }
        const newId = await cadastro.text()
        setEmpresa({
            id: newId,
            status: 3,
            empresa: data.emit
        })
        location.href = './emitentes.html'
    })
}

function cadastrarUsuario(cnpj: string) {
    document.body.innerHTML = /*html*/`
    <form>
        <input type="hidden" name="cnpj" value="${cnpj}">
        <fieldset>
            <legend>Requisitar acesso</legend>
            <input type="submit">
        </fieldset>
    </form>
    <form>
        <input type="hidden" name="cnpj" value="${cnpj}">
        <fieldset>
            <legend>Acessar usando certificado</legend>
            <label for="cert">Certificado</label>
            <input type="file" id="cert" name="cert" accept=".pfx" required>
            <label for="senha">Senha</label>
            <input type="text" id="senha" name="senha" required>
            <input type="submit">
        </fieldset>
    </form>`
    getForm(0).onsubmit = e => defaultFormSubmit(e, data => acessar(data.cnpj))
    getForm(1).onsubmit = e => defaultFormSubmit(e, data => acessar(data.cnpj, data))
}

if (isSessaoIniciada()) {
    const emitView = defaultForm.generateView(defaultForm.elementosNFe[1])
    const form = new defaultForm(...emitView)
    const empresa = getEmpresaAtiva()
    form.updateValue(empresa.empresa)
    const htmlForm = form.generateForm(data => {
        empresa.empresa = data
        setEmpresa(empresa)
        alert('Dados cadastrais atualizados.')
        abrirPainel()
    })
    document.body.appendChild(htmlForm)
    
} else {
    // Adição de emitente
    document.body.innerHTML = /*html*/`
    <form>
        <label for="cnpj">CNPJ</label>
        <input type="text" id="cnpj" name="cnpj" value="12931158000164">
        <input type="submit">
    </form>`
    getForm().onsubmit = e => defaultFormSubmit(e, async data => {
        const scanUrl = `http://localhost:5001/nfe-facil-980bc/us-central1/scanRegistro?cnpj=${data.cnpj}`
        const scanned = await fetch(scanUrl)
        if (scanned.status == 401) {
            location.href = './login.html'
            return
        }
        if (scanned.status != 200 && scanned.status != 400) {
            alert('Erro desconhecido.')
            return
        }
        const text = await scanned.text()
        if (text == 'CNPJ inválido') {
            alert('CNPJ inválido.')
            return
        }
        if (text == 'Empresa não existe') {
            cadastrarEmpresa()
        } else if (text == 'Usuário não cadastrado') {
            cadastrarUsuario(data.cnpj)
        } else {
            // Acesso já está liberado
            location.href = './emitentes.html'
        }
    })
}
