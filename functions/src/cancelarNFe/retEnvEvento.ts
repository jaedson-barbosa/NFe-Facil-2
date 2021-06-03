export interface retEnvEvento {
  versao: string
  idLote: { $t: string }
  tpAmb: { $t: string }
  verAplic: { $t: string }
  cOrgao: { $t: string }
  cStat: { $t: string }
  xMotivo: { $t: string }
  retEvento: {
    infEvento: {
      cStat: { $t: string }
      xMotivo: { $t: string }
    }
  }
}
