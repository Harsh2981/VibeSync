/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Gradient options for avatars - auto assigned on signup
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
  'linear-gradient(135deg, #0dcaf0 0%, #0d6efd 100%)',
  'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
  'linear-gradient(135deg, #10b981 0%, #6ee7b7 100%)',
  'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register new user
  const register = async (email, password, displayName) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update auth profile displayName
    await updateProfile(user, { displayName });

    // Pick a random gradient for their avatar
    const randomGrad = AVATAR_GRADIENTS[Math.floor(Math.random() * AVATAR_GRADIENTS.length)];
    const avatarChar = displayName.charAt(0).toUpperCase();

    // Create user profile doc in Firestore
    const profileData = {
      uid: user.uid,
      displayName,
      email,
      avatarBg: randomGrad,
      avatarChar,
      status: 'online',
      note: { emoji: '✨', text: 'Just joined VibeSync!' },
      createdAt: serverTimestamp()
    };

    await setDoc(doc(db, 'users', user.uid), profileData);
    setUserProfile(profileData);
    return user;
  };

  // Login existing user
  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          } else {
            // Auto-repair: create profile if missing
            const randomGrad = AVATAR_GRADIENTS[Math.floor(Math.random() * AVATAR_GRADIENTS.length)];
            const repairProfile = {
              uid: user.uid,
              displayName: user.displayName || 'Friend',
              email: user.email,
              avatarBg: randomGrad,
              avatarChar: (user.displayName || 'F').charAt(0).toUpperCase(),
              status: 'online',
              createdAt: serverTimestamp()
            };
            await setDoc(docRef, repairProfile);
            setUserProfile(repairProfile);
          }
        } catch (err) {
          console.error("Profile error:", err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      userProfile,
      setUserProfile,
      register, 
      login, 
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
