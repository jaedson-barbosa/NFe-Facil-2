<script lang="ts">
  import { empresa, idEmpresa, empresaRef } from '../app/store';
  import Emit from '../data-views/Emit.svelte';
  import { url, goto } from '@roxi/routify';

  let loading = false;
  let raiz = undefined;

  $: {
    if ($empresa && !raiz) raiz = { ...$empresa };
  }

  async function salvar(root: any) {
    loading = true;
    try {
      if (root.emit.CNPJ != $idEmpresa) {
        alert('Não é permitida a alteração do CNPJ do emitente.');
        return;
      }
      await $empresaRef.update(root);
      $goto('./');
    } catch (error) {
      alert(error.message);
      loading = false;
    }
  }
</script>

{#if raiz}
  <form on:submit|preventDefault={() => salvar(raiz)}>
    <fieldset disabled={loading}>
      <Emit {raiz}>
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
