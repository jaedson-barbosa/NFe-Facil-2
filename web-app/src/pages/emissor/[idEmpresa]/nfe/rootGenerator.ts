import { IBGE } from '@form/data/IBGE.json'
import type INFeRoot from './INFeRoot'

export function generate(empresa: any): INFeRoot {
  const emit = empresa.emit
  const initialValue: INFeRoot = {
    ide: {
      cUF: getCodigoEstado(emit.enderEmit.UF),
      cNF: getRandomNumber().toString(),
      natOp: '',
      mod: 55,
      serie: empresa.serieNFe,
      nNF: 'Gerenciado pelo servidor',
      dhEmi: toNFeString(new Date()),
      dhSaiEnt: '',
      tpNF: '',
      idDest: '',
      cMunFG: emit.enderEmit.cMun,
      tpImp: '1',
      tpEmis: 1,
      cDV: 'Calculado pelo servidor',
      tpAmb: '',
      finNFe: '',
      indFinal: '',
      indPres: '',
      indIntermed: '',
      procEmi: '0',
      verProc: '0.0.1',
      NFref: [],
    },
    emit,
    dest: {},
    retirada: '',
    entrega: '',
    autXML: [],
    det: [],
    total: {},
    transp: {},
    cobr: '',
    pag: {
      detPag: [],
      vTroco: '',
    },
    infIntermed: '',
    infAdic: '',
    exporta: '',
    compra: '',
    cana: '',
    infRespTec: {
      CNPJ: '12931158000164',
      xContato: 'Jaedson Barbosa Serafim',
      email: 'jaedson33@gmail.com',
      fone: '83988856440',
    },
  }
  return initialValue
}

function getCodigoEstado(sigla: string) {
  return IBGE.find((v) => v.Sigla == sigla)?.Codigo
}

function getRandomNumber(digits: number = 8) {
  var minm = 10 ** (digits - 1)
  var maxm = 10 ** digits - 1
  return Math.floor(Math.random() * (maxm - minm + 1)) + minm
}

function toNFeString(data: Date) {
  var tzo = -data.getTimezoneOffset(),
    dif = tzo >= 0 ? '+' : '-',
    pad = function (num) {
      var norm = Math.floor(Math.abs(num))
      return (norm < 10 ? '0' : '') + norm
    }
  return (
    data.getFullYear() +
    '-' +
    pad(data.getMonth() + 1) +
    '-' +
    pad(data.getDate()) +
    'T' +
    pad(data.getHours()) +
    ':' +
    pad(data.getMinutes()) +
    ':' +
    pad(data.getSeconds()) +
    dif +
    pad(tzo / 60) +
    ':' +
    pad(tzo % 60)
  )
}
