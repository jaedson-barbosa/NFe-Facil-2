import { iniciarSessao } from "../sessao"

export interface IEmpresa {
    id: string,
    status: 0 | 1 | 2 | 3,
    empresa: any
}

export function getEmpresa(id: string): IEmpresa {
    return getEmpresas().find(v => v.id === id)
}

export function getEmpresas(): IEmpresa[] {
    const empresasString = localStorage.getItem('empresas')
    return empresasString ? JSON.parse(empresasString) : []
}

export function setEmpresa(empresa: IEmpresa) {
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

function getDescricaoStatus(status: 0 | 1 | 2 | 3) {
    switch (status) {
        case 0: return 'Aguardando liberação pela administração.'
        case 1: return 'Acesso bloqueado pela administração'
        case 2: return 'Acesso liberado como usuário comum'
        case 3: return 'Acesso liberado como administrador'
    }
}

export function renderizarEmitente(data: IEmpresa): HTMLButtonElement {
    const button = document.createElement('button')
    button.innerHTML = /*html*/`
    <div>
        ${data.empresa.xFant ?? data.empresa.xNome}<br>
        <i>${getDescricaoStatus(data.status)}</i>
    </div>`
    button.onclick = () => iniciarSessao(data.id)
    return button
}
