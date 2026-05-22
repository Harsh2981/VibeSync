1 import { useState, useEffect } from 'react';
    2 import './App.css';
    3 import { AuthProvider, useAuth } from './context/AuthContext';
    4 import { HangoutProvider } from './context/HangoutContext';
    5 import Sidebar from './components/Sidebar';
    6 import ChatArea from './components/ChatArea';
    7 import ActiveMembers from './components/ActiveMembers';
    8 import AuthScreen from './components/AuthScreen';
    9
   10 function AppContent() {
   11   const { currentUser, userProfile, loading } = useAuth();
   12   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   13   const [isMembersOpen, setIsMembersOpen] = useState(false);
   14   const [hasError, setHasError] = useState(false);
   15
   16   useEffect(() => {
   17     const handleError = (event) => {
   18       console.error("Caught global error:", event.error);
   19       setHasError(true);
   20     };
   21     window.addEventListener('error', handleError);
   22     return () => window.removeEventListener('error', handleError);
   23   }, []);
   24
   25   if (hasError) {
   26     return (
   27       <div className="loading-screen">
   28         <h2>Oops! Something went wrong.</h2>
   29         <button className="btn-primary" onClick={() => window.location.reload()}>
   30           Try Refreshing
   31         </button>
   32       </div>
   33     );
   34   }
   35
   36   if (loading) {
   37     return (
   38       <div className="loading-screen">
   39         <div className="auth-loader" />
   40         <p>Entering the Lounge...</p>
   41       </div>
   42     );
   43   }
   44
   45   if (!currentUser) {
   46     return <AuthScreen />;
   47   }
   48
   49   if (!userProfile) {
   50     return (
   51       <div className="loading-screen">
   52         <div className="auth-loader" />
   53         <p>Syncing your vibes...</p>
   54       </div>
   55     );
   56   }
   57
   58   const toggleSidebar = () => {
   59     setIsSidebarOpen(prev => !prev);
   60     setIsMembersOpen(false);
   61   };
   62
   63   const toggleMembers = () => {
   64     setIsMembersOpen(prev => !prev);
   65     setIsSidebarOpen(false);
   66   };
   67
   68   return (
   69     <HangoutProvider>
   70       <div className="app-container">
   71         <Sidebar
   72           isMobileOpen={isSidebarOpen}
   73           setIsMobileOpen={setIsSidebarOpen}
   74         />
   75         <ChatArea
   76           onToggleSidebar={toggleSidebar}
   77           onToggleMembers={toggleMembers}
   78         />
   79         <ActiveMembers
   80           isOpen={isMembersOpen}
   81           setIsOpen={setIsMembersOpen}
   82         />
   83       </div>
   84     </HangoutProvider>
   85   );
   86 }
   87
   88 function App() {
   89   return (
   90     <AuthProvider>
   91       <AppContent />
   92     </AuthProvider>
   93   );
   94 }
   95
   96 export default App;
  </details>
