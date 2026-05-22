import { useHangout } from '../context/HangoutContext';
import { Users, X } from 'lucide-react';

const ActiveMembers = ({ isOpen, setIsOpen }) => {
  const { friends, currentUser } = useHangout();

  // Group friends by status (Online vs Offline/Idle)
  const onlineFriends = friends.filter(f => f.status === 'online' || f.status === 'dnd' || f.status === 'idle');

  return (
    <>
      {/* Mobile drawer backdrop */}
      {isOpen && (
        <div className="mobile-members-backdrop" onClick={() => setIsOpen(false)} />
      )}

      <div className={`members-container glass-panel ${isOpen ? 'mobile-open' : ''}`}>
        
        <div className="members-header">
          <div className="members-header-title">
            <Users size={16} className="members-icon" />
            <h3>Circle Members</h3>
          </div>
          <span className="members-count-badge">{onlineFriends.length + 1}</span>
          
          <button className="members-close-btn" onClick={() => setIsOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="members-scrollable">
          
          {/* Online Category */}
          <div className="members-group">
            <h4 className="group-label">ONLINE — {onlineFriends.length + 1}</h4>
            <div className="members-list">
              
              {/* User row */}
              <div className="member-row">
                <div className="member-avatar-wrapper">
                  <div className="avatar-gradient" style={{ background: currentUser.avatarBg }}>
                    {currentUser.avatarChar}
                  </div>
                  <div className="status-dot status-online"></div>
                </div>
                <div className="member-info">
                  <div className="member-name-group">
                    <span className="member-name">{currentUser.name}</span>
                    <span className="role-tag" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>Owner</span>
                  </div>
                  {currentUser.note && (
                    <span className="member-thought">{currentUser.note.emoji} {currentUser.note.text}</span>
                  )}
                </div>
              </div>

              {/* Friends row */}
              {onlineFriends.map(friend => (
                <div key={friend.id} className="member-row">
                  <div className="member-avatar-wrapper">
                    <div className="avatar-gradient" style={{ background: friend.avatarBg }}>
                      {friend.avatarChar}
                    </div>
                    <div className={`status-dot status-${friend.status}`}></div>
                  </div>
                  <div className="member-info">
                    <div className="member-name-group">
                      <span className="member-name">{friend.name}</span>
                      <span className="role-tag" style={{ background: `rgba(255,255,255,0.05)`, color: friend.roleColor }}>{friend.role}</span>
                    </div>
                    {friend.note && (
                      <span className="member-thought">{friend.note.emoji} {friend.note.text}</span>
                    )}
                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>

      </div>

      <style>{`
        .members-container {
          width: 260px;
          height: 100vh;
          border-radius: 0;
          border: none;
          border-left: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(10, 10, 12, 0.6);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 100;
        }

        .members-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .members-header-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .members-icon {
          color: hsl(var(--color-purple));
        }

        .members-header h3 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #fff;
          font-family: 'Outfit', sans-serif;
        }

        .members-count-badge {
          background: rgba(255, 255, 255, 0.06);
          color: hsl(var(--text-secondary));
          font-size: 0.72rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          margin-left: 8px;
        }

        .members-close-btn {
          display: none;
          background: transparent;
          border: none;
          color: hsl(var(--text-muted));
          cursor: pointer;
          padding: 4px;
          border-radius: var(--radius-sm);
        }

        .members-close-btn:hover {
          color: #fff;
          background: rgba(255,255,255,0.05);
        }

        .members-scrollable {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
        }

        .members-group {
          margin-bottom: 24px;
        }

        .group-label {
          font-size: 0.68rem;
          font-weight: 700;
          color: hsl(var(--text-muted));
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .members-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .member-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 6px;
          border-radius: var(--radius-md);
          transition: background 0.2s;
          cursor: pointer;
        }

        .member-row:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .member-avatar-wrapper {
          position: relative;
          width: 36px;
          height: 36px;
          flex-shrink: 0;
        }

        .member-avatar-wrapper .avatar-gradient {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: 700;
          color: #fff;
        }

        .member-info {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .member-name-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .member-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: hsl(var(--text-primary));
        }

        .role-tag {
          font-size: 0.62rem;
          font-weight: 700;
          padding: 0.5px 5px;
          border-radius: var(--radius-sm);
          text-transform: uppercase;
          letter-spacing: 0.2px;
        }

        .member-thought {
          font-size: 0.68rem;
          color: hsl(var(--text-secondary));
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 160px;
          margin-top: 2px;
        }

        /* Responsive Mobile Drawer specifications */
        @media (max-width: 1024px) {
          .members-container {
            position: fixed;
            top: 0;
            right: 0;
            transform: translateX(100%);
            box-shadow: -10px 0 30px rgba(0,0,0,0.7);
            height: 100vh;
            z-index: 1000;
          }

          .members-container.mobile-open {
            transform: translateX(0);
          }

          .members-close-btn {
            display: flex;
          }

          .mobile-members-backdrop {
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

export default ActiveMembers;
