import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    signOut(auth);
    setUserProfile(null);
    setCurrentUser(null);
    window.location.reload(); 
  };

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const docRef = doc(db, 'users', user.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            setUserProfile(snap.data());
          } else {
            const newProf = {
              uid: user.uid,
              displayName: user.displayName || 'New Friend',
              email: user.email,
              avatarBg: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              avatarChar: (user.displayName || 'U').charAt(0).toUpperCase(),
              status: 'online',
              createdAt: serverTimestamp()
            };
            await setDoc(docRef, newProf);
            setUserProfile(newProf);
          }
        } catch (e) {
          console.error("Firestore Error:", e);
          setUserProfile({ uid: user.uid, displayName: user.displayName || 'User' });
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  
  const register = async (email, password, displayName) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(res.user, { displayName });
    return res.user;
  };

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, logout, login, register }}>
      {children}
    </AuthContext.Provider>
  );
};
