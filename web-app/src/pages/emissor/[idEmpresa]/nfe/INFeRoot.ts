
export default interface INFeRoot {
  ide: {
    cUF: string;
    cNF: string;
    natOp: string;
    mod: number;
    serie: any;
    nNF: string;
    dhEmi: string;
    dhSaiEnt: string;
    tpNF: string;
    idDest: string;
    cMunFG: string;
    tpImp: string;
    tpEmis: number;
    cDV: string;
    tpAmb: string;
    finNFe: string;
    indFinal: string;
    indPres: string;
    indIntermed: string;
    procEmi: string;
    verProc: string;
    NFref: any[];
  };
  emit: any;
  dest: any;
  retirada: any;
  entrega: any;
  autXML: any[];
  det: any[];
  total: any;
  transp: any;
  cobr: any;
  pag: { detPag: any[]; vTroco: string; };
  infIntermed: any;
  infAdic: any;
  exporta: any;
  compra: any;
  cana: any;
  infRespTec: { CNPJ: string; xContato: string; email: string; fone: string; };
}
