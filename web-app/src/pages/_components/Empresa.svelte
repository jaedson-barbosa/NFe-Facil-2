<script lang="ts">
  import { url } from '@roxi/routify'

  export let cad: {
    parentId: string
    status: string
    loadParentName: () => Promise<string>
  }
</script>

<tr>
  <td>{cad.parentId}</td>
  <td>{cad.status}</td>
  {#await cad.loadParentName()}
    <td colspan="2"><progress class="progress is-large" /></td>
  {:then parentName}
    <td>{parentName}</td>
    <td>
      <div class="buttons">
        <a
          href={$url('../cadastro/:idEmpresa', {
            idEmpresa: cad.parentId,
          })}
        >
          Editar
        </a>
        <a href={$url('../:idEmpresa', { idEmpresa: cad.parentId })}>
          Entrar
        </a>
      </div>
    </td>
  {/await}
</tr>
