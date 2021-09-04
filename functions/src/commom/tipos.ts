export * from '../../../commom-code'

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

export interface INotaDB {
  infNFe: any
  dhEmi: FirebaseFirestore.Timestamp
  cancelada?: boolean
  nProt?: number
  xml?: string
  xmlCancelamento?: string
}
