import { useState, useEffect } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HangoutProvider } from './context/HangoutContext';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ActiveMembers from './components/ActiveMembers';
import AuthScreen from './components/AuthScreen';

function AppContent() {
  const { currentUser, userProfile, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Simple global error listener for debugging
  useEffect(() => {
    const handleError = (event) => {
      console.error("Caught global error:", event.error);
      setHasError(true);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="loading-screen">
        <h2>Oops! Something went wrong.</h2>
        <button className="btn-primary" onClick={() => window.location.reload()}>
          Try Refreshing
        </button>
      </div>
    );
  }

  // Show loading while checking initial auth status
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="auth-loader" />
        <p>Entering the Lounge...</p>
      </div>
    );
  }

  // Show login/register screen if not authenticated
  if (!currentUser) {
    return <AuthScreen />;
  }

  // Show loading if we have a user but their profile is still fetching
  if (!userProfile) {
    return (
      <div className="loading-screen">
        <div className="auth-loader" />
        <p>Syncing your vibes...</p>
      </div>
    );
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
