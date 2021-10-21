import { FontPair, Fonts } from 'bdf-fonts'
import {
  CutTypes,
  ImageModes,
} from 'browser-thermal-printer-encoder'
import { Metodo } from './pixelizacao'

export interface IConfiguracoes {
  fonte: string
  largura: number
  formato: ImageModes
  superior: number
  inferior: number
  corte: CutTypes
  pinoPulso: -1 | 0 | 1
  onPulso: number
  offPulso: number
  tamanhoQR: Tamanho
  tamanhoLogo: Tamanho
  pixelizacao: Metodo
}

export enum Tamanho {
  P = 0.4,
  M = 0.6,
  G = 0.8,
}

export function processarFonte(fonte: string) {
  const partes = fonte.split('-')
  const familia = partes[0]
  const tamanhoFonte = +partes[1]
  const parFontes = Fonts[familia][tamanhoFonte] as FontPair
  const escala = +partes[2] as 1 | 2
  return { parFontes, tamanhoFonte, escala }
}

export function getConfiguracoes(): IConfiguracoes {
  const salvo = localStorage.getItem('configsImpressaoNFCe')
  if (salvo) {
    return JSON.parse(salvo)
  } else {
    return {
      corte: CutTypes.none,
      fonte: 'Terminus-18-1',
      formato: ImageModes.raster,
      inferior: 2,
      superior: 0,
      largura: 384,
      offPulso: 100,
      onPulso: 100,
      pinoPulso: -1,
      tamanhoQR: Tamanho.P,
      tamanhoLogo: Tamanho.P,
      pixelizacao: Metodo.threshold,
    }
  }
}
