1 import { createContext, useContext, useState, useEffect } from 'react';
    2 import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile }
      from 'firebase/auth';
    3 import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
    4 import { auth, db } from '../firebase/firebase';
    5
    6 const AuthContext = createContext(null);
    7 export const useAuth = () => useContext(AuthContext);
    8
    9 export const AuthProvider = ({ children }) => {
   10   const [currentUser, setCurrentUser] = useState(null);
   11   const [userProfile, setUserProfile] = useState(null);
   12   const [loading, setLoading] = useState(true);
   13
   14   useEffect(() => {
   15     return onAuthStateChanged(auth, async (user) => {
   16       setCurrentUser(user);
   17       if (user) {
   18         try {
   19           const docRef = doc(db, 'users', user.uid);
   20           const snap = await getDoc(docRef);
   21           if (snap.exists()) {
   22             setUserProfile(snap.data());
   23           } else {
   24             // AUTO-REPAIR: If profile is missing, create a default one
   25             const newProfile = {
   26               uid: user.uid,
   27               displayName: user.displayName || 'Friend',
   28               email: user.email,
   29               avatarBg: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
   30               avatarChar: (user.displayName || 'F').charAt(0).toUpperCase(),
   31               status: 'online',
   32               createdAt: serverTimestamp()
   33             };
   34             await setDoc(docRef, newProfile);
   35             setUserProfile(newProfile);
   36           }
   37         } catch (e) { console.error(e); }
   38       }
   39       setLoading(false);
   40     });
   41   }, []);
   42
   43   return (
   44     <AuthContext.Provider value={{ currentUser, userProfile, loading, logout: () => signOut(auth), login: (e, p) =>
      signInWithEmailAndPassword(auth, e, p), register: (e, p, d) => createUserWithEmailAndPassword(auth, e, p).then(async
      (res) => { await updateProfile(res.user, { displayName: d }); return res.user; }) }}>
   45       {children}
   46     </AuthContext.Provider>
   47   );
   48 };
