<script lang="ts">
  import Transportador from '../parts-transp/Transportador.svelte'
  import Meio from '../parts-transp/Meio.svelte'
  import Volumes from '../parts-transp/Volumes.svelte'
  import Retencao from '../parts-transp/Retencao.svelte'

  export let raiz: any

  if (!raiz.transp) raiz.transp = {}
</script>

<h2>Transporte</h2>
<label>
  Modalidade do frete
  <select bind:value={raiz.transp.modFrete}>
    <option value="0">Contratação do Frete por conta do Remetente (CIF)</option>
    <option value="1">Contratação do Frete por conta do destinatário/remetente (FOB)</option>
    <option value="2">Contratação do Frete por conta de terceiros</option>
    <option value="3">Transporte próprio por conta do remetente</option>
    <option value="4">Transporte próprio por conta do destinatário</option>
    <option value="9">Sem Ocorrência de transporte</option>
  </select>
</label>
<Transportador bind:transporta={raiz.transp.transporta} />
<Meio bind:transp={raiz.transp} />
<Volumes bind:vol={raiz.transp.vol} />
<Retencao bind:retTransp={raiz.transp.retTransp} />
