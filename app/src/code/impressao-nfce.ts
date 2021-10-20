import { FontPair, Fonts, Write } from 'bdf-fonts'
import {
  connectToPrinter,
  CutTypes,
  ImageModes,
} from 'browser-thermal-printer-encoder'

interface IConfiguracoes {
  fonte: string
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

  set fonte(value: string) {
    this.salvo.fonte = value
    this.salvar()
  }

  constructor() {
    const salvo = localStorage.getItem('configsImpressaoNFCe')
    if (salvo) {
      this.salvo = JSON.parse(salvo)
    } else {
      this.salvo = {
        corte: CutTypes.none,
        fonte: 'Terminus-18-1',
        formato: ImageModes.raster,
        inferior: 2,
        superior: 0,
        largura: 384,
        offPulso: 100,
        onPulso: 100,
        pinoPulso: -1,
      }
    }
  }

  private salvar() {
    const salvar = JSON.stringify(this.salvo)
    localStorage.setItem('configsImpressaoNFCe', salvar)
  }

  async testarDefinicoes() {
    const largura = this.largura
    const partes = this.fonte.split('-')
    const familia = partes[0]
    const tamanho = +partes[1]
    const escala = +partes[2] as 1 | 2
    const { regular, bold } = Fonts[familia][tamanho] as FontPair

    const canvas = document.createElement('canvas')
    canvas.width = largura
    canvas.height = 10000
    const context = canvas.getContext('2d')!
    const titulo = 'Lorem Ipsum'
    let y = 0
    y = Write(bold, tamanho, escala, context, titulo, 0, y, largura, 'center')
    const corpo =
      'Neque porro quisquam est qui dolorem ipsum quia dolor ' +
      'sit amet, consectetur, adipisci velit...'
    y = Write(regular, tamanho, escala, context, corpo, 0, y, largura, 'left')

    const altura = Math.ceil((y + 1) / 8) * 8
    const data = context.getImageData(0, 0, largura, altura)
    canvas.height = altura
    context.putImageData(data, 0, 0)

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
