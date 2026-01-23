// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "foodigo-89311.firebaseapp.com",
  projectId: "foodigo-89311",
  storageBucket: "foodigo-89311.firebasestorage.app",
  messagingSenderId: "657292903594",
  appId: "1:657292903594:web:ab6b9486a52396c7b1fcd3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export { auth, app}