import { FirebaseApp, initializeApp } from "firebase/app";
import dotenv from "dotenv";
import { Firestore } from "firebase/firestore/lite";

dotenv.config();

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "imascordhub-serve.firebaseapp.com",
  projectId: "imascordhub-serve",
  storageBucket: "imascordhub-serve.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: "G-LRLL91TWVT"
};

// Initialize Firebase

export const createAppContainer = (): FirebaseApp => {
  return initializeApp(firebaseConfig);
}

export const getFirestore = (app: FirebaseApp): Firestore => {
  return getFirestore(app);
}
