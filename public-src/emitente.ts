import {
  generateForm,
  genericFormElement,
  generateView,
  elementosNFe,
  clearChildren,
} from './form-base'
import { setEmpresa, IEmpresa } from './dados/emitentes'
import { abrirPainel, getEmpresaAtiva, isSessaoIniciada } from './sessao'
import { cadastrarCNPJ, requisitarAcesso, scanRegistro } from './functions'

async function getCertPostBody(data: any) {
  if (data?.cert) {
    const body = {
      cert: btoa(
        String.fromCharCode(
          ...new Uint8Array(await (data.cert as File).arrayBuffer())
        )
      ),
      senha: data.senha,
    }
    return body
  }
}

async function acessar(cnpj: string, data?: any) {
  const contResp = await requisitarAcesso(cnpj, await getCertPostBody(data))
  if (!contResp) return
  setEmpresa(contResp)
  if (contResp.status == 0) {
    alert(
      'O pedido de registro já foi enviado, aguarde a autorização pela administração.'
    )
  }
  location.href = './emitentes.html'
}

function cadastrarEmpresa() {
  clearChildren(document.body)
  const additionalBody = /*html*/ `
  <label for="serieAtual">Série atual das notas fiscais</label>
  <input type="number" id="serieAtual" name="serieAtual" value="1" min="1" max="889" required>
  <label for="cert">Certificado</label>
  <input type="file" id="cert" name="cert" accept=".pfx" required>
  <label for="senha">Senha</label>
  <input type="text" id="senha" name="senha" required>`
  const form = generateForm(
    async (data) => {
      const cert = await getCertPostBody(data)
      if (!cert) {
        alert('Por favor, selecione o certificado e insira a senha.')
        return
      }
      const newId = await cadastrarCNPJ({
        ...cert,
        emit: data.emit,
      })
      setEmpresa({
        id: newId,
        status: 3,
        emit: data.emit,
        serieAtual: data.serieAtual,
      })
      location.href = './emitentes.html'
    },
    generateView(elementosNFe[1]),
    new genericFormElement(additionalBody)
  )
  document.body.appendChild(form)
}

function cadastrarUsuario(cnpj: string) {
  clearChildren(document.body)
  const form0 = generateForm([
    { label: 'Requisitar acesso', task: () => acessar(cnpj) },
  ])
  const form1 = generateForm(
    [
      {
        label: 'Acessar usando certificado',
        task: (data) => acessar(cnpj, data),
      },
    ],
    new genericFormElement(/*html*/ `
    <label for="cert">Certificado</label>
    <input type="file" id="cert" name="cert" accept=".pfx" required>
    <label for="senha">Senha</label>
    <input type="text" id="senha" name="senha" required>`)
  )
  document.body.appendChild(form0)
  document.body.appendChild(form1)
}

if (isSessaoIniciada()) {
  const empresa = getEmpresaAtiva()
  const additionalBody = /*html*/ `
  <label for="serieAtual">Série atual das notas fiscais</label>
  <input type="number" id="serieAtual" name="serieAtual" value="${empresa.serieAtual}" min="1" max="889" required>`
  const formElements = [
    generateView(elementosNFe[1]),
    new genericFormElement(additionalBody),
  ]
  formElements.forEach((v) => v.updateValue({ emit: empresa.emit }))
  const htmlForm = generateForm((data) => {
    // empresa.emit = data.emit
    // empresa.serieAtual = data.serieAtual
    // setEmpresa(empresa)
    alert('Não é possível atualizar dados cadastrais, por enquanto')
    abrirPainel()
  }, ...formElements)
  document.body.appendChild(htmlForm)
} else {
  // Adição de emitente
  const htmlForm = generateForm(
    [
      {
        label: 'Consultar CNPJ',
        task: async (data) => {
          const text = await scanRegistro(data.cnpj)
          if (text == 'CNPJ inválido') {
            alert('CNPJ inválido.')
            return
          }
          if (text == 'Empresa não existe') {
            cadastrarEmpresa()
          } else if (text == 'Usuário não cadastrado') {
            cadastrarUsuario(data.cnpj)
          } else {
            const obj = JSON.parse(text) as IEmpresa
            // Acesso já está liberado
            setEmpresa({
              id: obj.id,
              status: obj.status,
              emit: obj.emit,
              serieAtual: obj.serieAtual,
            })
            location.href = './emitentes.html'
          }
        },
      },
    ],
    new genericFormElement(/*html*/ `
    <label for="cnpj">CNPJ</label>
    <input type="text" id="cnpj" name="cnpj" value="12931158000164">`)
  )
  document.body.appendChild(htmlForm)
}
