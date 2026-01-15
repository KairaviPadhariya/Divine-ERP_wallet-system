import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBct9FCr4QBf1dMFskdMpc6An1YCLVo9MM",
  authDomain: "divine-erp-2f495.firebaseapp.com",
  projectId: "divine-erp-2f495",
  storageBucket: "divine-erp-2f495.firebasestorage.app",
  messagingSenderId: "591837494342",
  appId: "1:591837494342:web:02fa4b325b064da7fb1e47"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
