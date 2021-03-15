import { defaultFormSubmit, getForm, defaultForm, genericFormElement } from './form-base'

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
    }
    return {}
}

const idEmitente = sessionStorage.getItem('idEmitente')
if (idEmitente) {
    alert('Edição de emitente!')
} else {
    // Adição de emitente
    document.body.innerHTML = /*html*/`
    <form>
        <label for="cnpj">CNPJ</label>
        <input type="text" id="cnpj" name="cnpj" value="12931158000164">
        <input type="submit">
    </form>`
    getForm().onsubmit = e => defaultFormSubmit(e, async data => {
        const scanned = await fetch(`http://localhost:5001/nfe-facil-980bc/us-central1/scanCNPJ?cnpj=${data.cnpj}`)
        if (scanned.status == 401) {
            location.href = './login.html'
            return
        } else if (scanned.status == 400) {
            alert('CNPJ inválido.')
            return
        } else if (scanned.status != 200) {
            alert('Erro desconhecido.')
            return
        }
        const text = await scanned.text()
        if (text == 'Empresa não existe') {
            // Nesse caso vamos cadastrar a empresa
            const additionalBody = document.createElement('div')
            additionalBody.innerHTML = /*html*/`
            <label for="cert">Certificado</label>
            <input type="file" id="cert" name="cert" accept=".pfx" required>
            <label for="senha">Senha</label>
            <input type="text" id="senha" name="senha" required>`
            const form = new defaultForm()
            const emitElement = defaultForm.elementosNFe[1]
            const emitView = defaultForm.generateView(emitElement, [])
            form.elements.push(
                ...emitView,
                new genericFormElement(additionalBody))
            const htmlForm = form.generateForm()
            document.body.appendChild(htmlForm)
            htmlForm.onsubmit = e => defaultFormSubmit(e, async data => {
                const opcoes = await getCertPostBody(data, v => v.emit = data.emit)
                if (!opcoes) {
                    alert('Por favor, selecione o certificado e insira a senha.')
                    return
                }
                const cadastro = await fetch('http://localhost:5001/nfe-facil-980bc/us-central1/cadastrarCNPJ', opcoes)
                if (cadastro.status == 401) {
                    location.href = './login.html'
                    return
                } else if (cadastro.status != 200) {
                    alert(await cadastro.text())
                    return
                }
                const newId = await cadastro.text()
                const empresasString = localStorage.getItem('empresas')
                const empresas = empresasString ? JSON.parse(empresasString) as any[] : []
                empresas.push({
                    id: newId,
                    status: 3,
                    empresa: data.emit
                })
                localStorage.setItem('empresas', JSON.stringify(empresas))
                location.href = './emitentes.html'
            })
        } else if (text == 'Usuário não cadastrado') {
            // Requisitar o acesso aqui
            document.body.innerHTML = /*html*/`
            <form>
                <input type="hidden" name="cnpj" value="${data.cnpj}">
                <fieldset>
                    <legend>Requisitar acesso</legend>
                    <input type="submit">
                </fieldset>
            </form>
            <form>
                <input type="hidden" name="cnpj" value="${data.cnpj}">
                <fieldset>
                    <legend>Acessar usando certificado</legend>
                    <label for="cert">Certificado</label>
                    <input type="file" id="cert" name="cert" accept=".pfx" required>
                    <label for="senha">Senha</label>
                    <input type="text" id="senha" name="senha" required>
                    <input type="submit">
                </fieldset>
            </form>`
            async function acessar(cnpj: string, data?: any) {
                const opcoes = await getCertPostBody(data)
                const url = `http://localhost:5001/nfe-facil-980bc/us-central1/requisitarAcesso?cnpj=${cnpj}`
                const respAcesso = await fetch(url, opcoes)
                if (respAcesso.status == 401) {
                    location.href = './login.html'
                    return
                }
                if (respAcesso.status != 200) {
                    alert(await respAcesso.text())
                    return
                }
                const contResp = await respAcesso.json() as {
                    idEmpresa: String,
                    status: 'Pedido registrado' | 'Administrador registrado' | 'Usuário promovido para administrador',
                    empresa: any
                }
                const empresasString = localStorage.getItem('empresas')
                const empresas = empresasString ? JSON.parse(empresasString) as any[] : []
                const cadastroAtual = empresas.find(v => v.id == contResp.idEmpresa)
                if (contResp.status == 'Pedido registrado') {
                    if (!cadastroAtual) {
                        empresas.push({
                            id: contResp.idEmpresa,
                            status: 0,
                            empresa: contResp.empresa
                        })
                        localStorage.setItem('empresas', JSON.stringify(empresas))
                    }
                    alert('O pedido de registro já foi enviado, aguarde a autorização pela administração.')
                } else {
                    if (cadastroAtual) {
                        empresas.splice(empresas.findIndex(v => v.id == contResp.idEmpresa), 1)
                        empresas.push({
                            id: contResp.idEmpresa,
                            status: 3,
                            empresa: contResp.empresa 
                        })
                        localStorage.setItem('empresas', JSON.stringify(empresas))
                    }
                }
                location.href = './emitentes.html'
            }
            getForm(0).onsubmit = e => defaultFormSubmit(e, data => acessar(data.cnpj))
            getForm(1).onsubmit = e => defaultFormSubmit(e, data => acessar(data.cnpj, data))
        } else {
            // Acesso já está liberado
            location.href = './emitentes.html'
        }
    })
}
