import { Write } from 'bdf-fonts'
import { CutTypes, ImageModes } from 'browser-thermal-printer-encoder'
import {
  getConfiguracoes,
  IConfiguracoes,
  processarFonte,
  Tamanho,
} from './configuracao'
import { imprimirCanvas } from './impressao'

export class Configuracoes implements IConfiguracoes {
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

  get tamanhoQR() {
    return this.salvo.tamanhoQR
  }

  set tamanhoQR(value: Tamanho) {
    this.salvo.tamanhoQR = value
    this.salvar()
  }

  constructor() {
    this.salvo = getConfiguracoes()
  }

  private salvar() {
    const salvar = JSON.stringify(this.salvo)
    localStorage.setItem('configsImpressaoNFCe', salvar)
  }

  async testarDefinicoes() {
    const canvas = document.createElement('canvas')
    canvas.width = this.largura
    canvas.height = 10000
    const context = canvas.getContext('2d')!
    let y = 0
    const fonte = processarFonte(this.fonte)
    y = Write(
      fonte.parFontes.bold,
      fonte.tamanhoFonte,
      fonte.escala,
      context,
      'Lorem Ipsum',
      0,
      y,
      this.largura,
      'center'
    )
    y = Write(
      fonte.parFontes.regular,
      fonte.tamanhoFonte,
      fonte.escala,
      context,
      'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, ' +
        'consectetur, adipisci velit...',
      0,
      y,
      this.largura,
      'left'
    )
    const altura = Math.ceil((y + 1) / 8) * 8
    const data = context.getImageData(0, 0, this.largura, altura)
    canvas.height = altura
    context.putImageData(data, 0, 0)

    await imprimirCanvas(canvas)
    alert('Tarefa de impressão de testes enviada')
  }
}
