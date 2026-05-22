// Firebase configuration and initialization for VibeSync
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCQv-JhBbmIk0wDCGV3m06LJkvektPDInk",
  authDomain: "vibesync-7c103.firebaseapp.com",
  projectId: "vibesync-7c103",
  storageBucket: "vibesync-7c103.firebasestorage.app",
  messagingSenderId: "274968218360",
  appId: "1:274968218360:web:74bbbd8e82742e3442490d",
  measurementId: "G-0WRYD3KLZZ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
