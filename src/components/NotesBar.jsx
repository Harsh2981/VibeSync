import { useState } from 'react';
import { useHangout } from '../context/HangoutContext';
import { Plus, Smile, X } from 'lucide-react';

const NotesBar = () => {
  const { currentUser, friends, setUserNote } = useHangout();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customText, setCustomText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('✨');

  if (!currentUser) return null;

  const presetMoods = [
    { emoji: '✨', label: 'Vibing', text: 'Just vibing in the lounge' },
    { emoji: '☕', label: 'Chill', text: 'Coffee and chill chats' },
    { emoji: '💻', label: 'Grinding', text: 'Deep work, coding away' },
    { emoji: '😴', label: 'Sleepy', text: 'Running on 2 hours of sleep' },
    { emoji: '🎮', label: 'Gaming', text: 'Ready for lobbies!' },
    { emoji: '🔥', label: 'Hype', text: 'Feeling absolutely hyped!' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserNote(selectedEmoji, customText.trim() || 'No thoughts, head empty');
    setIsModalOpen(false);
  };

  const selectPreset = (preset) => {
    setSelectedEmoji(preset.emoji);
    setCustomText(preset.text);
  };

  return (
    <div className="notes-container">
      <div className="notes-scroll">
        {/* User's Note Trigger */}
        <div className="note-bubble-item" onClick={() => setIsModalOpen(true)}>
          <div className="note-avatar-wrapper">
            <div className="avatar-gradient" style={{ background: currentUser.avatarBg }}>
              {currentUser.avatarChar}
            </div>
            <div className="user-note-badge">
              <Plus size={12} />
            </div>
            {currentUser.note && (
              <div className="thought-bubble user-thought">
                <span className="thought-emoji">{currentUser.note.emoji}</span>
                <span className="thought-text">{currentUser.note.text}</span>
              </div>
            )}
          </div>
          <span className="note-username">You</span>
        </div>

        {/* Friends' Notes */}
        {friends.map((friend) => (
          friend.note && (
            <div key={friend.id} className="note-bubble-item">
              <div className="note-avatar-wrapper">
                <div className="avatar-gradient" style={{ background: friend.avatarBg }}>
                  {friend.avatarChar}
                </div>
                <div className={`status-badge status-${friend.status}`}></div>
                <div className="thought-bubble">
                  <span className="thought-emoji">{friend.note.emoji}</span>
                  <span className="thought-text">{friend.note.text}</span>
                </div>
              </div>
              <span className="note-username">{friend.displayName}</span>
            </div>
          )
        ))}
      </div>

      {/* Preset Feelings Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content glass-panel glass-panel-glow" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <Smile className="modal-title-icon" />
                <h3>What are you feeling now?</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="status-input-wrapper">
                <div className="status-emoji-selector">
                  <input
                    type="text"
                    value={selectedEmoji}
                    onChange={(e) => setSelectedEmoji(e.target.value)}
                    maxLength={2}
                    className="emoji-input"
                  />
                  <span className="emoji-input-hint">Emoji</span>
                </div>
                <div className="status-text-field">
                  <input
                    type="text"
                    placeholder="Share a quick thought with the circle..."
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    maxLength={35}
                    className="thought-input"
                    autoFocus
                  />
                  <span className="char-limit">{customText.length}/35</span>
                </div>
              </div>

              <div className="presets-label">Quick Vibes:</div>
              <div className="presets-grid">
                {presetMoods.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    className={`preset-btn ${selectedEmoji === preset.emoji && customText === preset.text ? 'active' : ''}`}
                    onClick={() => selectPreset(preset)}
                  >
                    <span className="preset-emoji">{preset.emoji}</span>
                    <span className="preset-text">{preset.label}</span>
                  </button>
                ))}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Set Vibe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS styling specifically for NotesBar */}
      <style>{`
        .notes-container {
          padding: 16px 20px 12px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(10, 10, 12, 0.2);
          overflow: visible;
          position: relative;
          z-index: 5;
        }

        .notes-scroll {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          padding-top: 15px; /* space for bubbles */
          padding-bottom: 4px;
          scrollbar-width: none; /* Firefox */
        }

        .notes-scroll::-webkit-scrollbar {
          display: none; /* Safari/Chrome */
        }

        .note-bubble-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          flex-shrink: 0;
          position: relative;
        }

        .note-avatar-wrapper {
          position: relative;
          width: 56px;
          height: 56px;
        }

        .avatar-gradient {
          width: 100%;
          height: 100%;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.25rem;
          color: #fff;
          border: 2px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          transition: transform 0.2s;
        }

        .note-bubble-item:hover .avatar-gradient {
          transform: scale(1.05);
          border-color: hsl(var(--color-purple));
        }

        .user-note-badge {
          position: absolute;
          bottom: 0;
          right: 0;
          background: hsl(var(--color-purple));
          color: #fff;
          width: 20px;
          height: 20px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #000;
          box-shadow: 0 2px 6px rgba(168, 85, 247, 0.4);
        }

        .status-badge {
          position: absolute;
          bottom: 1px;
          right: 1px;
          width: 13px;
          height: 13px;
          border-radius: var(--radius-full);
          border: 2px solid #070709;
        }

        .status-online { background-color: #10b981; }
        .status-idle { background-color: #f59e0b; }
        .status-dnd { background-color: #ef4444; }

        .thought-bubble {
          position: absolute;
          top: -24px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(18, 18, 24, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: var(--radius-md);
          padding: 4px 10px;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 6px 15px rgba(0,0,0,0.5);
          white-space: nowrap;
          max-width: 140px;
          pointer-events: none;
          z-index: 10;
        }

        .thought-bubble::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          border-width: 5px 5px 0;
          border-style: solid;
          border-color: rgba(18, 18, 24, 0.9) transparent;
          display: block;
          width: 0;
        }

        .thought-emoji {
          font-size: 0.95rem;
        }

        .thought-text {
          font-size: 0.72rem;
          color: hsl(var(--text-primary));
          font-weight: 500;
          max-width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-thought {
          border-color: rgba(168, 85, 247, 0.35);
        }

        .note-username {
          font-size: 0.75rem;
          color: hsl(var(--text-secondary));
          font-weight: 500;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fade-in 0.25s ease-out;
        }

        .modal-content {
          width: 90%;
          max-width: 480px;
          padding: 24px;
          background: rgba(15, 23, 42, 0.75);
          position: relative;
          animation: slide-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .modal-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .modal-title-icon {
          color: hsl(var(--color-purple));
        }

        .modal-content h3 {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          color: hsl(var(--text-secondary));
          cursor: pointer;
          padding: 4px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close-btn:hover {
          background: rgba(255,255,255,0.05);
          color: #fff;
        }

        .status-input-wrapper {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 12px;
          border-radius: var(--radius-md);
        }

        .status-emoji-selector {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .emoji-input {
          width: 50px;
          height: 48px;
          background: rgba(168, 85, 247, 0.1);
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: var(--radius-sm);
          color: #fff;
          text-align: center;
          font-size: 1.5rem;
          outline: none;
        }

        .emoji-input-hint {
          font-size: 0.65rem;
          color: hsl(var(--text-muted));
        }

        .status-text-field {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .thought-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 1rem;
          padding: 8px 0;
          outline: none;
        }

        .thought-input:focus {
          border-color: hsl(var(--color-purple));
        }

        .char-limit {
          align-self: flex-end;
          font-size: 0.65rem;
          color: hsl(var(--text-muted));
          margin-top: 4px;
        }

        .presets-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: hsl(var(--text-secondary));
          margin-bottom: 10px;
        }

        .presets-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 28px;
        }

        .preset-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: hsl(var(--text-secondary));
          padding: 8px;
          border-radius: var(--radius-sm);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
        }

        .preset-btn:hover {
          background: rgba(168, 85, 247, 0.08);
          border-color: rgba(168, 85, 247, 0.25);
          color: #fff;
        }

        .preset-btn.active {
          background: rgba(168, 85, 247, 0.15);
          border-color: hsl(var(--color-purple));
          color: #fff;
          box-shadow: 0 0 10px rgba(168, 85, 247, 0.15);
        }

        .preset-emoji {
          font-size: 1.25rem;
        }

        .preset-text {
          font-size: 0.72rem;
          font-weight: 500;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }

        @media (max-width: 480px) {
          .presets-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default NotesBar;
