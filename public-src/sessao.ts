import { getEmpresa } from './dados/emitentes'

export function iniciarSessao(id: string) {
    sessionStorage.setItem('idEmpresa', id)
    location.href = './painel.html'
}

export function getIdEmpresaAtiva(): string {
    const id = sessionStorage.idEmpresa
    if (!id) {
        alert('Por favor, inicie a sessão a partir da tela de escolha de emitentes.')
        location.href = './emitentes.html'
        throw new Error('Necessário iniciar sessão.')
    }
    return id
}

/** Retorna o ambiente atual: 1=Produção; 2=Homologação. */
export function getAmbiente(): '1' | '2' {
    return '1'
}

export function versaoEmissor() {
    return '0.0.1'
}

export function getEmpresaAtiva() {
    const id = getIdEmpresaAtiva()
    return getEmpresa(id)
}