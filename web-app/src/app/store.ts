import { auth, googleProvider } from './firebase';
import { derived, readable, writable } from 'svelte/store'

export const user = {
	subscribe: readable<firebase.default.User>(undefined, (set) => {
		const unsubscribe = auth.onAuthStateChanged(u => set(u))
		return () => unsubscribe()
	}).subscribe,
	signIn: () => auth.signInWithPopup(googleProvider), //auth.signInAnonymously(),
	signOut: () => auth.signOut()
}
