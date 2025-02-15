import type { Timestamp } from 'firebase/firestore'

//#region Região comum

export interface IReqCadastrar {
  cert: string
  senha: string
}

export interface IResCadastrar {
  cnpj: string
}

export interface IReqCancelar {
  idNota: string
  justificativa: string
  dhEvento: string
}

export interface IResCancelar {
  cancelada: true
}

export interface IReqTransmitir {
  infNFe: any
  oldId: string
}

export interface IResTransmitir {
  cancelada: boolean
  infNFe: any
  dhEmi: Date
  nProt: number
  xml: string
  mensagem?: string
}

export enum NiveisAcesso {
  RW = 'RW',
  A = 'A',
}

export interface INotaDB {
  infNFe: any
  dhEmi: Timestamp
  cancelada?: boolean
  nProt?: number
  xml?: string
  xmlCancelamento?: string
}

export interface IReqAddMembro {
  CNPJ: string
  id: string
}

export interface IResAddMembro {
  sucesso: true
}

export interface IReqRemMembro {
  CNPJ: string
  id?: string
}

export interface IResRemMembro {
  sucesso: true
}

//#endregion

export enum Dados {
  Clientes = 'clientes',
  Produtos = 'produtos',
  Impostos = 'impostos',
  Transportes = 'transportes',
  NFes = 'nfes',
  Veiculos = 'veiculos'
}

export interface INFeRoot {
  Id: string
  ide: {
    cUF: string
    cNF: string
    natOp: string
    mod: '55' | '65'
    serie: any
    nNF: string
    dhEmi: string
    dhSaiEnt: string
    tpNF: string
    idDest: string
    cMunFG: string
    tpImp: string
    tpEmis: number
    cDV: string
    tpAmb: string
    finNFe: string
    indFinal: string
    indPres: string
    indIntermed: string
    procEmi: string
    verProc: string
    NFref: any[]
  }
  emit: any
  dest: any
  retirada: any
  entrega: any
  autXML: any[]
  det: any[]
  total: any
  transp: any
  cobr: any
  pag: { detPag: any[]; vTroco: string }
  infIntermed: any
  infAdic: any
  exporta: any
  compra: any
  cana: any
  infRespTec: { CNPJ: string; xContato: string; email: string; fone: string }
}

export interface IIBPT {
  isNacional: boolean
  nacional: number
  importado: number
  estadual: number
  municipal: number
  validade: Timestamp
}
