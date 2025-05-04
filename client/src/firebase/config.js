import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOcPNEyfCkoTBz1h69QojAKFjwu-96B-0",
  authDomain: "remit-5de3e.firebaseapp.com",
  projectId: "remit-5de3e",
  storageBucket: "remit-5de3e.firebasestorage.app",
  messagingSenderId: "397050239046",
  appId: "1:397050239046:web:13425463826663b9ead247",
  measurementId: "G-N8RQYDRRZE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
