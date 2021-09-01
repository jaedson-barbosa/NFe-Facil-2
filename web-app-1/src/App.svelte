<script>
  import { Router } from '@roxi/routify'
  import { routes } from '../.routify/routes'

  import { initializeApp } from 'firebase/app'

  const firebaseConfig = {
    apiKey: "AIzaSyAVyvaaQBSUF8y7kxrfLxg1v7u3JEP-6b4",
    authDomain: "nfe-facil-980bc.firebaseapp.com",
    projectId: "nfe-facil-980bc",
    storageBucket: "nfe-facil-980bc.appspot.com",
    messagingSenderId: "966949369760",
    appId: "1:966949369760:web:7de508d5df6f8879dd56c5"
  };

  initializeApp(firebaseConfig)
</script>

<Router {routes} />

<style global>
  tbody > tr.clicavel {
    cursor: pointer;
  }

  tbody > tr.marcado {
    background-color: #e1e1e1;
  }
</style>