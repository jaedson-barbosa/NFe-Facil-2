import { IEmpresa } from './dados/emitentes'

export async function requisitarAcesso(
    cnpj: string,
    cert: {
        cert: string
        senha: any
    }
): Promise<IEmpresa> {
    const resp = await fetch(
        'http://localhost:5001/nfe-facil-980bc/us-central1/requisitarAcesso',
        {
            method: 'POST',
            body: JSON.stringify(cert ? { ...cert, cnpj } : { cnpj })
        }
    )
    if (resp.status == 401) {
        location.href = './login.html'
        return
    }
    if (resp.status != 200) {
        alert(await resp.text())
        return
    }
    return await resp.json() as IEmpresa
}

export async function cadastrarCNPJ(
    body: {
        emit: any
        cert: string
        senha: any
    }
): Promise<string> {
    const resp = await fetch(
        'http://localhost:5001/nfe-facil-980bc/us-central1/cadastrarCNPJ',
        {
            method: 'POST',
            body: JSON.stringify(body)
        }
    )
    if (resp.status == 401) {
        location.href = './login.html'
        return
    } else if (resp.status != 200) {
        alert(await resp.text())
        return
    }
    return await resp.text()
}

export async function scanRegistro(
    cnpj: string
): Promise<string> {
    const resp = await fetch(
        'http://localhost:5001/nfe-facil-980bc/us-central1/scanRegistro',
        {
            method: 'POST',
            body: JSON.stringify({ cnpj })
        }
    )
    if (resp.status == 401) {
        location.href = './login.html'
        return
    }
    if (resp.status != 200 && resp.status != 400) {
        alert('Erro desconhecido.')
        return
    }
    return await resp.text()
}