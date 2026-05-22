/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from 'react';
import {
  collection, doc, addDoc, updateDoc, onSnapshot,
  query, orderBy, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from './AuthContext';

const HangoutContext = createContext(null);

export const useHangout = () => {
  const context = useContext(HangoutContext);
  if (!context) throw new Error('useHangout must be used within HangoutProvider');
  return context;
};

// Static channels list
const CHANNELS = [
  { id: 'lounge', name: 'lounge', type: 'text', description: 'The main cozy spot for random banter and memes' },
  { id: 'general', name: 'general', type: 'text', description: 'General updates and conversations' },
  { id: 'gaming-den', name: 'gaming-den', type: 'text', description: 'Coordinating lobbies, sharing clips, and gaming talk' },
  { id: 'playlist-share', name: 'playlist-share', type: 'text', description: 'Drop your favorite tunes and current bangers' },
  { id: 'visual-diary', name: 'visual-diary', type: 'text', description: 'Sharing snapshots of our days, vibes, and design work' },
];

export const HangoutProvider = ({ children }) => {
  const { currentUser, userProfile, setUserProfile } = useAuth();

  const [channels] = useState(CHANNELS);
  const [activeChannelId, setActiveChannelId] = useState('lounge');
  const [messages, setMessages] = useState([]);
  const [onlineMembers, setOnlineMembers] = useState([]);
  const [stories, setStories] = useState([]);
  const [typingFriend] = useState(null);

  // Voice lounge (still simulated — real voice needs WebRTC which is a whole project)
  const [voiceMembers, setVoiceMembers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [speakers, setSpeakers] = useState({});

  // ─── Render-phase state resets ─────────────────────────────────────────────
  const [prevActiveChannelId, setPrevActiveChannelId] = useState(activeChannelId);
  if (activeChannelId !== prevActiveChannelId) {
    setMessages([]);
    setPrevActiveChannelId(activeChannelId);
  }

  const [prevVoiceMembers, setPrevVoiceMembers] = useState(voiceMembers);
  if (!voiceMembers.includes('user') && prevVoiceMembers.includes('user')) {
    setSpeakers({});
    setPrevVoiceMembers(voiceMembers);
  } else if (voiceMembers !== prevVoiceMembers) {
    setPrevVoiceMembers(voiceMembers);
  }

  // ─── Mark current user as online on mount ─────────────────────────────────
  useEffect(() => {
    if (!currentUser || !userProfile) return;

    const userRef = doc(db, 'users', currentUser.uid);
    updateDoc(userRef, { status: 'online' }).catch(() => {});

    // Mark offline on tab close
    const handleUnload = () => updateDoc(userRef, { status: 'offline' }).catch(() => {});
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [currentUser, userProfile]);

  // ─── Listen to all users (members panel + notes bar) ──────────────────────
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      const users = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(u => u.id !== currentUser?.uid); // exclude self
      setOnlineMembers(users);
    });
    return unsub;
  }, [currentUser]);

  // ─── Listen to messages in active channel (real-time) ─────────────────────
  useEffect(() => {
    if (!activeChannelId) return;

    const q = query(
      collection(db, 'channels', activeChannelId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsub = onSnapshot(q, (snap) => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
    });
    return unsub;
  }, [activeChannelId]);

  // ─── Listen to stories (real-time) ────────────────────────────────────────
  useEffect(() => {
    const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const s = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setStories(s);
    });
    return unsub;
  }, []);

  // ─── Voice lounge soundwave simulation ────────────────────────────────────
  useEffect(() => {
    if (!voiceMembers.includes('user')) return;
    const interval = setInterval(() => {
      const state = {};
      voiceMembers.forEach(m => { state[m] = Math.random() > 0.4; });
      setSpeakers(state);
    }, 1000);
    return () => clearInterval(interval);
  }, [voiceMembers, isMuted]);

  // ─── Send a message ────────────────────────────────────────────────────────
  const sendMessage = async (content, mediaUrl = null) => {
    if (!content.trim() && !mediaUrl) return;
    if (!currentUser || !userProfile) return;

    await addDoc(collection(db, 'channels', activeChannelId, 'messages'), {
      senderId: currentUser.uid,
      senderName: userProfile.displayName,
      avatarBg: userProfile.avatarBg,
      avatarChar: userProfile.avatarChar,
      content,
      mediaUrl: mediaUrl || null,
      reactions: {},
      createdAt: serverTimestamp()
    });
  };

  // ─── React to a message ───────────────────────────────────────────────────
  const reactToMessage = async (messageId, emoji) => {
    const msgRef = doc(db, 'channels', activeChannelId, 'messages', messageId);
    // Read current reactions and increment
    const current = messages.find(m => m.id === messageId);
    if (!current) return;
    const updatedReactions = { ...current.reactions };
    updatedReactions[emoji] = (updatedReactions[emoji] || 0) + 1;
    await updateDoc(msgRef, { reactions: updatedReactions });
  };

  // ─── Update user's feeling/note ───────────────────────────────────────────
  const setUserNote = async (emoji, text) => {
    if (!currentUser) return;
    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, { note: { emoji, text } });
    setUserProfile(prev => ({ ...prev, note: { emoji, text } }));
  };

  // ─── Add a story ──────────────────────────────────────────────────────────
  const addStory = async (type, content, background = null) => {
    if (!currentUser || !userProfile) return;
    await addDoc(collection(db, 'stories'), {
      friendId: currentUser.uid,
      friendName: userProfile.displayName,
      avatarBg: userProfile.avatarBg,
      avatarChar: userProfile.avatarChar,
      createdAt: serverTimestamp(),
      items: [{
        id: Date.now().toString(),
        type,
        timestamp: 'Just now',
        ...(type === 'text'
          ? { content, background }
          : { src: content, content: 'Captured a moment 📸✨' })
      }]
    });
  };

  // ─── Voice lounge toggle ──────────────────────────────────────────────────
  const toggleVoiceLounge = () => {
    if (voiceMembers.includes('user')) {
      setVoiceMembers([]);
    } else {
      setVoiceMembers(['user']);
    }
  };

  return (
    <HangoutContext.Provider value={{
      currentUser: userProfile, // expose profile as currentUser for components
      channels,
      activeChannelId,
      setActiveChannelId,
      messages,
      sendMessage,
      reactToMessage,
      onlineMembers,       // real friends from Firestore
      friends: onlineMembers,
      stories,
      addStory,
      voiceMembers,
      toggleVoiceLounge,
      isMuted, setIsMuted,
      isDeafened, setIsDeafened,
      typingFriend,
      speakers,
      setUserNote
    }}>
      {children}
    </HangoutContext.Provider>
  );
};
