<script lang="ts">
  import InputT from '../components/InputT.svelte';
  import Select from '../components/Select.svelte';
  import EnderDest from './EnderDest.svelte';

  export let raiz: any;

  const el = 'dest';
  if (!raiz[el]) raiz[el] = {};
  let r = raiz[el];

  $: {
    if (r['CPF'] || r['idEstrangeiro']) r['indIEDest'] = '9';
  }
</script>

<h3>Identificação do Destinatário</h3>
{#if !r['CPF'] && !r['idEstrangeiro']}
  <InputT lab="CNPJ" mask="cnpj" bind:val={r['CNPJ']} />
{/if}
{#if !r['CNPJ'] && !r['idEstrangeiro']}
  <InputT lab="CPF" mask="cpf" bind:val={r['CPF']} max={11} pat={'[0-9]{11}'} />
{/if}
{#if !r['CPF'] && !r['CNPJ']}
  <InputT lab="Id estrangeiro" bind:val={r['idEstrangeiro']} pat={'([!-ÿ]{0}|[!-ÿ]{5,20})?'} />
{/if}
<InputT lab="Razão Social ou nome do destinatário" bind:val={r['xNome']} min={2} max={60} />
{#if r['CNPJ']}
  <Select
    lab="Indicador da IE do destinatário"
    bind:val={r['indIEDest']}
    els={[
      ['1', 'Contribuinte ICMS'],
      ['2', 'Contribuinte isento'],
      ['9', 'Não contribuinte'],
    ]} />
{/if}
{#if r['indIEDest'] == '1'}
  <InputT lab="Inscrição Estadual" bind:val={r['IE']} opt max={14} pat={'[0-9]{2,14}'} />
{/if}
<InputT lab="Inscrição na SUFRAMA" bind:val={r['ISUF']} opt pat={'[0-9]{8,9}'} />
<InputT lab="Inscrição Municipal do tomador do serviço" bind:val={r['IM']} opt min={1} max={15} />
<InputT lab="E-mail do destinatário" bind:val={r['email']} opt min={1} max={60} />
<EnderDest raiz={r} isEstrageiro={r['idEstrangeiro']} />
