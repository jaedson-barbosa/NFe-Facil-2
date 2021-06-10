<script lang="ts">
  import { url, goto } from '@roxi/routify'
  import { total as totalJSON } from '@form/data/nfe.json'
  import AutoForm from '@form/AutoForm.svelte'
  import type INFeRoot from './INFeRoot';

  export let scoped: INFeRoot
  const total =
  scoped.total ?? (scoped.total = { ICMSTot: {}, ISSQNtot: '', retTrib: '' })
  const icmsTot = (scoped.det as any[]).reduce(
    (p, v) => {
      const vIPIDevol = +(v.impostoDevol?.IPI?.vIPIDevol ?? 0)
      p.vIPIDevol += vIPIDevol
      p.vNF += vIPIDevol

      if (v.imposto.ICMS) {
        const icms = Object.values<any>(v.imposto.ICMS)[0]
        p.vBC += +(icms.vBC ?? 0)
        p.vICMS += +(icms.vICMS ?? 0)
        const vICMSDeson = +(icms.vICMSDeson ?? 0)
        p.vICMSDeson += vICMSDeson
        p.vFCPUFDest += +(icms.vFCPUFDest ?? 0)
        p.vICMSUFDest += +(icms.vICMSUFDest ?? 0)
        p.vICMSUFRemet += +(icms.vICMSUFRemet ?? 0)
        p.vFCP += +(icms.vFCP ?? 0)
        p.vBCST += +(icms.vBCST ?? 0)
        p.vST += +(icms.vST ?? 0)
        const vFCPST = +(icms.vFCPST ?? 0)
        p.vFCPST += vFCPST
        p.vFCPSTRet += +(icms.vFCPSTRet ?? 0)
        p.vNF += vFCPST - vICMSDeson
      }
      if (v.imposto.II) {
        const vII = +(v.imposto.II.vII ?? 0)
        p.vII += vII
        p.vNF += vII
      }
      if (v.imposto.IPI) {
        const vIPI = +(v.imposto.IPI.IPITrib?.vIPI ?? 0)
        p.vIPI += vIPI
        p.vNF += vIPI
      }
      if (v.imposto.PIS) {
        const pis = Object.values<any>(v.imposto.PIS)[0]
        p.vPIS += +(pis.vPIS ?? 0)
      }
      if (v.imposto.COFINS) {
        const cofins = Object.values<any>(v.imposto.COFINS)[0]
        p.vCOFINS += +(cofins.vCOFINS ?? 0)
      }
      if (v.prod.indTot == 1) {
        const vProd = +v.prod.vProd
        p.vProd += vProd
        const vFrete = +(v.prod.vFrete ?? 0)
        p.vFrete += vFrete
        const vSeg = +(v.prod.vSeg ?? 0)
        p.vSeg += vSeg
        const vDesc = +(v.prod.vDesc ?? 0)
        p.vDesc += vDesc
        const vOutro = +(v.prod.vOutro ?? 0)
        p.vOutro += vOutro
        p.vTotTrib += +(v.imposto.vTotTrib ?? 0)
        p.vNF += vProd - vDesc + vFrete + vSeg + vOutro
      }
      return p
    },
    {
      vBC: 0,
      vICMS: 0,
      vICMSDeson: 0,
      vFCPUFDest: 0,
      vICMSUFDest: 0,
      vICMSUFRemet: 0,
      vFCP: 0,
      vBCST: 0,
      vST: 0,
      vFCPST: 0,
      vFCPSTRet: 0,
      vProd: 0,
      vFrete: 0,
      vSeg: 0,
      vDesc: 0,
      vII: 0,
      vIPI: 0,
      vIPIDevol: 0,
      vPIS: 0,
      vCOFINS: 0,
      vOutro: 0,
      vNF: 0,
      vTotTrib: 0,
    }
  )
  total.ICMSTot = Object.entries(icmsTot).reduce((p, c) => {
    p[c[0]] = (c[1] as number).toFixed(2)
    return p
  }, {})
</script>

<form on:submit|preventDefault={$goto('./transporte')}>
  <AutoForm el={totalJSON} root={scoped}>
    <div class="field is-grouped is-grouped-centered">
      <p class="control">
        <a href={$url('./produtos')} class="button is-danger">
          Voltar: Produtos
        </a>
      </p>
      <p class="control">
        <button class="button is-primary"> Próximo: Transporte </button>
      </p>
    </div>
  </AutoForm>
</form>
