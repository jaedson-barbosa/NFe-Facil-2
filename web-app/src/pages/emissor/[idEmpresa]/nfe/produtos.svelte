<script lang="ts">
  import { url, goto } from '@sveltech/routify'
  import { elementosNFe } from '@form/dataHelper'
  import List from '@form/formElements/List.svelte'
  import { createId } from '@form/formElements/helpers';
  import { db } from '@app/firebase'

  export let scoped: { commom: { root: any } }
  export let idEmpresa: string

  const listId = createId()
  let options = []
  let busca = ''

  $: validValue = busca && options.some((v) => v.text == busca)

  async function buscar() {
    const queryResult = await db
      .collection('empresas')
      .doc(idEmpresa)
      .collection('produtos')
      .where('det.prod.xProd', '>=', busca)
      .where(
        'det.prod.xProd',
        '<',
        busca.replace(/.$/, (c) => String.fromCharCode(c.charCodeAt(0) + 1))
      )
      .limit(10)
      .get()
    options = queryResult.docs.map((v) => {
      return {
        value: v,
        text: v.get('det.prod.xProd'),
      }
    })
  }

  function submit(criar: (newEl: any) => void) {
    if (!busca) {
      criar({})
    } else if (validValue) {
      const option = options.find((v) => v.text == busca)
      const data = option.value.data()
      criar(data)
    } else buscar()
  }
</script>

<div class="container content box">
  <form on:submit|preventDefault={$goto('../total')}>
    <List el={elementosNFe[6]} root={scoped.commom.root}>
      <form let:criar on:submit|preventDefault={() => submit(criar)} slot="header" class="block">
        <div class="field has-addons">
          <div class="control">
            <a class="button" href={$url('../nfe')}>
              <span class="icon is-small">
                <i class="fas fa-plus" />
              </span>
            </a>
          </div>
          <div class="control is-expanded">
            <input
              class="input"
              type="text"
              list={listId}
              placeholder="Nome"
              bind:value={busca}
            />
            <datalist id={listId}>
              {#each options as opt}
                <option>{opt.text}</option>
              {/each}
            </datalist>
          </div>
          <div class="control">
            <button class="button">
              {#if !busca || validValue}
              Adicionar
              {:else}
              Buscar
              {/if}
            </button>
          </div>
        </div>
      </form>
    </List>
    <div class="field is-grouped is-grouped-centered">
      <p class="control">
        <a href={$url('../opcionais1')} class="button is-danger">
          Voltar: Opcionais 1
        </a>
      </p>
      <p class="control">
        <button class="button is-primary"> Próximo: Totais </button>
      </p>
    </div>
  </form>
</div>
