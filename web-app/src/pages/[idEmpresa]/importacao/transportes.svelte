<script lang="ts">
  import { url } from '@roxi/routify'
  import { dbColumns } from '@app/store'
  import { status } from './status'
  import type { IScoped } from './IScoped'
  import { applyMask } from '@app/documentUtils'

  export let scoped: IScoped

  function getDocumento(dest: any, mask = false) {
    const cpf = dest.CPF
    if (cpf) return mask ? applyMask(cpf, 'cpf') : cpf
    const cnpj = dest.CNPJ
    return mask ? applyMask(cnpj, 'cnpj') : cnpj
  }

  type TTransporta = { transporta: any; status: status }

  let filteredTransportes: TTransporta[] = scoped.nfes
    .map((v) => v.transp.transporta)
    .filter((v) => v.xNome)
    .filter((v) => v.CPF || v.CNPJ)
    .filter((v, i, a) => {
      const doc = getDocumento(v)
      return a.findIndex((k) => getDocumento(k) == doc) == i
    })
    .map((transporta) => {
      return { transporta, status: status.aguardando } as TTransporta
    })

  const transportesColumn = $dbColumns.transportes
  Promise.all(
    filteredTransportes.map(async (v, i) => {
      const update = (status: status) => {
        filteredTransportes[i].status = status
        filteredTransportes = filteredTransportes
      }
      try {
        const transporta = v.transporta
        const id = getDocumento(transporta)
        const docRef = transportesColumn.doc(id)
        const resp = await docRef.get()
        if (resp.exists) throw new Error('Já registrado.')
        await docRef.set({ transporta })
        update(status.aceito)
      } catch (error) {
        console.log(error)
        update(status.recusado)
      }
    })
  ).then(() => (showActions = true))

  let showActions = false
</script>

<div class="container is-fluid">
  <section class="section">
    <h1 class="title">Análise de transportes</h1>
    <h2 class="subtitle">
      Os transportes (motoristas/transportadoras) das notas fiscais são
      analisados e apenas aqueles que ainda não estão cadastrados serão
      registrados.
    </h2>
  </section>
  <div class="content">
    {#each filteredTransportes as item}
      <div class="icon-text">
        {#if item.status == status.recusado}
          <span class="icon has-text-danger">
            <i class="fas fa-ban" />
          </span>
          <span> Transporte não aceito </span>
        {:else if item.status == status.aceito}
          <span class="icon has-text-success">
            <i class="fas fa-check" />
          </span>
          <span> Transporte aceito </span>
        {:else if item.status == status.aguardando}
          <span class="icon has-text-info">
            <i class="fas fa-ellipsis-h" />
          </span>
          <span> Aguardando </span>
        {/if}
      </div>
      <p class="block">
        {item.transporta.xNome} ({getDocumento(item.transporta, true)})
      </p>
    {/each}
  </div>
  {#if showActions}
    <a
      class="button is-primary"
      href={$url(scoped.getNext('./transportes'))}
    >
      Continuar
    </a>
  {/if}
</div>
