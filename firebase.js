import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB7-VUzX6d5dpN4BJ_D8msOYRXH8wqXy48",
  authDomain: "emergency-click-92008.firebaseapp.com",
  projectId: "emergency-click-92008",
  storageBucket: "emergency-click-92008.appspot.com",
  messagingSenderId: "844037616992",
  appId: "1:844037616992:web:ecfaaf093be1d7c5e3da05",
  databaseURL: "https://emergency-click-92008-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getDatabase(app);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
