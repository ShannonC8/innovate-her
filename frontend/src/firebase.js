// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCq4xexej3Dg8-sB3m0ZDN9rqpfmLw3RFs",
  authDomain: "uplife-4b5f9.firebaseapp.com",
  projectId: "uplife-4b5f9",
  storageBucket: "uplife-4b5f9.firebasestorage.app",
  messagingSenderId: "920743294610",
  appId: "1:920743294610:web:a70f230c0f6b5b3748d84b",
  measurementId: "G-GQVHKGSM8Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);