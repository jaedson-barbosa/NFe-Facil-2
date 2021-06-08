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

<div class="container is-fluid">
  <section class="section">
    <h1 class="title">Importação</h1>
    <h2 class="subtitle">
      De notas fiscais, clientes, produtos e transportes.
    </h2>
  </section>
  <div class="field">
    <label class="checkbox">
      <input type="checkbox" bind:checked={scoped.importarClientes} />
      Importar clientes
    </label>
  </div>
  <div class="field">
    <label class="checkbox">
      <input type="checkbox" bind:checked={scoped.importarProdutos} />
      Importar produtos
    </label>
  </div>
  <div class="field">
    <label class="checkbox">
      <input type="checkbox" bind:checked={scoped.importarTransportes} />
      Importar transportes
    </label>
  </div>
  <div class="file is-boxed">
    <label class="file-label">
      <input
        class="file-input"
        type="file"
        name="resume"
        bind:files={scoped.files}
        multiple
        accept="application/xml"
      />
      <span class="file-cta">
        <span class="file-icon">
          <i class="fas fa-upload" />
        </span>
        <span class="file-label"> Selecionar XMLs... </span>
      </span>
    </label>
  </div>
</div>
