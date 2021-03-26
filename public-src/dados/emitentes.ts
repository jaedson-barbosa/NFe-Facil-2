export interface IEmpresa {
    id: string,
    status: 0 | 1 | 2 | 3,
    empresa: any
}

function getDescricaoStatus(status: 0 | 1 | 2 | 3) {
    switch (status) {
        case 0: return 'Aguardando liberação pela administração.'
        case 1: return 'Acesso bloqueado pela administração'
        case 2: return 'Acesso liberado como usuário comum'
        case 3: return 'Acesso liberado como administrador'
    }
}

export function getEmpresaAtiva() {
    const id = sessionStorage.idEmpresa
    if (!id) {
        alert('Por favor, inicie a sessão a partir da tela de escolha de emitentes.')
        location.href = './emitentes.html'
    }
    return getEmpresa(id)
}

function getEmpresa(id: string) {
    return getEmpresas().find(v => v.id === id)
}

export function getEmpresas(): IEmpresa[] {
    const empresasString = localStorage.getItem('empresas')
    return empresasString ? JSON.parse(empresasString) : []
}

export function addEmpresa(empresa: IEmpresa) {
    const empresas = getEmpresas()
    const cadastroAtual = empresas.find(v => v.id == empresa.id)
    if (cadastroAtual) {
        empresas.splice(empresas.indexOf(cadastroAtual), 1, empresa)
    } else empresas.push(empresa)
    setEmpresas(empresas)
}

export function setEmpresas(empresas: IEmpresa[]) {
    localStorage.setItem('empresas', JSON.stringify(empresas))
}

export function renderizarEmitente(data: IEmpresa): HTMLButtonElement {
    const button = document.createElement('button')
    button.innerHTML = /*html*/`
    <div>
    ${data.empresa.xFant ?? data.empresa.xNome}
    <i>${getDescricaoStatus(data.status)}</i>
    </div>`
    button.onclick = () => {
        sessionStorage.setItem('idEmpresa', data.id)
        location.href = './painel.html'
    }
    return button
}
