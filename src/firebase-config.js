import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBPeYs2fDKc3IHSvcIYK-IyFVsqF_3p4oo",
  authDomain: "book-management-system-94694.firebaseapp.com",
  projectId: "book-management-system-94694",
  storageBucket: "book-management-system-94694.appspot.com",
  messagingSenderId: "205095389087",
  appId: "1:205095389087:web:45a86cd866d70524389faa",
  measurementId: "G-E6D6KMKFMS"
};
console.log(firebaseConfig);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };