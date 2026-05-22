 1 import { initializeApp } from "firebase/app";
    2 import { getAuth } from "firebase/auth";
    3 import { getFirestore } from "firebase/firestore";
    4 import { getStorage } from "firebase/storage";
    5
    6 const firebaseConfig = {
    7   apiKey: "AIzaSyCQv-JhBbmIk0wDCGV3m06LJkvektPDInk",
    8   authDomain: "vibesync-7c103.firebaseapp.com",
    9   projectId: "vibesync-7c103",
   10   storageBucket: "vibesync-7c103.firebasestorage.app",
   11   messagingSenderId: "274968218360",
   12   appId: "1:274968218360:web:74bbbd8e82742e3442490d",
   13   measurementId: "G-0WRYD3KLZZ"
   14 };
   15
   16 const app = initializeApp(firebaseConfig);
   17 export const auth = getAuth(app);
   18 export const db = getFirestore(app);
   19 export const storage = getStorage(app);
   20 export default app;
