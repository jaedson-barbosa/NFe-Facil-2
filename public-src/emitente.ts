import { defaultFormSubmit, initializeForm } from './form-base'

function getForm(index: number = 0) { return document.getElementsByTagName('form')[index] }

const idEmitente = sessionStorage.getItem('idEmitente')
if (idEmitente) {
    alert('Edição de emitente!')
} else {
    // Adição de emitente
    document.body.innerHTML = `
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
            document.body.innerHTML = '<form></form>'
            const mainForm = getForm()
            initializeForm(
                'emitente', mainForm,
                [{ name: 'fone', header: 'Telefone' }],
                (v) => console.log(v))
            await fetch('http://localhost:5001/nfe-facil-980bc/us-central1/cadastrarCNPJ', {
                method: 'POST',
                body: JSON.stringify({ cnpj: data.cnpj, cert: btoa(String.fromCharCode(...new Uint8Array(await data.cert.arrayBuffer()))) })
            })
        } else if (text == 'Usuário não cadastrado') {
            // Requisitar o acesso aqui
            document.body.innerHTML = `
            <form>
                <input type="hidden" name="cnpj" value="12931158000164">
                <fieldset>
                    <legend>Requisitar acesso</legend>
                    <input type="submit" value="Requisitar acesso" name="subType">
                </fieldset>
            </form>
            <form>
                <input type="hidden" name="cnpj" value="12931158000164">
                <fieldset>
                    <legend>Acessar usando certificado</legend>
                    <label for="cert">Certificado</label>
                    <input type="file" id="cert" name="cert" accept=".pfx" required>
                    <label for="senha">Senha</label>
                    <input type="text" id="senha" name="senha" required>
                    <input type="submit" value="Acessar usando certificado" name="subType">
                </fieldset>
            </form>`
            async function acessar(cnpj: string, cert?: { arquivo: File, senha: string }) {
                const opcoes = cert ? {
                    method: 'POST',
                    body: JSON.stringify({
                        cert: btoa(String.fromCharCode(...new Uint8Array(await cert.arquivo.arrayBuffer()))),
                        senha: cert.senha
                    })
                } : {}
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
                location.href = './emitentes.html'
            }
            getForm(0).onsubmit = e => defaultFormSubmit(e, data => acessar(data.cnpj))
            getForm(1).onsubmit = e => defaultFormSubmit(e, data => acessar(data.cnpj, {
                arquivo: data.cert,
                senha: data.senha
            }))
        } else {
            // Acesso já está liberado
            location.href = './emitentes.html'
        }
    })
}
