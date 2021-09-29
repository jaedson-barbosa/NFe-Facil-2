import { calcularAproximacao } from './aproximado'
import { calcularCIDE } from './CIDE'
import { atualizarICMS } from './ICMS'
import { atualizarIPI } from './IPI'
import { atualizarPISCOFINS } from './PISCOFINS'

export function atualizarImpostos(prod: any, imposto: any, consumidorFinal: boolean, ibpt: any) {
  atualizarICMS(prod, imposto, consumidorFinal)
  atualizarIPI(prod, imposto)
  atualizarPISCOFINS(prod, imposto)
  calcularAproximacao(prod, imposto, consumidorFinal, ibpt)
  calcularCIDE(prod)
  return imposto
}