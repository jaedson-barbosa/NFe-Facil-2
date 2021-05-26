import { VERSAO } from '@app/info'
import { IBGE } from '@form/data/IBGE.json'
import type INFeRoot from './INFeRoot'

export function generate(empresa: any, initialValue: INFeRoot = undefined): INFeRoot {
  const emit = empresa.emit
  return {
    Id: '',
    ide: {
      cUF: getCodigoEstado(emit.enderEmit.UF),
      cNF: getRandomNumber().toString(),
      natOp: initialValue?.ide.natOp ?? '',
      mod: 55,
      serie: empresa.serieNFe,
      nNF: initialValue?.ide.nNF ?? '1',
      dhEmi: toNFeString(new Date()),
      dhSaiEnt: initialValue?.ide.dhSaiEnt ?? '',
      tpNF: initialValue?.ide.tpNF ?? '',
      idDest: initialValue?.ide.idDest ?? '',
      cMunFG: initialValue?.ide.cMunFG ?? emit.enderEmit.cMun,
      tpImp: initialValue?.ide.tpImp ?? '1',
      tpEmis: 1,
      cDV: 'Calculado pela aplicação',
      tpAmb: initialValue?.ide.tpAmb ?? '',
      finNFe: initialValue?.ide.finNFe ?? '',
      indFinal: initialValue?.ide.indFinal ?? '',
      indPres: initialValue?.ide.indPres ?? '',
      indIntermed: initialValue?.ide.indIntermed ?? '',
      procEmi: initialValue?.ide.procEmi ?? '0',
      verProc: VERSAO,
      NFref: initialValue?.ide.NFref ?? [],
    },
    emit,
    dest: initialValue?.dest ?? {},
    retirada: initialValue?.retirada ?? '',
    entrega: initialValue?.entrega ?? '',
    autXML: initialValue?.autXML ?? [],
    det: initialValue?.det ?? [],
    total: initialValue?.total ?? {},
    transp: initialValue?.transp ?? {},
    cobr: initialValue?.cobr ?? '',
    pag: initialValue?.pag ?? {
      detPag: [],
      vTroco: '',
    },
    infIntermed: initialValue?.infIntermed ?? '',
    infAdic: initialValue?.infAdic ?? '',
    exporta: initialValue?.exporta ?? '',
    compra: initialValue?.compra ?? '',
    cana: initialValue?.cana ?? '',
    infRespTec: {
      CNPJ: '12931158000164',
      xContato: 'Jaedson Barbosa Serafim',
      email: 'jaedson33@gmail.com',
      fone: '83988856440',
    },
  }
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
