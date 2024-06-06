// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGepLVM8e6HCyf8eLqF9PaLUFT607RIAs",
  authDomain: "mern-blog-d2407.firebaseapp.com",
  projectId: "mern-blog-d2407",
  storageBucket: "mern-blog-d2407.appspot.com",
  messagingSenderId: "808542189421",
  appId: "1:808542189421:web:62e0fa4335cea02474cc64"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);