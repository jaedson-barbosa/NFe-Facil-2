import { renderizarEmitente, getEmpresas, setEmpresas, IEmpresa } from './dados/emitentes'

sessionStorage.clear()

function atualizarEmpresas(empresas?: IEmpresa[]) {
    if (!empresas) empresas = getEmpresas()
    const divEmpresas = document.getElementById('emitentes')
    empresas.forEach(v => {
        const button = renderizarEmitente(v)
        divEmpresas.appendChild(button)
    })
}

atualizarEmpresas()
document.getElementById('atualizar').onclick = async () => {
    const respEmpresas = await fetch('http://localhost:5001/nfe-facil-980bc/us-central1/scanUsuario')
    if (respEmpresas.status == 401) {
        location.href = './login.html'
        return
    } else if (respEmpresas.status != 200) {
        alert(await respEmpresas.text())
        return
    }
    const empresas = await respEmpresas.json()
    setEmpresas(empresas)
    atualizarEmpresas(empresas)
}
