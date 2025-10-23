import { https } from "firebase-functions";
import { ICertificado, IInfos } from "../commom/tipos";
import { requisitarAutorizacao } from "../transmitir/autorizacao";
import { validarProtNFe } from "../transmitir/validarProtNFe";
import { retEnviNFeSinc } from "../transmitirNFCe/autorizacao";

/** @returns Protocolo da NF-e */
export async function autorizar(
  infos: IInfos,
  cert: ICertificado,
  xml: string
): Promise<retConsReciNFe | undefined> {
  const retEnviNFe: retEnviNFeSinc = await requisitarAutorizacao(
    infos,
    cert,
    xml,
    false
  );
  const protNFe = retEnviNFe.protNFe;
  if (!protNFe) {
    throw new https.HttpsError(
      "internal",
      "Falha durante envio de lote de notas fiscais:\n" +
        `${retEnviNFe.cStat.$t}: ${retEnviNFe.xMotivo.$t}`,
      retEnviNFe.xMotivo.$t
    );
  }
  return validarProtNFe(protNFe) && protNFe;
}

export interface retConsReciNFe {
  versao: string;
  tpAmb: { $t: string };
  verAplic: { $t: string };
  nRec: { $t: string };
  cStat: { $t: string };
  xMotivo: { $t: string };
  cUF: { $t: string };
  dhRecbto: { $t: string };
  cMsg: { $t: string };
  xMsg: { $t: string };
  protNFe: any;
}
