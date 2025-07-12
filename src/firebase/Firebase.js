import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCTqCDllRJ6H5xcnN-XoN9-MHrMlVvwjZc",
  authDomain: "mailbox-9747c.firebaseapp.com",
  databaseURL: "https://mailbox-9747c-default-rtdb.firebaseio.com", // ✅ MUST HAVE
  projectId: "mailbox-9747c",
  storageBucket: "mailbox-9747c.appspot.com",
  messagingSenderId: "945716095292",
  appId: "1:945716095292:web:6ab114b8fa500263ca9639"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app); // ✅ export this
