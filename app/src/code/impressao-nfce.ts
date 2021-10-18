import { Fonts, Writer } from 'bdf-fonts'
import {
  connectToPrinter,
  CutTypes,
  ImageModes,
} from 'browser-thermal-printer-encoder'

interface IConfiguracoes {
  fonte: { familia: keyof typeof Fonts; tamanho: number }
  aumentada: boolean
  largura: number
  formato: ImageModes
  superior: number
  inferior: number
  corte: CutTypes
  pinoPulso: -1 | 0 | 1
  onPulso: number
  offPulso: number
}

export class Impressao implements IConfiguracoes {
  private salvo: IConfiguracoes

  get aumentada() {
    return this.salvo.aumentada
  }

  set aumentada(value: boolean) {
    this.salvo.aumentada = value
    this.salvar()
  }

  get largura() {
    return this.salvo.largura
  }

  set largura(value: number) {
    this.salvo.largura = value
    this.salvar()
  }

  get formato() {
    return this.salvo.formato
  }

  set formato(value: ImageModes) {
    this.salvo.formato = value
    this.salvar()
  }

  get superior() {
    return this.salvo.superior
  }

  set superior(value: number) {
    this.salvo.superior = value
    this.salvar()
  }

  get inferior() {
    return this.salvo.inferior
  }

  set inferior(value: number) {
    this.salvo.inferior = value
    this.salvar()
  }

  get corte() {
    return this.salvo.corte
  }

  set corte(value: CutTypes) {
    this.salvo.corte = value
    this.salvar()
  }

  get pinoPulso() {
    return this.salvo.pinoPulso
  }

  set pinoPulso(value: -1 | 0 | 1) {
    this.salvo.pinoPulso = value
    this.salvar()
  }

  get onPulso() {
    return this.salvo.onPulso
  }

  set onPulso(value: number) {
    this.salvo.onPulso = value
    this.salvar()
  }

  get offPulso() {
    return this.salvo.offPulso
  }

  set offPulso(value: number) {
    this.salvo.offPulso = value
    this.salvar()
  }

  get fonte() {
    return this.salvo.fonte
  }

  set fonte(value: { familia: keyof typeof Fonts; tamanho: number }) {
    this.salvo.fonte = value
    this.salvar()
  }

  constructor() {
    const salvo = localStorage.getItem('configsImpressaoNFCe')
    if (salvo) {
      this.salvo = JSON.parse(salvo)
    } else {
      this.salvo = {
        aumentada: false,
        corte: CutTypes.none,
        fonte: { familia: 'Terminus', tamanho: 18 },
        formato: ImageModes.raster,
        inferior: 2,
        superior: 0,
        largura: 384,
        offPulso: 50,
        onPulso: 50,
        pinoPulso: -1,
      }
    }
  }

  private salvar() {
    const salvar = JSON.stringify(this.salvo)
    localStorage.setItem('configsImpressaoNFCe', salvar)
  }

  async testarDefinicoes() {
    const { familia, tamanho } = this.fonte
    const fontes = Fonts[familia]
    const regular = fontes.find((v) => v.size === tamanho && !v.bold)
    const negrito = fontes.find((v) => v.size === tamanho && v.bold)

    const canvas = document.createElement('canvas')
    canvas.width = this.largura
    canvas.height = 10000
    const context = canvas.getContext('2d')!
    const escala = this.aumentada ? 2 : 1
    const escritor = new Writer(context, negrito.data, tamanho, escala)
    const y = escritor.writeText('Lorem Ipsum', 0, 0, this.largura, 'center')
    escritor.bdf = regular.data
    const corpo =
      'Neque porro quisquam est qui dolorem ipsum quia dolor ' +
      'sit amet, consectetur, adipisci velit...'
    escritor.writeText(corpo, 0, y, this.largura, 'left')

    const printCanvas = await connectToPrinter()
    await printCanvas({
      canvas,
      imageMode: this.formato,
      paddingTop: this.superior,
      paddingBottom: this.inferior,
      cut: this.corte,
      pulse:
        this.pinoPulso === -1
          ? undefined
          : {
              devicePin: this.pinoPulso,
              on: this.onPulso,
              off: this.offPulso,
            },
    })
    alert('Tarefa de impressão de testes enviada')
  }
}
