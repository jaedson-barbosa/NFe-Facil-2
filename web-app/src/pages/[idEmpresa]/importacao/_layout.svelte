<script lang="ts">
  import { isActive, url } from '@roxi/routify'
  import type { IScoped } from './IScoped';
  export let scoped: { idEmpresa: string }

  function getNext(cur?: './clientes' | './produtos' | './transportes'): string {
    const steps: string[] = []
    if (innerScoped.importarClientes) steps.push('./clientes')
    if (innerScoped.importarProdutos) steps.push('./produtos')
    if (innerScoped.importarTransportes) steps.push('./transportes')
    let next = cur ? steps[steps.indexOf(cur) + 1] : steps[0]
    return next ?? '../'
  }
  
  let innerScoped: IScoped = {
    idEmpresa: scoped.idEmpresa,
    files: undefined,
    nfes: [],
    importarClientes: true,
    importarProdutos: true,
    importarTransportes: true,
    getNext
  }
</script>

<slot scoped={innerScoped} />
