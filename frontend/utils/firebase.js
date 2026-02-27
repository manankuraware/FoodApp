// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: "vingo-food-delivery-b42c9.firebaseapp.com",
    projectId: "vingo-food-delivery-b42c9",
    storageBucket: "vingo-food-delivery-b42c9.firebasestorage.app",
    messagingSenderId: "1063915934917",
    appId: "1:1063915934917:web:336b690b4de1f4b32e4cac"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export { app, auth }