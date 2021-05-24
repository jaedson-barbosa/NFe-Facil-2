<script lang="ts">
  import { goto } from '@sveltech/routify'
  import { IBGE } from '@form/data/IBGE.json'
  import { db } from '@app/firebase'

  export let scoped: { commom: { root: any } }
  export let idEmpresa: string

  db.collection('empresas')
    .doc(idEmpresa)
    .get()
    .then((v) => {
      const empresa = v.data()
      const emit = empresa.emit
      scoped.commom.root = {
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
          cMunFG: '',
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
        dest: {}
      }
      $goto('../identificacao')
    })
    .catch((v) => {
      console.log(v)
      alert('Erro ao tentar obter informações do emitente')
    })

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
</script>

<progress class="progress is-large" />
