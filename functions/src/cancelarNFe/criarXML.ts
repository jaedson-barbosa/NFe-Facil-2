import { IEmpresa } from "../IEmpresa"
import { TAmb } from "../TAmb"

export function criarXML(
  empresa: IEmpresa,
  cOrgao: number,
  chaveNFe: string,
  numeroProtocolo: number,
  justificativa: string,
  dhEvento: string,
  ambiente: TAmb
) {
  const xml = `<evento xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.00">
  <infEvento Id="ID110111${chaveNFe}01">
    <cOrgao>${cOrgao}</cOrgao>
    <tpAmb>${ambiente}</tpAmb>
    <CNPJ>${empresa.emit.CNPJ}</CNPJ>
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
  return xml
}
