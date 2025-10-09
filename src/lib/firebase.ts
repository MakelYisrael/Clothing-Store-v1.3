// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAkONo3PzKXEyLOYhPmavD6A9bYkali9yw",
  authDomain: "authentication-23067.firebaseapp.com",
  projectId: "authentication-23067",
  appId: "1:298353931477:web:d731711620dd53a7b65e5c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
