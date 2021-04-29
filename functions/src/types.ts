import { IViewNota } from "../../commom";

export interface IClienteDB {
  dest: any
  lastUpdate: FirebaseFirestore.Timestamp
}

export interface INotaDB<TDate> {
  json: any
  xml: string
  emitido: boolean
  lastUpdate: TDate
  view: IViewNota
}