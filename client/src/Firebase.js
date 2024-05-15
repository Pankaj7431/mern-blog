// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
console.log(import.meta.env.VITE_FIREBASE_API_KEY);
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-d2407.firebaseapp.com",
  projectId: "mern-blog-d2407",
  storageBucket: "mern-blog-d2407.appspot.com",
  messagingSenderId: "808542189421",
  appId: "1:808542189421:web:62e0fa4335cea02474cc64",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);