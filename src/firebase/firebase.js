// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApVPqf6imqKztNM24Gq2IetI-IOVatEdI",
  authDomain: "gpstracker-c2b73.firebaseapp.com",
  projectId: "gpstracker-c2b73",
  storageBucket: "gpstracker-c2b73.firebasestorage.app",
  messagingSenderId: "784090656146",
  appId: "1:784090656146:web:366eeb9be18b13dd19a54b",
  measurementId: "G-L09Y5S5BPK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth }