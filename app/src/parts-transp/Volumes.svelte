<script lang="ts">
  import { goto, url } from '@roxi/routify'
  import Adicionar from '../components/Adicionar.svelte'

  export let vol: any[]

  if (!vol) vol = []
</script>

<h3>
  Volumes
  <Adicionar href={$url('./volume/:volume', { volume: '-1' })} />
</h3>
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
