<script lang="ts">
  import { generate } from './rootGenerator'
  import { goto } from '@roxi/routify'
  import { db } from '@app/firebase'
  import type INFeRoot from './INFeRoot';

  export let scoped: { commom: { root: INFeRoot } }
  export let idEmpresa: string

  db.collection('empresas')
    .doc(idEmpresa)
    .get()
    .then((v) => {
      const empresa = v.data()
      const initialValue = generate(empresa)
      scoped.commom.root = initialValue
      $goto('./identificacao')
    })
    .catch((v) => {
      console.log(v)
      alert('Erro ao tentar obter informações do emitente')
    })
</script>

<progress class="progress is-large" />
