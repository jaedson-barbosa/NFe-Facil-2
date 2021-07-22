<script lang="ts">
  import InputT from '../components/InputT.svelte';
  import Municipio from '../components/Municipio.svelte';
  import Pais from '../components/Pais.svelte';

  export let raiz: any;
  export let isEstrageiro: boolean;

  const el = 'enderDest';
  if (!raiz[el]) raiz[el] = {};
  let r = raiz[el];

  r.cPais = '1058';
  r.xPais = 'BRASIL';

  $: {
    if (isEstrageiro) {
      r.cMun = '9999999';
      r.xMun = 'EXTERIOR';
      r.UF = 'EX';
    } else {
      r.UF = r.xMun = r.cMun = '';
      r.cPais = '1058';
      r.xPais = 'BRASIL';
    }
  }
</script>

<h4>Endereço</h4>
<InputT lab="Logradouro" bind:val={r['xLgr']} min={2} max={60} />
<InputT lab="Número" bind:val={r['nro']} min={1} max={60} />
<InputT lab="Complemento" bind:val={r['xCpl']} opt min={1} max={60} />
<InputT lab="Bairro" bind:val={r['xBairro']} min={2} max={60} />
{#if !isEstrageiro}
  <Municipio bind:cMun={r['cMun']} bind:xMun={r['xMun']} bind:UF={r['UF']} />
{/if}
<InputT lab="CEP" mask="zipcode" bind:val={r['CEP']} pat={'[0-9]{8}'} />
{#if isEstrageiro}
  <Pais bind:cPais={r['cPais']} bind:xPais={r['xPais']} />
{/if}
<InputT lab="Telefone" bind:val={r['fone']} opt aux={'DDD + número do telefone'} pat={'[0-9]{6,14}'} />

<!--

 -->
