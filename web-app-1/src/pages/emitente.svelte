<script lang="ts">
  import { empresa, idEmpresa, empresaRef } from '../code/store';
  import Emit from '../nfe-parts/Emit.svelte';
  import { goto } from '@roxi/routify';

  let loading = false;
  let raiz = undefined;

  $: {
    if ($empresa && !raiz) raiz = { ...$empresa };
  }

  async function salvar() {
    loading = true;
    try {
      if (raiz.emit.CNPJ != $idEmpresa) {
        alert('Não é permitida a alteração do CNPJ do emitente.');
        return;
      }
      await $empresaRef.update(raiz);
      $goto('./');
    } catch (error) {
      alert(error.message);
      loading = false;
    }
  }
</script>

{#if raiz}
  <form on:submit|preventDefault={() => salvar()}>
    <fieldset disabled={loading}>
      <Emit bind:raiz>
        <label>
          Série da NF-e <small>Série atual de emissão das NF-es</small>
          <input bind:value={raiz.serieNFe} pattern={'0|[1-9]{1}[0-9]{0,2}'} />
        </label>
        <label>
          Série da NFC-e <small>Série atual de emissão das NFC-es</small>
          <input bind:value={raiz.serieNFCe} pattern={'0|[1-9]{1}[0-9]{0,2}'} />
        </label>
        <label>
          ID CSC <small>Identificador do CSC</small>
          <input bind:value={raiz.IDCSC} />
        </label>
        <label>
          CSC <small>Código de Segurança do Contribuinte</small>
          <input bind:value={raiz.CSC} />
        </label>
        <input type="submit" class="button" />
      </Emit>
    </fieldset>
  </form>
{/if}
