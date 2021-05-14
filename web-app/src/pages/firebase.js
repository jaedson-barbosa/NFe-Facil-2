import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

if (typeof firebase === 'undefined') throw new Error('hosting/init-error: Firebase SDK not detected. You must include it before /__/firebase/init.js');
var firebaseConfig = {
  "projectId": "nfe-facil-980bc",
  "appId": "1:966949369760:web:7de508d5df6f8879dd56c5",
  "storageBucket": "nfe-facil-980bc.appspot.com",
  "locationId": "southamerica-east1",
  "apiKey": "AIzaSyAVyvaaQBSUF8y7kxrfLxg1v7u3JEP-6b4",
  "authDomain": "nfe-facil-980bc.firebaseapp.com",
  "messagingSenderId": "966949369760",
  "measurementId": "G-MJFSTKZX90"
};
if (firebaseConfig) {
  firebase.initializeApp(firebaseConfig);

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

    if (firebaseEmulators.database && typeof firebase.database === 'function') {
      firebase.database().useEmulator(firebaseEmulators.database.host, firebaseEmulators.database.port);
    }

    if (firebaseEmulators.firestore && typeof firebase.firestore === 'function') {
      firebase.firestore().useEmulator(firebaseEmulators.firestore.host, firebaseEmulators.firestore.port);
    }

    if (firebaseEmulators.functions && typeof firebase.functions === 'function') {
      firebase.functions().useEmulator(firebaseEmulators.functions.host, firebaseEmulators.functions.port);
    }

    if (firebaseEmulators.auth && typeof firebase.auth === 'function') {
      firebase.auth().useEmulator('http://' + firebaseEmulators.auth.host + ':' + firebaseEmulators.auth.port);
    }
  } else {
    console.log("To automatically connect the Firebase SDKs to running emulators, replace '/__/firebase/init.js' with '/__/firebase/init.js?useEmulator=true' in your index.html");
  }
}
export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();

export const db = firebase.firestore();