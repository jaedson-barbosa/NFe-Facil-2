import { IBGE } from '../base-data/IBGE.json';


export function getCodigoEstado(sigla: string) {
  return IBGE.find((v) => v.Sigla == sigla)?.Codigo;
}
