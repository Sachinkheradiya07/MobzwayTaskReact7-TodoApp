import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD2zaVns72W389vFgJHv3rmCIHc97LHIug",
  authDomain: "reacttodoapp-8699a.firebaseapp.com",
  projectId: "reacttodoapp-8699a",
  storageBucket: "reacttodoapp-8699a.appspot.com",
  messagingSenderId: "1061307143223",
  appId: "1:1061307143223:web:d3a94920de4ef1b9e49bb2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
