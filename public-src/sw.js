import firebase from 'firebase/app'
import 'firebase/functions'
import 'firebase/auth'

const app = firebase.initializeApp({
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
    return new Promise((resolve, reject) => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            unsubscribe();
            if (user) user.getIdToken().then((idToken) => resolve(idToken), (error) => resolve(null));
            else resolve(null);
        });
    });
};

const getOriginFromUrl = (url) => {
    // https://stackoverflow.com/questions/1420881/how-to-extract-base-url-from-a-string-in-javascript
    const pathArray = url.split('/');
    const protocol = pathArray[0];
    const host = pathArray[2];
    return protocol + '//' + host;
};

// Get underlying body if available. Works for text and json bodies.
const getBodyContent = (req) => {
    return Promise.resolve().then(() => {
        if (req.method !== 'GET') {
            if (req.headers.get('Content-Type').indexOf('json') !== -1) {
                return req.json()
                    .then((json) => {
                        return JSON.stringify(json);
                    });
            } else {
                return req.text();
            }
        }
    }).catch((error) => {
        // Ignore error.
    });
};

self.addEventListener('fetch', (evt) => {
    const requestProcessor = (idToken) => {
        const needLogin = new URL(evt.request.url).pathname.startsWith('/painel.html')
        if (needLogin && !idToken) return Response.redirect('./login.html')
        let req = evt.request;
        console.log(`Token: ${idToken}; Url: ${req.url}`)
        console.log(evt.request.url)
        let processRequestPromise = Promise.resolve();
        // For same origin https requests, append idToken to header.
        if ((self.location.origin == getOriginFromUrl(evt.request.url) || evt.request.url.includes('nfe-facil-980bc')) &&
            (self.location.protocol == 'https:' || self.location.hostname == 'localhost')
            && idToken) {
            // Clone headers as request headers are immutable.
            const headers = new Headers();
            req.headers.forEach((val, key) => {
                headers.append(key, val);
            });
            // Add ID token to header.
            console.log('Added token')
            headers.append('Authorization', 'Bearer ' + idToken);
            processRequestPromise = getBodyContent(req).then((body) => {
                try {
                    req = new Request(req.url, {
                        method: req.method,
                        headers: headers,
                        credentials: req.credentials,
                        cache: req.cache,
                        redirect: req.redirect,
                        referrer: req.referrer,
                        body,
                        // bodyUsed: req.bodyUsed,
                        // context: req.context
                    });
                } catch (e) {
                    // This will fail for CORS requests. We just continue with the
                    // fetch caching logic below and do not pass the ID token.
                }
            });
        }
        return processRequestPromise.then(() => {
            return fetch(req);
        });
    };
    evt.respondWith(getIdToken().then(requestProcessor, requestProcessor));
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});