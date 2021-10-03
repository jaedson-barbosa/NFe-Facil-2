import { IConteudo } from './arquivo'

export function filtrarCancelamentos(conteudos: IConteudo[]): ICancelamento[] {
  return conteudos
    .filter((v) => v.procEventoNFe.evento?.infEvento?.tpEvento === '110111')
    .map((v) => ({
      xml: v.xml,
      id: 'NFe' + v.procEventoNFe.evento.infEvento.chNFe
    }))
}

export interface ICancelamento {
  xml: string
  id: string
}
