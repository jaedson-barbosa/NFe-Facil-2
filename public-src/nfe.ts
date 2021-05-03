import { gerarViewCliente } from './dados/clientes'
import { getItens } from './dados/geral'
import { baixarXML, baixarDANFE } from './dados/notas'
import {
  generateForm,
  generateView,
  generateViews,
  fieldsetFormElement,
  hiddenFormElement,
  getCodigoEstado,
  listFormElement,
  searchFormElement,
  IBaseFormElement,
  clearChildren,
  buttonFormElement,
  elementosNFe
} from './form-base'
import {
  apenasSalvarNota,
  assinarTransmitirNota,
  getJsonNota,
} from './functions'
import { getAmbiente, getEmpresaAtiva, versaoEmissor } from './sessao'

const empresa = getEmpresaAtiva()
const emit = empresa.emit

function getRandomNumber(digits: number = 8) {
  var minm = 10 ** (digits - 1)
  var maxm = 10 ** digits - 1
  return Math.floor(Math.random() * (maxm - minm + 1)) + minm
}

declare global {
  interface Date {
    toNFeString(): string
  }
}

Date.prototype.toNFeString = function () {
  var tzo = -this.getTimezoneOffset(),
    dif = tzo >= 0 ? '+' : '-',
    pad = function (num) {
      var norm = Math.floor(Math.abs(num))
      return (norm < 10 ? '0' : '') + norm
    }
  return (
    this.getFullYear() +
    '-' +
    pad(this.getMonth() + 1) +
    '-' +
    pad(this.getDate()) +
    'T' +
    pad(this.getHours()) +
    ':' +
    pad(this.getMinutes()) +
    ':' +
    pad(this.getSeconds()) +
    dif +
    pad(tzo / 60) +
    ':' +
    pad(tzo % 60)
  )
}

function gerarIdentificacao() {
  const root = elementosNFe[0]
  const rootName = 'ide'
  const NFref = generateViews(root, {}, 'NFref')[0]
  return new fieldsetFormElement(
    {
      legend: 'Informações de identificação da NF-e',
      required: true,
    },
    new hiddenFormElement(
      [rootName, 'cUF'],
      true,
      getCodigoEstado(emit.enderEmit.UF)
    ),
    new hiddenFormElement(
      [rootName, 'cNF'],
      true,
      getRandomNumber().toString()
    ),
    ...generateViews(root, {}, 'natOp'),
    new hiddenFormElement([rootName, 'mod'], true, '55'),
    new hiddenFormElement(
      [rootName, 'serie'],
      true,
      empresa.serieAtual.toString()
    ),
    new hiddenFormElement([rootName, 'nNF'], true, '%NUMERO%'),
    new hiddenFormElement([rootName, 'dhEmi'], true, new Date().toNFeString()),
    ...generateViews(root, {}, 'tpNF', 'idDest', 'cMunFG'),
    new hiddenFormElement([rootName, 'tpImp'], true, '1'),
    new hiddenFormElement([rootName, 'tpEmis'], true, '1'),
    new hiddenFormElement([rootName, 'cDV'], true, '%CDV%'),
    new hiddenFormElement([rootName, 'tpAmb'], true, getAmbiente()),
    ...generateViews(
      root,
      {},
      'finNFe',
      'indFinal',
      'indPres',
      'indIntermed'
    ),
    new hiddenFormElement([rootName, 'procEmi'], true, '0'),
    new hiddenFormElement([rootName, 'verProc'], true, versaoEmissor()),
    new listFormElement(NFref as fieldsetFormElement, ['ide', 'NFref'])
  )
}

function gerarEmitente() {
  const view = generateView(elementosNFe[1], {
    rootTag: 'xs:element',
  })[0] as fieldsetFormElement
  view.options.hidden = true
  view.updateValue({ emit })
  return view
}

const dialog = document.getElementById('search') as HTMLDialogElement

async function gerarProdutosEdicao() {
  const views = generateView(elementosNFe[7], {
    customRequireds: ['IPI|ISSQN', 'ICMS|IPI|II'],
    customOptions: [
      {
        firstOption: 'Tributação pelo ICMS\n00 - Tributada integralmente',
        optionsChanger: (options) => {
          if (emit.CRT === 2) {
            // Regime normal
            options.splice(11)
          } else {
            // Simples nacional
            options.splice(0, 11)
          }
        },
      },
    ],
  })
  const view = views[0] as listFormElement
  const prods = await getItens('prod')
  const prodsView = prods.map((v) => {
    const cProd = v[1].prod.cProd
    const xProd = v[1].prod.xProd
    return cProd ? `${xProd} - ${cProd}` : xProd
  })
  let i = 0
  view.onAddItem = (content) => {
    const localI = i++
    const search = new searchFormElement(
      'Buscar produto cadastrado',
      prodsView,
      (value) => {
        const index = prodsView.indexOf(value)
        const prod = prods[index][1]
        const det = { det: {} }
        det.det[localI] = prod
        content.forEach((v) => v.updateValue(det))
        dialog.close()
      }
    )
    const button = new buttonFormElement('Buscar produto cadastrado', () => {
      clearChildren(dialog)
      search.generate(dialog)
      dialog.showModal()
    })
    content.unshift(button)
  }
  return view
}

async function gerarCliente() {
  const view = gerarViewCliente()
  const content = view.children
  const dests = await getItens('dest')
  const destsView = dests.map((v) => {
    const xNome = v[1].dest.xNome
    const xLgr = v[1].dest.enderDest.xLgr
    return xLgr ? `${xNome} - ${xLgr}` : xNome
  })
  const search = new searchFormElement(
    'Buscar cliente cadastrado',
    destsView,
    (value) => {
      const index = destsView.indexOf(value)
      const dest = dests[index][1]
      content.forEach((v) => v.updateValue(dest))
      dialog.close()
    }
  )
  const button = new buttonFormElement('Buscar cliente cadastrado', () => {
    clearChildren(dialog)
    search.generate(dialog)
    dialog.showModal()
  })
  content.unshift(button)
  return view
}

function gerarProdutosVisualizacao() {
  const views = generateView(elementosNFe[7], {
    customRequireds: ['IPI|ISSQN', 'ICMS|IPI|II'],
  })
  const view = views[0] as listFormElement
  view.hidden = true
  return view
}

function gerarRetirada() {
  return generateView(elementosNFe[4], {
    rootTag: 'xs:element',
  })
}

function gerarEntrega() {
  return generateView(elementosNFe[5], {
    rootTag: 'xs:element',
  })
}

function gerarAutorizacao() {
  return new listFormElement(
    generateView(
      elementosNFe[6]
    )[0] as fieldsetFormElement,
    ['autXML']
  )
}

function gerarTotal() {
  return generateView(elementosNFe[8], {
    rootTag: 'xs:element',
  })
}

async function gerarTransporte() {
  const views = generateView(elementosNFe[9], {
    rootTag: 'xs:element',
    customRequireds: ['vol', 'veicTransp|reboque', 'reboque', 'lacres'],
  })
  const view = views[0] as fieldsetFormElement
  const motView = view.children[1] as fieldsetFormElement
  const content = motView.children
  const mots = await getItens('transporta')
  const motsView = mots.map((v) => {
    const xNome = v[1].transporta.xNome
    const xEnder = v[1].transporta.xEnder
    return xEnder ? `${xNome} - ${xEnder}` : xNome
  })
  const search = new searchFormElement(
    'Buscar motorista cadastrado',
    motsView,
    (value) => {
      const index = motsView.indexOf(value)
      const mot = mots[index][1]
      const transp = { transp: mot }
      content.forEach((v) => v.updateValue(transp))
      dialog.close()
    }
  )
  const button = new buttonFormElement('Buscar motorista cadastrado', () => {
    clearChildren(dialog)
    search.generate(dialog)
    dialog.showModal()
  })
  content.unshift(button)
  return view
}

function gerarCobranca() {
  return generateView(elementosNFe[10], {
    rootTag: 'xs:element',
    customRequireds: ['fat', 'dup'],
  })
}

function gerarPagamento() {
  return generateView(elementosNFe[11], {
    rootTag: 'xs:element',
  })
}

function gerarIntermediador() {
  return generateView(elementosNFe[12], {
    rootTag: 'xs:element',
  })
}

function gerarInformacoes() {
  return new fieldsetFormElement(
    { legend: 'Informações Adicionais', required: false },
    ...generateViews(
      elementosNFe[13],
      {},
      'infAdFisco',
      'infCpl'
    )
  )
}

function gerarExportacao() {
  return generateView(elementosNFe[14])
}

function gerarCompra() {
  return generateView(elementosNFe[15])
}

function gerarCana() {
  return generateView(elementosNFe[16], {
    customRequireds: ['deduc'],
  })
}

function gerarResponsavelTecnico() {
  const rootName = 'infRespTec'
  return new fieldsetFormElement(
    {
      legend: 'Responsável técnico',
      required: true,
      hidden: true,
    },
    new hiddenFormElement([rootName, 'CNPJ'], true, '12931158000164'),
    new hiddenFormElement(
      [rootName, 'xContato'],
      true,
      'Jaedson Barbosa Serafim'
    ),
    new hiddenFormElement([rootName, 'email'], true, 'jaedson33@gmail.com'),
    new hiddenFormElement([rootName, 'fone'], true, '83988856440')
  )
}

;(async function () {
  const prodsVisualizacao = gerarProdutosVisualizacao()
  let telaPrincipal: IBaseFormElement[] = [
    gerarIdentificacao(),
    gerarEmitente(),
    await gerarCliente(),
    prodsVisualizacao,
    ...gerarRetirada(),
    ...gerarEntrega(),
    gerarAutorizacao(),
    ...gerarTotal(),
    await gerarTransporte(),
    ...gerarCobranca(),
    ...gerarPagamento(),
    ...gerarIntermediador(),
    gerarInformacoes(),
    ...gerarExportacao(),
    ...gerarCompra(),
    ...gerarCana(),
    gerarResponsavelTecnico(),
  ]
  let prodsEdicao: listFormElement = await gerarProdutosEdicao()

  const main = document.getElementById('main')
  let currentData: any = {}

  const parametros = new URLSearchParams(location.search)
  const clonar = parametros.get('c') //Nova nota baseada em outra
  const exibir = parametros.get('ex') //Exibir nota salva
  const editar = parametros.get('ed') //Edita uma nota apenas salva
  const idNota = clonar ?? exibir ?? editar
  if (idNota) {
    const nota = await getJsonNota(idNota)
    currentData = nota.infNFe
    // if (!Array.isArray(currentData.det)) {
    //   currentData.det = [currentData.det]
    // }
  }

  function renderPrincipal() {
    clearChildren(main)
    const elements = telaPrincipal
    elements.forEach(v => v.updateValue(currentData))
    //Apenas salvar e assinar e transmitir
    main.appendChild(generateForm(actions, ...elements))
  }

  function renderProdutos() {
    clearChildren(main)
    const elements = [prodsEdicao]
    elements.forEach(v => v.updateValue(currentData))
    console.log(currentData)
    main.appendChild(
      generateForm((data) => {
        currentData.det = data.det
        renderPrincipal()
      }, ...elements)
    )
  }

  const posProcessamento = (data: any) => {
    const ordem = [
      'vTotTrib',
      'ICMS',
      'IPI',
      'II',
      'ISSQN',
      'PIS',
      'PISST',
      'COFINS',
      'COFINSST',
      'ICMSUFDest',
    ]
    ;(data.det as any[]).forEach((v) =>
      v.imposto = ordem.reduce((p, c) => {
        const k = v.imposto[c]
        if (k) p[c] = k
        return p
      }, {})
    )
  }

  const actionsExibir = [
    {
      label: 'Clonar nota',
      task: () => {
        prodsVisualizacao.hidden = true
        telaPrincipal.forEach((v) => (v.readOnly = false))
        renderProdutos()
      },
    },
    { label: 'Gerar DANFE', task: () => baixarDANFE(idNota) },
    { label: 'Baixar XML', task: () => baixarXML(idNota) },
  ]
  const actionsEditar = [
    {
      label: 'Apenas salvar',
      task: async (data: any) => {
        posProcessamento(data)
        if (await apenasSalvarNota({ infNFe: data }, editar)) {
          alert('Nota salva com sucesso')
        }
      },
    },
    {
      label: 'Assinar e transmitir',
      task: async (data: any) => {
        posProcessamento(data)
        if (await assinarTransmitirNota({ infNFe: data }, editar)) {
          alert('Nota assinada com sucesso')
        }
      },
    },
  ]
  const actions = exibir ? actionsExibir : actionsEditar

  if (exibir) {
    prodsVisualizacao.hidden = false
    telaPrincipal.forEach((v) => (v.readOnly = true))
    renderPrincipal()
  } else {
    renderProdutos()
  }
})()
