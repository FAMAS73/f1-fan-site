// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDexaX8hDkpB4P41g_3KpLrRo5i6WneOWw",
  authDomain: "f1-fan-site-next-js.firebaseapp.com",
  projectId: "f1-fan-site-next-js",
  storageBucket: "f1-fan-site-next-js.appspot.com",
  messagingSenderId: "57033051103",
  appId: "1:57033051103:web:f0637e743fd7c91502d26a",
  measurementId: "G-1XZG86VHPB",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);

const auth = getAuth(app);

export {
  db,
  auth,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
};