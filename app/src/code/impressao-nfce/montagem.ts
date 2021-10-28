import * as parser from 'xml2json-light-es6module'
import { Write } from 'bdf-fonts'
import { makeQR, QRErrorCorrectLevel } from 'minimal-qr-code'
import { getConfiguracoes, processarFonte } from './configuracao'
import { preparateJSON } from '../nfe/finalizacao'
import { getInteiroStr } from '../numero'

type Align = 'left' | 'center' | 'right'

export function montar(
  canvas: HTMLCanvasElement,
  xml: string,
  cancelada: boolean,
  logotipo: ImageData | undefined = undefined
) {
  const json = parser.xml2json(xml)
  const nfeProc = json.nfeProc
  const NFe = nfeProc?.NFe ?? json.NFe
  const infNFe = preparateJSON(NFe.infNFe)
  console.log(infNFe)
  const infNFeSupl = NFe.infNFeSupl
  const infProt = nfeProc?.protNFe?.infProt

  const configuracoes = getConfiguracoes()
  const { largura, tamanhoQR } = configuracoes
  const fonte = processarFonte(configuracoes.fonte)

  let posicao = 0

  canvas.width = largura
  canvas.height = 10000
  const context = canvas.getContext('2d')!

  function espaco() {
    posicao += fonte.tamanhoFonte * fonte.escala
  }

  function escreverApenas(
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    alinhamento: Align,
    negrito: boolean
  ) {
    return Write(
      negrito ? fonte.parFontes.bold : fonte.parFontes.regular,
      fonte.tamanhoFonte,
      fonte.escala,
      context,
      text,
      x,
      y,
      maxWidth,
      alinhamento
    )
  }

  function escrever(texto: string, alin: Align, negrito: boolean = false) {
    posicao = escreverApenas(texto, 0, posicao, largura, alin, negrito)
  }

  function escritaDupla(
    esquerda: string,
    direita: string,
    proporcao: number = 0.6,
    esquerdaNegrido: boolean = false,
    direitaNegrito: boolean = false
  ) {
    const larguraE = Math.floor(largura * proporcao)
    const larguraD = largura - larguraE
    const novaPosicaoE = escreverApenas(
      esquerda,
      0,
      posicao,
      larguraE,
      'left',
      esquerdaNegrido
    )
    const novaPosicaoD = escreverApenas(
      direita,
      larguraE,
      posicao,
      larguraD,
      'right',
      direitaNegrito
    )
    posicao = novaPosicaoD > novaPosicaoE ? novaPosicaoD : novaPosicaoE
  }

  {
    // logotipo
    if (logotipo) {
      const paddingH = Math.floor((largura - logotipo.width) / 2)
      context.putImageData(logotipo, paddingH, 0)
      posicao += logotipo.height
    }
    espaco()
  }

  {
    // parteI
    const emit = infNFe.emit
    escrever(emit.xNome, 'center', true)
    escrever('CNPJ: ' + emit.CNPJ, 'center')
    const end = emit.enderEmit
    const endereco = [end.xLgr, end.nro, end.xBairro, end.xMun, end.UF]
    escrever(endereco.join(', '), 'center')
    espaco()
    const tipo = 'Documento Auxiliar da Nota Fiscal de Consumidor Eletrônica'
    escrever(tipo, 'center', true)
    espaco()
  }

  {
    // parteII
    const larguras = [0.1, 0.1, 0.15, 0.15, 0.15]
      .map((v) => largura * v)
      .map(Math.round)
    const restante = largura - larguras.reduce((p, v) => p + v, 0)
    larguras.splice(1, 0, restante)
    const alinhamentos: Align[] = [
      'left',
      'left',
      'right',
      'left',
      'right',
      'right',
    ]
    const data = [
      ['Cód', 'Descrição', 'Qtde', 'Un med', 'Vl un', 'Total'],
      ...infNFe.det.map(({ prod }) => [
        prod.cProd,
        prod.xProd,
        getNumeroStr(+prod.qCom, true),
        prod.uCom,
        getNumeroStr(+prod.vUnCom),
        getNumeroStr(+prod.vProd),
      ]),
    ]
    let y = posicao
    let negrito = true
    for (const linha of data) {
      let x = 0
      const yAtual = y
      for (let i = 0; i < linha.length; i++) {
        const novoY = escreverApenas(
          linha[i],
          x,
          yAtual,
          larguras[i],
          alinhamentos[i],
          negrito
        )
        if (novoY > y) y = novoY
        x += larguras[i]
      }
      negrito = false
    }
    posicao = y
  }

  {
    // parteIII
    escrever('Totais', 'center', true)
    escritaDupla('Qtde. total de itens', infNFe.det.length.toString())
    const ICMSTot = infNFe.total.ICMSTot
    const vFrete = +ICMSTot.vFrete
    const vSeg = +ICMSTot.vSeg
    const vOutro = +ICMSTot.vOutro
    const vProd = +ICMSTot.vProd
    const vDesc = +ICMSTot.vDesc
    const vNF = +ICMSTot.vNF
    escritaDupla('Valor total', getMoeda(vProd))
    if (vFrete) escritaDupla('Frete total', getMoeda(vFrete))
    if (vSeg) escritaDupla('Seguro total', getMoeda(vSeg))
    if (vOutro) escritaDupla('Outras despesas', getMoeda(vOutro))
    if (vDesc) escritaDupla('Desconto total', '- ' + getMoeda(vDesc))
    escritaDupla('Valor a pagar', getMoeda(vNF))
    escritaDupla('Forma de pagamento', 'Valor pago', 0.6, true, true)
    const pag = infNFe.pag
    pag.detPag.forEach((v: any) =>
      escritaDupla(
        formasPagamento[v.tPag] ?? 'Não identificado',
        getMoeda(v.vPag)
      )
    )
    escritaDupla('Valor do troco', getMoeda(pag.vTroco || 0))
    espaco()
  }

  if (infNFeSupl) {
    // parteIV
    escrever('Consulte pela chave de acesso em', 'center', true)
    escrever(infNFeSupl.urlChave, 'center')
    const chave = infNFe.Id.substr(3).match(/.{4}/g)!.join(' ')
    escrever(chave, 'center')
    espaco()
  }

  {
    // parteVI
    const dest = infNFe.dest
    escrever('Consumidor', 'center', true)
    if (dest) {
      if (dest.xNome) escrever(dest.xNome, 'center')
      if (dest.CPF) {
        escrever('CPF: ' + dest.CPF, 'center')
      } else if (dest.CNPJ) {
        escrever('CNPJ: ' + dest.CNPJ, 'center')
      } else if (dest.idEstrangeiro) {
        escrever('Id. estrangeiro: ' + dest.idEstrangeiro, 'center')
      }
      const end = dest.enderDest
      const endereco = [end.xLgr, end.nro, end.xBairro, end.xMun, end.UF]
      escrever(endereco.join(', '), 'center')
    } else {
      escrever('CONSUMIDOR NÃO IDENTIFICADO', 'center')
    }
    espaco()
  }

  if (infProt) {
    // parteVII
    const nNF = getInteiroStr(+infNFe.ide.nNF, 9)
    const serie = getInteiroStr(+infNFe.ide.serie, 3)
    const dhEmi = getData(infNFe.ide.dhEmi)
    escrever('Identificação e autorização', 'center', true)
    escritaDupla('Número:', nNF, 0.5)
    escritaDupla('Série:', serie, 0.5)
    escritaDupla('Data de emissão:', dhEmi, 0.5)
    const nProt = infProt.nProt
    const dhRecbto = getData(infProt.dhRecbto)
    escritaDupla('Protocolo de autorização:', nProt, 0.5)
    escritaDupla('Data de autorização:', dhRecbto, 0.5)
  }

  if (infNFeSupl) {
    // parteV
    const url = infNFeSupl.qrCode

    var { size: qrsize, isDark } = makeQR(url, 8, QRErrorCorrectLevel.M)
    // QR com mínimo de 23mm em papel de 58mm (1mm de margem de segurança)
    const dotsize = Math.floor((largura * tamanhoQR) / qrsize)
    // Mínimo de 10% de margem segura
    const paddingV = Math.ceil((dotsize * qrsize) / 10)
    // Centralizar QR
    const paddingH = Math.floor((largura - dotsize * qrsize) / 2)

    for (var r = 0; r < qrsize; r++) {
      for (var c = 0; c < qrsize; c++) {
        if (isDark(r, c)) {
          context.fillRect(
            c * dotsize + paddingH,
            r * dotsize + paddingV + posicao,
            dotsize,
            dotsize
          ) // x, y, w, h
        }
      }
    }

    posicao += qrsize * dotsize + paddingV * 2
  }

  {
    // partes VIII e IX
    const infAdic = infNFe.infAdic
    const infAdFisco = infAdic?.infAdFisco
    const infCpl = infAdic?.infCpl
    const xMsg = infProt?.xMsg
    const homolog = infNFe.ide.tpAmb === '2'
    const naoHomologado = !infProt
    if (infAdFisco || xMsg || homolog || naoHomologado || cancelada) {
      if (infAdFisco) escrever(infAdFisco, 'left')
      if (xMsg) escrever(xMsg, 'left')
      if (cancelada) {
        const aviso =
          'NFC-e CANCELADA ' +
          (homolog ? '' : 'E EMITIDA EM AMBIENTE DE HOMOLOGAÇÃO ') +
          '- SEM VALOR FISCAL'
        escrever(aviso, 'center')
      } else if (naoHomologado) {
        const aviso = 'NFC-e NÃO PROTOCOLADA - SEM VALOR FISCAL'
        escrever(aviso, 'center')
      } else if (homolog) {
        const aviso = 'EMITIDA EM AMBIENTE DE HOMOLOGAÇÃO - SEM VALOR FISCAL'
        escrever(aviso, 'center')
      }
      if (infCpl) espaco()
    }
    if (infCpl) escrever(infCpl, 'center')
  }

  {
    // ajuste de altura do canvas
    const altura = Math.ceil((posicao + 1) / 8) * 8
    const data = context.getImageData(0, 0, largura, altura)
    canvas.height = altura
    context.putImageData(data, 0, 0)
  }
}

const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function getMoeda(v: string | number) {
  const n = +v
  return formatter.format(n)
}

function getNumeroStr(v: number, decimalOpcional: boolean = false) {
  if (decimalOpcional && Math.round(v) === v) return v.toLocaleString('pt-BR')
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

function getData(v: string) {
  return new Date(v).toLocaleString('pt-BR')
}

const formasPagamento = {
  '01': 'Dinheiro',
  '02': 'Cheque',
  '03': 'Cartão de crédito',
  '04': 'Cartão de débito',
  '05': 'Crédito Loja',
  '10': 'Vale Alimentação',
  '11': 'Vale Refeição',
  '12': 'Vale Presente',
  '13': 'Vale Combustível',
  '14': 'Duplicata Mercantil',
  '15': 'Boleto Bancario',
  '16': 'Depósito Bancário',
  '17': 'Pagamento Instantâneo (PIX)',
  '18': 'Transferência bancária, Carteira Digital',
  '19': 'Programa de fidelidade, Cashback, Crédito Virtual',
  '90': 'Sem Pagamento',
}
