import {
  defaultFormSubmit,
  getForm,
  defaultForm,
  genericFormElement,
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
  const additionalBody = document.createElement('div')
  additionalBody.innerHTML = /*html*/ `
    <label for="serieAtual">Série atual das notas fiscais</label>
    <input type="number" id="serieAtual" name="serieAtual" value="1" min="1" max="889" required>
    <label for="cert">Certificado</label>
    <input type="file" id="cert" name="cert" accept=".pfx" required>
    <label for="senha">Senha</label>
    <input type="text" id="senha" name="senha" required>`
  const form = new defaultForm(
    ...defaultForm.generateView(defaultForm.elementosNFe[1]),
    new genericFormElement(additionalBody)
  ).generateForm(async (data) => {
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
  })
  document.body.appendChild(form)
}

function cadastrarUsuario(cnpj: string) {
  document.body.innerHTML = /*html*/ `
    <form>
        <input type="hidden" name="cnpj" value="${cnpj}">
        <fieldset>
            <legend>Requisitar acesso</legend>
            <input type="submit">
        </fieldset>
    </form>
    <form>
        <input type="hidden" name="cnpj" value="${cnpj}">
        <fieldset>
            <legend>Acessar usando certificado</legend>
            <label for="cert">Certificado</label>
            <input type="file" id="cert" name="cert" accept=".pfx" required>
            <label for="senha">Senha</label>
            <input type="text" id="senha" name="senha" required>
            <input type="submit">
        </fieldset>
    </form>`
  getForm(0).onsubmit = (e) =>
    defaultFormSubmit(e, (data) => acessar(data.cnpj))
  getForm(1).onsubmit = (e) =>
    defaultFormSubmit(e, (data) => acessar(data.cnpj, data))
}

if (isSessaoIniciada()) {
  const empresa = getEmpresaAtiva()
  const additionalBody = document.createElement('div')
  additionalBody.innerHTML = /*html*/ `
    <label for="serieAtual">Série atual das notas fiscais</label>
    <input type="number" id="serieAtual" name="serieAtual" value="${empresa.serieAtual}" min="1" max="889" required>`
  const form = new defaultForm(
    ...defaultForm.generateView(defaultForm.elementosNFe[1]),
    new genericFormElement(additionalBody)
  )
  form.updateValue({ emit: empresa.emit })
  const htmlForm = form.generateForm((data) => {
    empresa.emit = data.emit
    empresa.serieAtual = data.serieAtual
    setEmpresa(empresa)
    alert('Dados cadastrais atualizados.')
    abrirPainel()
  })
  document.body.appendChild(htmlForm)
} else {
  // Adição de emitente
  document.body.innerHTML = /*html*/ `
    <form>
        <label for="cnpj">CNPJ</label>
        <input type="text" id="cnpj" name="cnpj" value="12931158000164">
        <input type="submit">
    </form>`
  getForm().onsubmit = (e) =>
    defaultFormSubmit(e, async (data) => {
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
        // Acesso já está liberado
        location.href = './emitentes.html'
      }
    })
}
