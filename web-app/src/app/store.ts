import { auth, googleProvider } from './firebase';
import { readable } from 'svelte/store'

function createUser() {
	const { subscribe } = readable<firebase.default.User>(undefined, (set) => {
    const unsubscribe = auth.onAuthStateChanged(u => set(u))
    return () => unsubscribe()
  })

	return {
		subscribe,
		signIn: () => auth.signInAnonymously(), //auth.signInWithPopup(googleProvider),
		signOut: () => auth.signOut()
	};
}

export const user = createUser()