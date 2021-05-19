<script lang="ts">
  import { url } from '@sveltech/routify'

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
          class="button"
          href={$url('../cadastro/:idEmpresa', {
            idEmpresa: cad.parentId,
          })}
        >
          <span class="icon is-small">
            <i class="fas fa-edit" />
          </span>
        </a>
        <a
          class="button"
          href={$url('../:idEmpresa', { idEmpresa: cad.parentId })}
        >
          <span class="icon is-small">
            <i class="fas fa-sign-in-alt" />
          </span>
        </a>
      </div>
    </td>
  {/await}
</tr>
