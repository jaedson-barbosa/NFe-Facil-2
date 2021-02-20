import firebase from 'firebase/app'
import 'firebase/functions'
import 'firebase/auth'

firebase.initializeApp({
    "projectId": "nfe-facil-980bc",
    "appId": "1:966949369760:web:7de508d5df6f8879dd56c5",
    "storageBucket": "nfe-facil-980bc.appspot.com",
    "locationId": "southamerica-east1",
    "apiKey": "AIzaSyAVyvaaQBSUF8y7kxrfLxg1v7u3JEP-6b4",
    "authDomain": "nfe-facil-980bc.firebaseapp.com",
    "messagingSenderId": "966949369760"
});

var firebaseEmulators = {
    "auth": {
        "host": "localhost",
        "port": 9099
    },
    "firestore": {
        "host": "localhost",
        "port": 8080
    },
    "functions": {
        "host": "localhost",
        "port": 5001
    }
};
if (firebaseEmulators) {
    console.log("Automatically connecting Firebase SDKs to running emulators:");
    Object.keys(firebaseEmulators).forEach(function (key) {
        console.log('\t' + key + ': http://' + firebaseEmulators[key].host + ':' + firebaseEmulators[key].port);
    });

    if (firebaseEmulators.functions && typeof firebase.functions === 'function') {
        firebase.functions().useEmulator(firebaseEmulators.functions.host, firebaseEmulators.functions.port);
    }

    if (firebaseEmulators.auth && typeof firebase.auth === 'function') {
        firebase.auth().useEmulator('http://' + firebaseEmulators.auth.host + ':' + firebaseEmulators.auth.port);
    }
} else {
    console.log("To automatically connect the Firebase SDKs to running emulators, replace '/__/firebase/init.js' with '/__/firebase/init.js?useEmulator=true' in your index.html");
}

const getIdToken = () => {
    return new Promise((res) => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            unsubscribe();
            if (user) user.getIdToken().then(res, () => res(undefined));
            else res(undefined);
        });
    });
};

self.addEventListener('fetch', (evt) => {
    evt.respondWith(async function () {
        const idToken = await getIdToken()
        const needLogin = new URL(evt.request.url).pathname.startsWith('/painel.html')
        if (needLogin && !idToken) return Response.redirect('./login.html')

        return fetch(evt.request.url.includes('nfe-facil-980bc') && idToken
            ? new Request(evt.request,
                {
                    headers: {
                        ...evt.request.headers,
                        Authorization: 'Bearer ' + idToken
                    }
                })
            : evt.request)
    }());
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});