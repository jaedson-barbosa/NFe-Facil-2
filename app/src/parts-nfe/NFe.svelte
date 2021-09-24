<script lang="ts">
  import Ide from './Ide.svelte'
  import Local from './Local.svelte'
  import Destinatario from './Destinatario.svelte'
  import AutXml from './AutXML.svelte'
  import Transp from './Transp.svelte'
  import Pag from './Pag.svelte'
  import InfAdic from './InfAdic.svelte'
  import Produtos from './Produtos.svelte'
  import Voltar from '../components/Voltar.svelte'
  import { empresa } from '../code/store'
  import { get } from 'svelte/store'

  export let raiz: any

  if (!raiz.emit) raiz.emit = get(empresa).emit

  raiz.infRespTec = {
    CNPJ: '12931158000164',
    xContato: 'Jaedson Barbosa Serafim',
    email: 'jaedson33@gmail.com',
    fone: '83988856440',
  }

  $: consumidorFinal = raiz.ide?.indFinal == '1'
  $: isNFCe = raiz.ide?.['mod'] === '65'
</script>

<h1><Voltar /> Nota fiscal</h1>

<Ide bind:raiz />
<Destinatario bind:dest={raiz.dest} {isNFCe} />
<Produtos bind:det={raiz.det} bind:total={raiz.total} {consumidorFinal} />
<Transp bind:raiz />
<Pag bind:raiz total={raiz.total?.ICMSTot?.vNF ?? 0} />
<InfAdic bind:raiz />
<Local bind:raiz name="retirada" />
<Local bind:raiz name="entrega" />
<AutXml bind:raiz />
