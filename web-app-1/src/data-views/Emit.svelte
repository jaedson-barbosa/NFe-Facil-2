<script lang="ts">
  import InputT from '../components/InputT.svelte';
  import Select from '../components/Select.svelte';
  import EnderEmit from './EnderEmit.svelte';

  export let raiz: any;

  const el = 'emit';
  if (!raiz[el]) raiz[el] = {};
  let r = raiz[el];
</script>

<h3>Identificação do emitente</h3>
<InputT lab="CNPJ" mask="cnpj" bind:val={r['CNPJ']} />
<InputT lab="Razão social ou nome do emitente" min={2} max={60} bind:val={r['xNome']} />
<InputT lab="Nome fantasia" opt min={1} max={60} bind:val={r['xFant']} />
<EnderEmit raiz={r} />
<InputT lab="Inscrição Estadual" max={14} pat={'[0-9]{(2, 14)}|ISENTO'} bind:val={r['IE']} />
<InputT lab="IE do Substituto Tributário" opt max={14} pat={'[0-9]{(2, 14)}'} bind:val={r['IEST']} />
<InputT lab="Inscrição Municipal" opt={!r['CNAE']} min={1} max={15} bind:val={r['IM']} />
{#if r['IM'] || r['CNAE']}
  <InputT lab="CNAE Fiscal" pat={'[0-9]{7}'} bind:val={r['CNAE']} />
{/if}
<Select
  lab="Código de Regime Tributário"
  els={[
    ['1', 'Simples Nacional'],
    ['2', 'Simples Nacional, excesso de sublimite de receita bruta'],
    ['3', 'Regime Normal'],
  ]}
  bind:val={r['CRT']} />

<slot />
