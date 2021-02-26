sessionStorage.clear()

function atualizarEmpresas(empresas?: any[]) {
    function getDescricaoStatus(status: 0 | 1 | 2 | 3) {
        switch (status) {
            case 0: return 'Aguardando liberação pela administração.'
            case 1: return 'Acesso bloqueado pela administração'
            case 2: return 'Acesso liberado como usuário comum'
            case 3: return 'Acesso liberado como administrador'
        }
    }

    if (!empresas) {
        const empresasString = localStorage.getItem('empresas')
        empresas = empresasString ? JSON.parse(empresasString) as any[] : []
    }
    const divEmpresas = document.getElementById('emitentes')
    empresas.forEach(v => {
        const button = document.createElement('button')
        button.innerHTML = /*html*/`
        <div>
        ${v.empresa.xFant ?? v.empresa.xNome}
        <i>${getDescricaoStatus(v.status)}</i>
        </div>`
        button.onclick = () => {
            sessionStorage.setItem('idEmpresa', v.id)
            location.href = './painel.html'
        }
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
    localStorage.setItem('empresas', JSON.stringify(empresas))
    atualizarEmpresas(empresas)
}
