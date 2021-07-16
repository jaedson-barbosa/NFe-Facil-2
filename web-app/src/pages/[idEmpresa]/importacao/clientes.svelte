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
    if (cnpj) return mask ? applyMask(cnpj, 'cnpj') : cnpj
    const idEstrangeiro = dest.idEstrangeiro
    return idEstrangeiro
  }

  type TCliente = { dest: any; status: status }

  let filteredDests: TCliente[] = scoped.nfes
    .filter((v) => v.dest)
    .map((v) => v.dest)
    .filter((v) => getDocumento(v))
    .filter((v) => v.xNome)
    .filter((v, i, a) => {
      const doc = getDocumento(v)
      return a.findIndex((k) => getDocumento(k) == doc) == i
    })
    .map((v) => {
      return { dest: v, status: status.aguardando } as TCliente
    })

  const destsColumn = $dbColumns.clientes
  Promise.all(
    filteredDests.map(async (v, i) => {
      const update = (status: status) => {
        filteredDests[i].status = status
        filteredDests = filteredDests
      }
      try {
        const id = getDocumento(v.dest)
        const docRef = destsColumn.doc(id)
        const resp = await docRef.get()
        if (resp.exists) throw new Error('Já registrado.')
        await docRef.set({ dest: v.dest })
        update(status.aceito)
      } catch (error) {
        console.log(error)
        update(status.recusado)
      }
    })
  ).then(() => (showActions = true))

  let showActions = false
</script>

<div class="container">
  <section>
    <h1>Análise de clientes</h1>
    <h2>
      Os clientes das notas fiscais são analisados e apenas aqueles que ainda
      não estão cadastrados serão registrados.
    </h2>
  </section>
  {#each filteredDests as dest}
    <span>
      {#if dest.status == status.recusado}
        Cliente não aceito
      {:else if dest.status == status.aceito}
        Cliente aceito
      {:else if dest.status == status.aguardando}
        Aguardando
      {/if}
    </span>
    <span>{dest.dest.xNome} ({getDocumento(dest.dest, true)})</span>
  {/each}
  {#if showActions}
    <a class="button" href={$url(scoped.getNext('./clientes'))}> Continuar </a>
  {/if}
</div>
