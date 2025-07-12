// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTqCDllRJ6H5xcnN-XoN9-MHrMlVvwjZc",
  authDomain: "mailbox-9747c.firebaseapp.com",
  projectId: "mailbox-9747c",
  storageBucket: "mailbox-9747c.firebasestorage.app",
  messagingSenderId: "945716095292",
  appId: "1:945716095292:web:6ab114b8fa500263ca9639"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);