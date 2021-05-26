import { user } from '@app/store'
import { get } from 'svelte/store'

export async function requisitar(name, requisicao) {
  const idToken = await get(user).getIdToken()
  return fetch(
    `http://localhost:5001/nfe-facil-980bc/us-central1/${name}`,
    {
      method: 'POST',
      body: JSON.stringify(requisicao),
      headers: { Authorization: 'Bearer ' + idToken },
    }
  )
}
