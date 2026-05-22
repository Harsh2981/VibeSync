 1 import { useState } from 'react';
    2 import { AuthProvider, useAuth } from './context/AuthContext';
    3 import { HangoutProvider } from './context/HangoutContext';
    4 import Sidebar from './components/Sidebar';
    5 import ChatArea from './components/ChatArea';
    6 import ActiveMembers from './components/ActiveMembers';
    7 import AuthScreen from './components/AuthScreen';
    8 import './App.css';
    9
   10 function AppContent() {
   11   const { currentUser, userProfile, loading } = useAuth();
   12   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   13   const [isMembersOpen, setIsMembersOpen] = useState(false);
   14
   15   if (loading) return <div style={{color:'white', textAlign:'center', marginTop:'20%'}}>Loading VibeSync...</div>;
   16   if (!currentUser) return <AuthScreen />;
   17
   18   return (
   19     <HangoutProvider>
   20       <div className="app-container">
   21         <Sidebar isMobileOpen={isSidebarOpen} setIsMobileOpen={setIsSidebarOpen} />
   22         <ChatArea onToggleSidebar={() => setIsSidebarOpen(true)} onToggleMembers={() => setIsMembersOpen(true)} />
   23         <ActiveMembers isOpen={isMembersOpen} setIsOpen={setIsMembersOpen} />
   24       </div>
   25     </HangoutProvider>
   26   );
   27 }
   28
   29 export default function App() {
   30   return (
   31     <AuthProvider>
   32       <AppContent />
   33     </AuthProvider>
   34   );
   35 }
