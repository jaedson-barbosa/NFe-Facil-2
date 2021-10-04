import assinar from '../commom/assinar'
import { Ambientes, ICertificado, INotaDB, IReqCancelar } from '../commom/tipos'

export default function (
  nota: INotaDB,
  cnpj: string,
  ambiente: Ambientes,
  { justificativa, dhEvento }: IReqCancelar,
  certificado: ICertificado
) {
  const cOrgao = nota.infNFe.ide.cUF
  const chaveNFe = nota.infNFe.Id?.slice(3)
  const numeroProtocolo = nota.nProt!
  const xml = `<evento xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.00">
  <infEvento Id="ID110111${chaveNFe}01">
    <cOrgao>${cOrgao}</cOrgao>
    <tpAmb>${ambiente}</tpAmb>
    <CNPJ>${cnpj}</CNPJ>
    <chNFe>${chaveNFe}</chNFe>
    <dhEvento>${dhEvento}</dhEvento>
    <tpEvento>110111</tpEvento>
    <nSeqEvento>1</nSeqEvento>
    <verEvento>1.00</verEvento>
    <detEvento versao="1.00">
      <descEvento>Cancelamento</descEvento>
      <nProt>${numeroProtocolo}</nProt>
      <xJust>${justificativa}</xJust>
    </detEvento>
  </infEvento>
  </evento>`.replace(/>\s+</g, '><')
  const xmlAssinado = assinar(certificado, xml, 'infEvento')
  return xmlAssinado
}
