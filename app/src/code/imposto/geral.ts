import { IIBPT } from '../tipos'
import { calcularAproximacao } from './aproximado'
import { calcularCIDE } from './CIDE'
import { atualizarICMS } from './ICMS'
import { atualizarICMSUFDest } from './ICMSUFDest'
import { atualizarIPI } from './IPI'
import { atualizarPISCOFINS } from './PISCOFINS'

export function atualizarImpostos(
  prod: any,
  imposto: any,
  consumidorFinal: boolean,
  ibpt: IIBPT,
  ufOrigem: string,
  ufDestino: string
) {
  if (!imposto) alert('HAHA')
  atualizarICMS(prod, imposto, consumidorFinal)
  if (ufDestino && ufDestino != ufOrigem) {
    atualizarICMSUFDest(
      prod,
      imposto,
      consumidorFinal,
      !ibpt.isNacional,
      ufOrigem,
      ufDestino
    )
  } else delete imposto.ICMSUFDest
  atualizarIPI(prod, imposto)
  atualizarPISCOFINS(prod, imposto)
  calcularAproximacao(prod, imposto, consumidorFinal, ibpt)
  calcularCIDE(prod)
  return imposto
}
