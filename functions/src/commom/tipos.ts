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
}

export enum NiveisAcesso {
  R = 'R',
  RW = 'RW',
  A = 'A',
}

export interface INotaDB {
  infNFe: any
  dhEmi: FirebaseFirestore.Timestamp
  cancelada?: boolean
  nProt?: number
  xml?: string
  xmlCancelamento?: string
}

export interface IReqAddMembro {
  CNPJ: string
  idNovo: string
  escrita: boolean
}

export interface IResAddMembro {
  sucesso: true
}

//#endregion

export enum Ambientes {
  Producao = '1',
  Homologacao = '2',
}

export interface ICertificado {
  chavePublica: string
  chavePrivada: string
}

export interface IInfos {
  serie: string
  numero: number
  ambiente: Ambientes
  modelo: '55' | '65'
  UF: string
}
