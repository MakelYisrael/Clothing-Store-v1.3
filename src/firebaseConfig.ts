// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkONo3PzKXEyLOYhPmavD6A9bYkali9yw",
  authDomain: "authentication-23067.firebaseapp.com",
  projectId: "authentication-23067",
  storageBucket: "authentication-23067.firebasestorage.app",
  messagingSenderId: "298353931477",
  appId: "1:298353931477:web:d731711620dd53a7b65e5c",
  measurementId: "G-YDZ76L3CRL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
