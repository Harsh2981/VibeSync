import { useState } from 'react';
import { useHangout } from '../context/HangoutContext';
import { useAuth } from '../context/AuthContext';
import { 
  Hash, Volume2, Mic, MicOff, Headphones, 
  Settings, Compass, Plus, Sparkles, LogOut 
} from 'lucide-react';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { logout } = useAuth();
  const { 
    currentUser, 
    channels, 
    activeChannelId, 
    setActiveChannelId, 
    voiceMembers, 
    toggleVoiceLounge, 
    isMuted, 
    setIsMuted, 
    isDeafened, 
    setIsDeafened,
    speakers,
    friends
  } = useHangout();

  const [textOpen, setTextOpen] = useState(true);
  const [voiceOpen, setVoiceOpen] = useState(true);

  if (!currentUser) return null;

  const getVoiceMemberDetails = (memberId) => {
    if (memberId === 'user') return currentUser;
    return friends.find(f => f.id === memberId);
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isMobileOpen && (
        <div className="mobile-sidebar-backdrop" onClick={() => setIsMobileOpen(false)} />
      )}

      <div className={`sidebar-container glass-panel ${isMobileOpen ? 'mobile-open' : ''}`}>
        
        {/* Leftmost Server Icon strip (Discord layout style) */}
        <div className="servers-strip">
          <div className="server-icon-wrapper active">
            <div className="server-icon active-glow">
              <Sparkles size={20} />
            </div>
            <div className="server-active-pill" />
          </div>

          <div className="server-icon-wrapper">
            <div className="server-icon hover-glow">
              <Compass size={20} />
            </div>
          </div>

          <div className="server-icon-wrapper">
            <div className="server-icon hover-glow add-icon">
              <Plus size={20} />
            </div>
          </div>
        </div>

        {/* Second channels strip */}
        <div className="channels-strip">
          
          {/* Header */}
          <div className="channels-header">
            <h3>VibeSync Space</h3>
            <span className="badge-neon-purple">Vibe: Active</span>
          </div>

          {/* Text Channels List */}
          <div className="channel-category">
            <div className="category-header" onClick={() => setTextOpen(!textOpen)}>
              <span>{textOpen ? '▼' : '▶'} TEXT CHANNELS</span>
              <Plus size={13} className="add-channel-icon" />
            </div>
            {textOpen && (
              <div className="channels-list">
                {channels.map((chan) => (
                  <div 
                    key={chan.id} 
                    className={`channel-item ${activeChannelId === chan.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveChannelId(chan.id);
                      setIsMobileOpen(false); // Auto close sidebar on mobile tap
                    }}
                  >
                    <Hash size={16} className="channel-icon" />
                    <span className="channel-name">{chan.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Voice Channels List */}
          <div className="channel-category">
            <div className="category-header" onClick={() => setVoiceOpen(!voiceOpen)}>
              <span>{voiceOpen ? '▼' : '▶'} VOICE CHANNELS</span>
              <Plus size={13} className="add-channel-icon" />
            </div>
            {voiceOpen && (
              <div className="channels-list">
                <div 
                  className={`channel-item voice-item ${voiceMembers.includes('user') ? 'voice-active' : ''}`}
                  onClick={toggleVoiceLounge}
                >
                  <Volume2 size={16} className="channel-icon" />
                  <span className="channel-name">Voice Lounge</span>
                  {voiceMembers.length > 0 && (
                    <span className="voice-count">{voiceMembers.length} joined</span>
                  )}
                </div>

                {/* Sub-list of people active in voice */}
                {voiceMembers.length > 0 && (
                  <div className="voice-connected-users">
                    {voiceMembers.map((memberId) => {
                      const member = getVoiceMemberDetails(memberId);
                      if (!member) return null;
                      const isSpeaking = speakers[memberId];
                      
                      return (
                        <div key={memberId} className="voice-user-row">
                          <div 
                            className="voice-user-avatar" 
                            style={{ 
                              background: member.avatarBg,
                              border: isSpeaking ? '2.5px solid hsl(var(--color-cyan))' : '1.5px solid rgba(255,255,255,0.1)'
                            }}
                          >
                            {member.avatarChar}
                          </div>
                          <span className={`voice-user-name ${isSpeaking ? 'speaking-text' : ''}`}>
                            {member.displayName}
                          </span>

                          {/* Sound wave visualizer for speaking users */}
                          {isSpeaking && (
                            <div className="voice-waves">
                              <span className="voice-bar"></span>
                              <span className="voice-bar"></span>
                              <span className="voice-bar"></span>
                            </div>
                          )}

                          {memberId === 'user' && isMuted && (
                            <MicOff size={11} className="voice-mute-icon" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Voice Lounge Status Panel */}
          {voiceMembers.includes('user') && (
            <div className="voice-active-panel glass-panel">
              <div className="voice-panel-info">
                <div className="voice-signal-group">
                  <Volume2 size={16} className="voice-panel-signal" />
                  <div className="voice-signal-text">
                    <span className="voice-signal-status">Voice Connected</span>
                    <span className="voice-signal-sub text-muted">Active Lounge</span>
                  </div>
                </div>
              </div>
              <div className="voice-panel-controls">
                <button 
                  className={`voice-ctrl-btn ${isMuted ? 'active' : ''}`}
                  onClick={() => setIsMuted(!isMuted)}
                  title={isMuted ? "Unmute Mic" : "Mute Mic"}
                >
                  {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
                <button 
                  className={`voice-ctrl-btn ${isDeafened ? 'active' : ''}`}
                  onClick={() => setIsDeafened(!isDeafened)}
                  title={isDeafened ? "Undeafen Audio" : "Deafen Audio"}
                >
                  <Headphones size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Collapsible User Profile Panel */}
          <div className="sidebar-user-panel">
            <div className="user-panel-left">
              <div className="avatar-gradient" style={{ background: currentUser.avatarBg }}>
                {currentUser.avatarChar}
                <div className="status-indicator status-online" />
              </div>
              <div className="user-profile-details">
                <span className="user-display-name">{currentUser.displayName}</span>
                {currentUser.note && (
                  <span className="user-feeling-sub">{currentUser.note.emoji} {currentUser.note.text}</span>
                )}
              </div>
            </div>
            <div style={{display:'flex', gap:'6px'}}>
              <button className="user-settings-btn" title="Settings">
                <Settings size={16} />
              </button>
              <button
                className="user-settings-btn"
                title="Sign Out"
                onClick={logout}
                style={{color:'#ef4444'}}
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>

        </div>

      </div>

      <style>{`
        .sidebar-container {
          display: flex;
          height: 100vh;
          width: 320px;
          border-radius: 0;
          border: none;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(10, 10, 12, 0.6);
          position: relative;
          z-index: 100;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Server Icon strip styled like Discord */
        .servers-strip {
          width: 72px;
          background: rgba(5, 5, 8, 0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 16px 0;
          border-right: 1px solid rgba(255, 255, 255, 0.03);
          flex-shrink: 0;
        }

        .server-icon-wrapper {
          position: relative;
          width: 48px;
          height: 48px;
          cursor: pointer;
        }

        .server-icon {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: hsl(var(--text-secondary));
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .server-icon-wrapper:hover .server-icon,
        .server-icon-wrapper.active .server-icon {
          border-radius: 14px;
          color: #fff;
        }

        .active-glow {
          background: linear-gradient(135deg, hsl(var(--color-purple)) 0%, hsl(var(--color-pink)) 100%);
          box-shadow: var(--shadow-glow-purple);
        }

        .hover-glow:hover {
          background: rgba(13, 202, 240, 0.1);
          border-color: hsl(var(--color-cyan));
          color: hsl(var(--color-cyan));
        }

        .add-icon {
          border-style: dashed;
        }

        .server-active-pill {
          position: absolute;
          left: -4px;
          top: 14px;
          width: 8px;
          height: 20px;
          background: #fff;
          border-radius: 0 4px 4px 0;
          transition: height 0.25s;
        }

        /* Channels content list */
        .channels-strip {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 16px 8px 12px 12px;
          overflow-y: auto;
          position: relative;
        }

        .channels-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 8px 20px 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          margin-bottom: 16px;
        }

        .channels-header h3 {
          font-size: 1rem;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          color: #fff;
        }

        .channel-category {
          margin-bottom: 20px;
        }

        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.72rem;
          font-weight: 700;
          color: hsl(var(--text-muted));
          cursor: pointer;
          padding: 4px 8px;
          letter-spacing: 0.5px;
          transition: color 0.2s;
        }

        .category-header:hover {
          color: hsl(var(--text-secondary));
        }

        .add-channel-icon {
          opacity: 0;
          transition: opacity 0.2s;
        }

        .category-header:hover .add-channel-icon {
          opacity: 0.8;
        }

        .channels-list {
          display: flex;
          flex-direction: column;
          gap: 3px;
          margin-top: 6px;
        }

        .channel-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: var(--radius-md);
          color: hsl(var(--text-secondary));
          cursor: pointer;
          font-weight: 500;
          font-size: 0.85rem;
          transition: all 0.2s;
        }

        .channel-item:hover {
          background: rgba(255, 255, 255, 0.03);
          color: #fff;
        }

        .channel-item.active {
          background: rgba(168, 85, 247, 0.15);
          border: 1px solid rgba(168, 85, 247, 0.1);
          color: #fff;
          font-weight: 600;
        }

        .channel-icon {
          color: hsl(var(--text-muted));
          transition: color 0.2s;
        }

        .channel-item.active .channel-icon {
          color: hsl(var(--color-purple));
        }

        .voice-active {
          background: rgba(13, 202, 240, 0.12) !important;
          color: #fff !important;
          border: 1px solid rgba(13, 202, 240, 0.15) !important;
        }

        .voice-active .channel-icon {
          color: hsl(var(--color-cyan)) !important;
        }

        .voice-count {
          margin-left: auto;
          font-size: 0.68rem;
          color: hsl(var(--color-cyan));
          background: rgba(13, 202, 240, 0.12);
          padding: 1px 6px;
          border-radius: var(--radius-sm);
        }

        /* Voice Users row nested */
        .voice-connected-users {
          margin-left: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 6px 0;
          border-left: 1px solid rgba(255, 255, 255, 0.05);
          padding-left: 10px;
        }

        .voice-user-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px;
        }

        .voice-user-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.65rem;
          font-weight: 700;
          color: #fff;
        }

        .voice-user-name {
          font-size: 0.78rem;
          color: hsl(var(--text-secondary));
          font-weight: 500;
        }

        .speaking-text {
          color: hsl(var(--color-cyan));
          font-weight: 600;
        }

        .voice-mute-icon {
          color: #ef4444;
          margin-left: auto;
        }

        /* Voice Sound Wave animation */
        .voice-waves {
          display: flex;
          align-items: flex-end;
          gap: 2.5px;
          height: 18px;
          margin-left: auto;
        }

        .voice-bar {
          width: 2px;
          background: hsl(var(--color-cyan));
          border-radius: var(--radius-full);
          height: 4px;
          animation: wave-speak 0.8s ease-in-out infinite;
        }

        .voice-bar:nth-child(2) { animation-delay: 0.15s; }
        .voice-bar:nth-child(3) { animation-delay: 0.3s; }

        /* Voice Lounge active widget */
        .voice-active-panel {
          position: absolute;
          bottom: 72px;
          left: 12px;
          right: 12px;
          background: rgba(15, 23, 42, 0.85);
          padding: 10px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 10;
          animation: slide-up 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .voice-panel-info {
          display: flex;
          align-items: center;
        }

        .voice-signal-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .voice-panel-signal {
          color: #10b981;
          animation: pulse-ring 2s infinite;
        }

        .voice-signal-text {
          display: flex;
          flex-direction: column;
        }

        .voice-signal-status {
          font-size: 0.78rem;
          font-weight: 600;
          color: #10b981;
        }

        .voice-signal-sub {
          font-size: 0.65rem;
        }

        .voice-panel-controls {
          display: flex;
          gap: 6px;
        }

        .voice-ctrl-btn {
          width: 30px;
          height: 30px;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: hsl(var(--text-secondary));
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .voice-ctrl-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .voice-ctrl-btn.active {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }

        /* User profile widget static at bottom */
        .sidebar-user-panel {
          margin-top: auto;
          background: rgba(5, 5, 8, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: var(--radius-md);
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .user-panel-left {
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
        }

        .user-panel-left .avatar-gradient {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: 700;
          color: #fff;
          position: relative;
          flex-shrink: 0;
        }

        .status-indicator {
          position: absolute;
          bottom: -1px;
          right: -1px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid #000;
        }

        .user-profile-details {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .user-display-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: #fff;
        }

        .user-feeling-sub {
          font-size: 0.65rem;
          color: hsl(var(--text-secondary));
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 150px;
        }

        .user-settings-btn {
          background: transparent;
          border: none;
          color: hsl(var(--text-muted));
          cursor: pointer;
          padding: 6px;
          border-radius: var(--radius-sm);
          transition: all 0.2s;
        }

        .user-settings-btn:hover {
          color: #fff;
          background: rgba(255,255,255,0.05);
        }

        /* PC / Mobile drawer layout styling */
        @media (max-width: 1024px) {
          .sidebar-container {
            position: fixed;
            top: 0;
            left: 0;
            transform: translateX(-100%);
            box-shadow: 10px 0 30px rgba(0,0,0,0.7);
            height: 100vh;
            z-index: 1000;
          }

          .sidebar-container.mobile-open {
            transform: translateX(0);
          }

          .mobile-sidebar-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            z-index: 950;
            animation: fade-in 0.25s ease-out;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
