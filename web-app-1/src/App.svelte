<script>
  import { Router } from '@roxi/routify'
  import { routes } from '../.routify/routes'

  import { initializeApp } from 'firebase/app'
  import { enableIndexedDbPersistence, getFirestore } from 'firebase/firestore'

  const firebaseConfig = {
    apiKey: 'AIzaSyAVyvaaQBSUF8y7kxrfLxg1v7u3JEP-6b4',
    authDomain: 'nfe-facil-980bc.firebaseapp.com',
    projectId: 'nfe-facil-980bc',
    storageBucket: 'nfe-facil-980bc.appspot.com',
    messagingSenderId: '966949369760',
    appId: '1:966949369760:web:7de508d5df6f8879dd56c5',
  }

  initializeApp(firebaseConfig)
  const db = getFirestore()
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
      console.warn('Mais de uma aba aberta ao mesmo tempo.')
    } else if (err.code == 'unimplemented') {
      console.warn('Navegador não suporta o modo offline')
    } else {
      console.error(err.message)
    }
  })
</script>

<Router {routes} />
