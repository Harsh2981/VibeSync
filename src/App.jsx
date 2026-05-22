 1 import { useState } from 'react';
    2 import { AuthProvider, useAuth } from './context/AuthContext';
    3 import { HangoutProvider } from './context/HangoutContext';
    4 import Sidebar from './components/Sidebar';
    5 import ChatArea from './components/ChatArea';
    6 import ActiveMembers from './components/ActiveMembers';
    7 import AuthScreen from './components/AuthScreen';
    8 import './App.css';
    9
   10 const DebugScreen = ({ msg }) => (
   11   <div style={{ height: '100vh', width: '100vw', background: '#0a0a0c', color: 'white', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
   12     <div style={{ width: '40px', height: '40px', border: '4px solid #a855f7', borderTopColor: 'transparent',
      borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
   13     <p style={{ marginTop: '20px', fontSize: '18px' }}>{msg}</p>
   14     <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
   15   </div>
   16 );
   17
   18 function AppContent() {
   19   const { currentUser, userProfile, loading } = useAuth();
   20   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   21   const [isMembersOpen, setIsMembersOpen] = useState(false);
   22
   23   if (loading) return <DebugScreen msg="Entering the Lounge..." />;
   24   if (!currentUser) return <AuthScreen />;
   25   if (!userProfile) return <DebugScreen msg="Creating your profile..." />;
   26
   27   return (
   28     <HangoutProvider>
   29       <div className="app-container">
   30         <Sidebar isMobileOpen={isSidebarOpen} setIsMobileOpen={setIsSidebarOpen} />
   31         <ChatArea onToggleSidebar={() => setIsSidebarOpen(true)} onToggleMembers={() => setIsMembersOpen(true)} />
   32         <ActiveMembers isOpen={isMembersOpen} setIsOpen={setIsMembersOpen} />
   33       </div>
   34     </HangoutProvider>
   35   );
   36 }
   37
   38 export default function App() {
   39   return (
   40     <AuthProvider>
   41       <AppContent />
   42     </AuthProvider>
   43   );
   44 }
