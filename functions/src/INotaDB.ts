export interface INotaDB {
  cancelada?: boolean
  infNFe: any
  dhEmi: FirebaseFirestore.Timestamp
  nProt?: number
  xml: string
  xmlCancelamento?: string
}