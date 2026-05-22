import { useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HangoutProvider } from './context/HangoutContext';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ActiveMembers from './components/ActiveMembers';
import AuthScreen from './components/AuthScreen';

function AppContent() {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);

  // Show login/register screen if not authenticated
  if (!currentUser) {
    return <AuthScreen />;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
    setIsMembersOpen(false);
  };

  const toggleMembers = () => {
    setIsMembersOpen(prev => !prev);
    setIsSidebarOpen(false);
  };

  return (
    <HangoutProvider>
      <div className="app-container">
        <Sidebar
          isMobileOpen={isSidebarOpen}
          setIsMobileOpen={setIsSidebarOpen}
        />
        <ChatArea
          onToggleSidebar={toggleSidebar}
          onToggleMembers={toggleMembers}
        />
        <ActiveMembers
          isOpen={isMembersOpen}
          setIsOpen={setIsMembersOpen}
        />
      </div>
    </HangoutProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
