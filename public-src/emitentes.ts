import {
  renderizarEmitente,
  getEmpresas,
  setEmpresas,
  IEmpresa,
} from './dados/emitentes'
import { clearChildren } from './form-base'
import { scanUsuario } from './functions'

sessionStorage.clear()

function atualizarEmpresas(empresas?: IEmpresa[]) {
  if (!empresas) empresas = getEmpresas()
  const divEmpresas = document.getElementById('emitentes')
  clearChildren(divEmpresas)
  empresas.forEach((v) => {
    const button = renderizarEmitente(v)
    divEmpresas.appendChild(button)
  })
}

atualizarEmpresas()
document.getElementById('atualizar').onclick = async () => {
  const empresas = await scanUsuario()
  setEmpresas(empresas)
  atualizarEmpresas(empresas)
}
