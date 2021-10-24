import { Timestamp } from 'firebase/firestore'
import { get } from 'svelte/store'
import { empresa } from '../store'
import type { IIBPT } from '../tipos'

export function calcularAproximacao(
  prod: any,
  imposto: any,
  consumidorFinal: boolean,
  ibpt: IIBPT
) {
  if (consumidorFinal && ibpt) {
    const federal = ibpt.isNacional ? ibpt.nacional : ibpt.importado
    const taxa = federal + ibpt.estadual + ibpt.municipal
    const vProd = +prod.vProd || 0
    imposto.vTotTrib = (vProd * taxa) / 100
  } else delete imposto.vTotTrib
}

export async function carregarAproximacao(prod: any, isNacional: boolean) {
  const empresaCarregada = get(empresa)
  const baseUrl = 'https://apidoni.ibpt.org.br/api/v1/produtos?'
  const parametros = new URLSearchParams()
  parametros.append('token', empresaCarregada.tokenIBPT)
  parametros.append('cnpj', empresaCarregada.emit.CNPJ)
  parametros.append('codigo', prod.NCM)
  parametros.append('uf', empresaCarregada.emit.enderEmit.UF)
  parametros.append('ex', prod.EXTIPI || 0)
  parametros.append('descricao', prod.xProd)
  parametros.append('unidadeMedida', prod.uTrib)
  parametros.append('valor', prod.vUnTrib)
  parametros.append('gtin', prod.cEANTrib)
  const url = baseUrl + parametros.toString()
  try {
    const res = await fetch(url)
    const json = await res.json()
    const nacional = json.Nacional
    const importado = json.Importado
    const estadual = json.Estadual
    const municipal = json.Municipal
    const [dia, mes, ano] = json.VigenciaFim.split('/')
    const validade = Timestamp.fromDate(new Date(ano, mes - 1, dia))
    return { isNacional, nacional, importado, estadual, municipal, validade }
  } catch (error) {
    const baseMsg = 'Erro ao tentar consultar os impostos aproximados: '
    alert(baseMsg + error.message)
  }
}
