<script lang="ts">
  import { goto } from '@roxi/routify'
  import type { IScoped } from './IScoped'

  export let scoped: IScoped

  $: {
    if (scoped.files?.length) {
      $goto('./parse')
    }
  }
</script>

<div class="container">
  <section>
    <h1>Importação</h1>
    <h2>De notas fiscais, clientes, produtos e transportes.</h2>
  </section>
  <label>
    <input type="checkbox" bind:checked={scoped.importarClientes} />
    Importar clientes
  </label>
  <label>
    <input type="checkbox" bind:checked={scoped.importarProdutos} />
    Importar produtos
  </label>
  <label>
    <input type="checkbox" bind:checked={scoped.importarTransportes} />
    Importar transportes
  </label>
  <label class="button" for="selecionar"> Selecionar XMLs... </label>
  <input
    id="selecionar"
    type="file"
    bind:files={scoped.files}
    accept="application/xml"
    required
  />
</div>
