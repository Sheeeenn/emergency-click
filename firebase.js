import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB7-VUzX6d5dpN4BJ_D8msOYRXH8wqXy48",
  authDomain: "emergency-click-92008.firebaseapp.com",
  projectId: "emergency-click-92008",
  storageBucket: "emergency-click-92008.firebasestorage.app",
  messagingSenderId: "844037616992",
  appId: "1:844037616992:web:ecfaaf093be1d7c5e3da05"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };