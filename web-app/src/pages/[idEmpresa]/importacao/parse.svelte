<script lang="ts">
  import { url } from '@roxi/routify'
  import * as parser from 'xml2json-light-es6module'
  import { dbColumns } from '@app/store'
  import type { IScoped } from './IScoped'
  import { status } from './status'

  export let scoped: IScoped

  type TNFe = { name: string; json?: any; status: status }

  const files = [...Array(scoped.files.length)].map((v, i) => scoped.files[i])
  let nfes: TNFe[] = files.map((v) => {
    return { name: v.name, status: status.aguardando } as TNFe
  })

  const nfesColumn = $dbColumns.notasEmitidas
  Promise.all(files.map(async (v, i) => {
    let json = undefined
    const update = (status: status) => {
      nfes[i].json = json
      nfes[i].status = status
      nfes = nfes
    }
    try {
      const xml = await v.text()
      json = parser.xml2json(xml)
      const infNFe = json.nfeProc.NFe.infNFe
      if (!infNFe.Id) throw new Error('Sem identificação.')
      const nfeRef = nfesColumn.doc(infNFe.Id)
      const salva = await nfeRef.get()
      if (salva.exists) throw new Error('Já registrada.')
      await nfeRef.set({
        cancelada: false,
        infNFe,
        dhEmi: new Date(infNFe.ide.dhEmi),
        nProt: json.nfeProc.protNFe.infProt.nProt,
        xml
      })
      update(status.aceito)
    } catch (error) {
      console.log(error)
      update(status.recusado)
    }
  })).then(() => {
    scoped.nfes = nfes
      .filter((v) => v.status == status.aceito)
      .map((v) => v.json.nfeProc.NFe.infNFe)
      .sort((a, b) => (a.ide.dhEmi > b.ide.dhEmi ? -1 : 1))
    showActions = true
  })

  let showActions = false
</script>

<div class="container is-fluid">
  <section class="section">
    <h1 class="title">Análise de NFes</h1>
    <h2 class="subtitle">
      Apenas notas válidas e que ainda não foram importadas podem prosseguir.
    </h2>
  </section>
  <div class="content">
    {#each nfes as nfe}
      <div class="icon-text">
        {#if nfe.status == status.recusado}
          <span class="icon has-text-danger">
            <i class="fas fa-ban" />
          </span>
          <span> NFe não aceita </span>
        {:else if nfe.status == status.aceito}
          <span class="icon has-text-success">
            <i class="fas fa-check" />
          </span>
          <span> NFe aceita </span>
        {:else if nfe.status == status.aguardando}
          <span class="icon has-text-info">
            <i class="fas fa-ellipsis-h" />
          </span>
          <span> Aguardando </span>
        {/if}
      </div>
      <p class="block">{nfe.name}</p>
    {/each}
  </div>
  {#if showActions}
    <a class="button" href={$url('./index')}> Voltar </a>
    <a
      class="button is-primary"
      href={$url(scoped.getNext())}
    >
      Continuar
    </a>
  {/if}
</div>
