export function requisitar(name, requisicao, idToken) {
  return fetch(
    `http://localhost:5001/nfe-facil-980bc/us-central1/${name}`,
    {
      method: 'POST',
      body: JSON.stringify(requisicao),
      headers: { Authorization: 'Bearer ' + idToken },
    }
  )
}
