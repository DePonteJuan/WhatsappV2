import firebase from "firebase"
const firebaseConfig = {
  apiKey: "AIzaSyDXfwJnkvkm1j90IuY8vR6btfXXGhEWvB0",
  authDomain: "whatsappv2-aac9a.firebaseapp.com",
  projectId: "whatsappv2-aac9a",
  storageBucket: "whatsappv2-aac9a.appspot.com",
  messagingSenderId: "17793597492",
  appId: "1:17793597492:web:e21b902483792b93e58a61"
};
const app = !firebase.apps.length 
? firebase.initializeApp(firebaseConfig)
: firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider }
