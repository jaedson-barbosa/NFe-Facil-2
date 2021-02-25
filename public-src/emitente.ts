import { defaultFormSubmit, initializeForm } from './form-base'

function getForm() { return document.getElementsByTagName('form')[0] }

const idEmitente = sessionStorage.getItem('idEmitente')
if (idEmitente) {
    alert('Edição de emitente!')
} else {
    //Fazer funcionar
    document.body.innerHTML = `
    <form method="POST" action='http://localhost:5001/nfe-facil-980bc/us-central1/requisitarAcesso'>
        <input type="hidden" name="cnpj" value="12931158000164">
        <input type="submit" value="sem certificado" name="subType">
        <label for="cert">Certificado</label>
        <input type="file" id="cert" name="cert">
        <input type="submit" value="com certificado" name="subType">
    </form>`
    /*// Adição de emitente
    document.body.innerHTML = `
    <form>
        <label for="cnpj">CNPJ</label>
        <input type="text" id="cnpj" name="cnpj" value="12931158000164">
        <input type="submit">
    </form>`
    getForm().onsubmit = e => defaultFormSubmit(e, async data => {
        const scanned = await fetch(`http://localhost:5001/nfe-facil-980bc/us-central1/scanCNPJ?cnpj=${data.cnpj}`)
        if (scanned.status == 401)
            location.href = './login.html'
        else if (scanned.status == 400)
            alert('CNPJ inválido.')
        else if (scanned.status != 200)
            alert('Erro desconhecido.')
        else {
            const text = await scanned.text()
            if (text == 'Empresa não existe') {
                // Nesse caso vamos cadastrar a empresa
                document.body.innerHTML = '<form></form>'
                const mainForm = getForm()
                initializeForm(
                    'emitente', mainForm,
                    [{ name: 'fone', header: 'Telefone' }],
                    (v) => console.log(v))
            } else if (text == 'Usuário não cadastrado') {
                // Requisitar o acesso aqui
                document.body.innerHTML = `
                <form>
                    <label for="cert">Certificado</label>
                    <input type="file" id="cert" name="cert">
                    <input type="submit">
                </form>`
                getForm().onsubmit = (e) => {
                    console.log(this)
                    console.log(e)
                }
            } else {
                // Acesso já está liberado
                location.href = './emitentes.html'
            }
        }
        await fetch('http://localhost:5001/nfe-facil-980bc/us-central1/cadastrarCNPJ', {
            method: 'POST',
            body: JSON.stringify({ cnpj: data.cnpj, cert: btoa(String.fromCharCode(...new Uint8Array(await data.cert.arrayBuffer()))) })
        })
    })
    */
}
