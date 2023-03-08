
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "ryzen-91900.firebaseapp.com",
  projectId: "ryzen-91900",
  storageBucket: "ryzen-91900.appspot.com",
  messagingSenderId: "923061075647",
  appId: "1:923061075647:web:5a6aa4c71f271ce45a900a",
  measurementId: "G-XFK9C32YYY"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app);
