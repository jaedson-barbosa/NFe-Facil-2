import cadastrarCNPJ from './cadastrarCNPJ'
import precadastro from './precadastro'
import requisitarAcesso from './requisitarAcesso'
import scanRegistro from './scanRegistro'
import scanUsuario from './scanUsuario'

export { cadastrarCNPJ, precadastro, requisitarAcesso, scanRegistro, scanUsuario }
export { consultarStatusServico } from './requisicoes'
export { importar, registrarDado } from './importacao'
export { apenasSalvarNota, getJsonNota, getXML, assinarTransmitirNota, gerarDANFE, cancelarNFe } from './nfe'
export { sincronizar } from './sincronizacao'
