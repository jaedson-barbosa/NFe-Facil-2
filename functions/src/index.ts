import cadastrarCNPJ from './cadastrarCNPJ'
import requisitarAcesso from './requisitarAcesso'
import scanRegistro from './scanRegistro'
import scanUsuario from './scanUsuario'

export { cadastrarCNPJ, requisitarAcesso, scanRegistro, scanUsuario }
export { consultarStatusServico } from './requisicoes'
export { importar } from './importacao'
export { apenasSalvarNota, getJsonNota, getXML, assinarTransmitirNota, gerarDANFE } from './nfe'
export { sincronizar } from './sincronizacao'
