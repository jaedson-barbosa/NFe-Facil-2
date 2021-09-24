<script lang="ts">
  import { goto, url } from '@roxi/routify'

  export let vol: any[]

  if (!vol) vol = []
</script>

<h3>Volumes</h3>
<a class="button" href={$url('./volume/:volume', { volume: '-1' })}>
  Adicionar
</a>
{#if vol.length}
  <table>
    <thead>
      <tr>
        <th>Quantidade</th>
        <th>Espécie</th>
        <th>Marca</th>
        <th>Numeração</th>
      </tr>
    </thead>
    <tbody>
      {#each vol as v, i}
        <tr
          on:click={() => $goto('./volume/:volume', { volume: i.toString() })}
        >
          <td>{v.qVol}</td>
          <td>{v.esp}</td>
          <td>{v.marca}</td>
          <td>{v.nVol}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
