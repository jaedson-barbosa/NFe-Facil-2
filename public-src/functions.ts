import { IEmpresa } from './dados/emitentes'
import { getIdEmpresaAtiva } from './sessao'
import { IResultadoImportacao, IResultadoSincronizacao } from '../commom'

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
      body: JSON.stringify(cert ? { ...cert, cnpj } : { cnpj }),
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
  return (await resp.json()) as IEmpresa
}

export async function cadastrarCNPJ(body: {
  emit: any
  cert: string
  senha: any
}): Promise<string> {
  const resp = await fetch(
    'http://localhost:5001/nfe-facil-980bc/us-central1/cadastrarCNPJ',
    {
      method: 'POST',
      body: JSON.stringify(body),
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

export async function scanRegistro(cnpj: string): Promise<string> {
  const resp = await fetch(
    'http://localhost:5001/nfe-facil-980bc/us-central1/scanRegistro',
    {
      method: 'POST',
      body: JSON.stringify({ cnpj }),
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

export async function scanUsuario(): Promise<IEmpresa[]> {
  const resp = await fetch(
    'http://localhost:5001/nfe-facil-980bc/us-central1/scanUsuario'
  )
  if (resp.status == 401) {
    location.href = './login.html'
    return
  } else if (resp.status != 200) {
    alert(await resp.text())
    return
  }
  return (await resp.json()) as IEmpresa[]
}

export async function importar(xmls: string[]) {
  const idEmpresa = getIdEmpresaAtiva()
  const resp = await fetch(
    'http://localhost:5001/nfe-facil-980bc/us-central1/importar',
    {
      method: 'POST',
      body: JSON.stringify({ id: idEmpresa, xmls }),
    }
  )
  const respText = await resp.text()
  return JSON.parse(respText, (k, v) =>
    k == 'lastUpdate' ? new Date(v) : v
  ) as IResultadoImportacao<Date>
}

export async function getJsonNota(idNota: string) {
  const resp = await fetch(
    'http://localhost:5001/nfe-facil-980bc/us-central1/getJsonNota',
    {
      method: 'POST',
      body: JSON.stringify({ id: getIdEmpresaAtiva(), idNota }),
    }
  )
  if (resp.status == 401) {
    location.href = './login.html'
    return
  } else if (resp.status != 200) {
    alert(await resp.text())
    return
  }
  return (await resp.json()) as { infNFe: any }
}

export async function apenasSalvarNota(nota: { infNFe: any }, idNota?: string) {
  const resp = await fetch(
    'http://localhost:5001/nfe-facil-980bc/us-central1/apenasSalvarNota',
    {
      method: 'POST',
      body: JSON.stringify({
        id: getIdEmpresaAtiva(),
        infNFe: nota.infNFe,
        idNota: idNota ?? '',
      }),
    }
  )
  if (resp.status == 401) {
    location.href = './login.html'
    return false
  } else if (resp.status != 201) {
    alert(await resp.text())
    return false
  }
  return true
}

export async function assinarTransmitirNota(
  nota: { infNFe: any },
  idNota?: string
) {
  const resp = await fetch(
    'http://localhost:5001/nfe-facil-980bc/us-central1/assinarTransmitirNota',
    {
      method: 'POST',
      body: JSON.stringify({
        id: getIdEmpresaAtiva(),
        infNFe: nota.infNFe,
        idNota: idNota ?? '',
      }),
    }
  )
  if (resp.status == 401) {
    location.href = './login.html'
    return false
  } else if (resp.status != 201) {
    alert(await resp.text())
    return false
  }
  console.log(await resp.text())
  return true
}

export async function sincronizar() {
  const lastUpdate = localStorage.getItem('lastUpdate')
  const resp = await fetch(
    'http://localhost:5001/nfe-facil-980bc/us-central1/sincronizar',
    {
      method: 'POST',
      body: JSON.stringify({
        id: getIdEmpresaAtiva(),
        ...(lastUpdate ? { lastUpdate: Number(lastUpdate) } : {}),
      }),
    }
  )
  if (resp.status == 401) {
    location.href = './login.html'
    return
  } else if (resp.status != 200) {
    alert(await resp.text())
    return
  }
  const resultado = (await resp.json()) as IResultadoSincronizacao<number>
  localStorage.setItem('lastUpdate', resultado.now.toString())
  return resultado
}

export async function getXML(idNota: string) {
  const resp = await fetch(
    'http://localhost:5001/nfe-facil-980bc/us-central1/getXML',
    {
      method: 'POST',
      body: JSON.stringify({ id: getIdEmpresaAtiva(), idNota }),
    }
  )
  if (resp.status == 401) {
    location.href = './login.html'
    return
  } else if (resp.status != 200) {
    alert(await resp.text())
    return
  }
  return (await resp.json()) as { chave: string; xml: string }
}
