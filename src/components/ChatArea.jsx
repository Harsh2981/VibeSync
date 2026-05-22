import { useState, useEffect, useRef } from 'react';
import { useHangout } from '../context/HangoutContext';
import NotesBar from './NotesBar';
import StoriesBar from './StoriesBar';
import { 
  Menu, Users, Send, Paperclip, Smile, Image as ImageIcon, 
  Code, FileText 
} from 'lucide-react';

const ChatArea = ({ onToggleSidebar, onToggleMembers }) => {
  const { 
    activeChannelId, 
    channels, 
    messages, 
    sendMessage, 
    reactToMessage, 
    typingFriend 
  } = useHangout();

  const [inputMsg, setInputMsg] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const activeChannel = channels.find(c => c.id === activeChannelId) || { name: 'lounge', description: '' };

  const reactionPresets = ['🔥', '❤️', '😂', '💯', '👍', '✨'];

  const presetAttachments = [
    { label: 'Mock Sunset Photo', type: 'image', url: 'https://images.unsplash.com/photo-1472214222541-d510753a8707?auto=format&fit=crop&w=800&q=80' },
    { label: 'Mock Code File', type: 'code', text: '// Setup VibeSync Websocket Server\nconst io = require("socket.io")(3000);\nio.on("connection", socket => {\n  console.log("Friend joined the hangout room! 🚀");\n});' },
    { label: 'Mock Design Spec', type: 'document', text: 'VibeSync-Design-Specs-v2.pdf' }
  ];

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingFriend]);

  const formatTime = (ts) => {
    if (!ts) return '';
    const date = ts?.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const msg = inputMsg.trim();
    setInputMsg('');
    await sendMessage(msg);
  };

  const handleAttachMock = (attachment) => {
    if (attachment.type === 'image') {
      sendMessage('Shared a gorgeous photo! 📸🌄', attachment.url);
    } else if (attachment.type === 'code') {
      sendMessage(`Shared code snippets:\n\`\`\`javascript\n${attachment.text}\n\`\`\``);
    } else {
      sendMessage(`Uploaded Document: 📄 ${attachment.text}`);
    }
    setIsAttachmentOpen(false);
  };

  return (
    <div className="chat-container">
      
      {/* Channel Header */}
      <div className="chat-header">
        <button className="mobile-header-btn hamburger" onClick={onToggleSidebar}>
          <Menu size={20} />
        </button>

        <div className="chat-header-info">
          <span className="channel-hash">#</span>
          <h2>{activeChannel.name}</h2>
          <span className="divider">|</span>
          <p className="channel-desc">{activeChannel.description}</p>
        </div>

        <button className="mobile-header-btn members-toggle" onClick={onToggleMembers}>
          <Users size={20} />
        </button>
      </div>

      {/* Unified Feed Top Area: Feelings Notes + Stories (IG Feeds!) */}
      <div className="unified-highlights-area">
        <NotesBar />
        <StoriesBar />
      </div>

      {/* Scrollable Messages view */}
      <div className="chat-messages-area">
        <div className="messages-scroller">
          {messages.length === 0 ? (
            <div className="empty-chat-state">
              <span className="empty-symbol">#</span>
              <h3>Welcome to #{activeChannel.name}!</h3>
              <p>This is the start of the #{activeChannel.name} channel. Send a message to get the vibe going!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="message-wrapper">
                <div className="message-avatar" style={{ background: msg.avatarBg }}>
                  {msg.avatarChar}
                </div>
                <div className="message-content-group">
                  <div className="message-meta-row">
                    <span className="message-sender">{msg.senderName}</span>
                    <span className="message-time">{formatTime(msg.createdAt)}</span>
                  </div>
                  
                  {/* Handle formatted text (markdown codes etc) */}
                  <div className="message-text">
                    {msg.content.includes('```') ? (
                      <pre className="message-code-block">
                        <code>{msg.content.replace(/```[a-z]*/g, '').replace(/```/g, '')}</code>
                      </pre>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>

                  {/* Render Shared Mock Media */}
                  {msg.mediaUrl && (
                    <div className="message-media-attachment">
                      <img src={msg.mediaUrl} alt="Shared attachment" className="chat-attached-image" />
                    </div>
                  )}

                  {/* Reactions List */}
                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className="message-reactions-row">
                      {Object.entries(msg.reactions).map(([emoji, count]) => (
                        <button 
                          key={emoji} 
                          className="reaction-pill-badge"
                          onClick={() => reactToMessage(msg.id, emoji)}
                        >
                          <span className="reaction-emoji">{emoji}</span>
                          <span className="reaction-count">{count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Floating quick reaction bar on hover */}
                <div className="message-hover-actions">
                  {reactionPresets.map(emoji => (
                    <button 
                      key={emoji} 
                      className="hover-react-btn"
                      onClick={() => reactToMessage(msg.id, emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}

          {/* Typing Indicator */}
          {typingFriend && (
            <div className="message-wrapper typing-row">
              <div className="typing-indicator-dots">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
              <span className="typing-label-text">{typingFriend} is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat input form */}
      <div className="chat-input-panel">
        <form onSubmit={handleSend} className="chat-input-form-inner glass-panel">
          
          {/* Attachments Button */}
          <div className="input-action-wrapper">
            <button 
              type="button" 
              className={`input-action-btn ${isAttachmentOpen ? 'active' : ''}`}
              onClick={() => {
                setIsAttachmentOpen(!isAttachmentOpen);
                setIsEmojiPickerOpen(false);
              }}
              title="Attach File"
            >
              <Paperclip size={18} />
            </button>

            {/* Dropdown list for Mock Attachments */}
            {isAttachmentOpen && (
              <div className="attachment-dropdown glass-panel glass-panel-glow">
                <div className="dropdown-header">Mock Upload Files</div>
                {presetAttachments.map(attach => (
                  <button
                    key={attach.label}
                    type="button"
                    className="dropdown-item-btn"
                    onClick={() => handleAttachMock(attach)}
                  >
                    {attach.type === 'image' && <ImageIcon size={14} className="drop-icon img-i" />}
                    {attach.type === 'code' && <Code size={14} className="drop-icon code-i" />}
                    {attach.type === 'document' && <FileText size={14} className="drop-icon doc-i" />}
                    <span>{attach.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <input 
            type="text" 
            placeholder={`Message #${activeChannel.name}`}
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            className="chat-text-input"
          />

          {/* Emoji Reaction Drawer */}
          <div className="input-action-wrapper">
            <button 
              type="button" 
              className={`input-action-btn ${isEmojiPickerOpen ? 'active' : ''}`}
              onClick={() => {
                setIsEmojiPickerOpen(!isEmojiPickerOpen);
                setIsAttachmentOpen(false);
              }}
              title="Emoji Reactions"
            >
              <Smile size={18} />
            </button>

            {isEmojiPickerOpen && (
              <div className="emoji-picker-dropdown glass-panel glass-panel-glow">
                {reactionPresets.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    className="picker-emoji-btn"
                    onClick={() => {
                      setInputMsg(prev => prev + emoji);
                      setIsEmojiPickerOpen(false);
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="chat-submit-btn" disabled={!inputMsg.trim()}>
            <Send size={16} />
          </button>
        </form>
      </div>

      <style>{`
        .chat-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: transparent;
          position: relative;
          overflow: hidden;
        }

        /* Header area */
        .chat-header {
          height: 64px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          padding: 0 20px;
          gap: 12px;
          flex-shrink: 0;
          background: rgba(10, 10, 12, 0.3);
          backdrop-filter: blur(10px);
          z-index: 10;
        }

        .chat-header-info {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow: hidden;
        }

        .channel-hash {
          font-size: 1.5rem;
          color: hsl(var(--color-purple));
          font-weight: 800;
        }

        .chat-header h2 {
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          font-family: 'Outfit', sans-serif;
        }

        .divider {
          color: rgba(255, 255, 255, 0.1);
        }

        .channel-desc {
          font-size: 0.8rem;
          color: hsl(var(--text-secondary));
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Unified Feed layout */
        .unified-highlights-area {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
        }

        /* Messages scroller viewport */
        .chat-messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: rgba(0, 0, 0, 0.15);
        }

        .messages-scroller {
          display: flex;
          flex-direction: column;
          gap: 18px;
          min-height: 100%;
          justify-content: flex-end; /* push messages to bottom */
        }

        .empty-chat-state {
          padding: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 100%;
        }

        .empty-symbol {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(168, 85, 247, 0.1);
          color: hsl(var(--color-purple));
          font-size: 2.2rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          box-shadow: var(--shadow-glow-purple);
        }

        .empty-chat-state h3 {
          font-size: 1.35rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
        }

        .empty-chat-state p {
          font-size: 0.85rem;
          color: hsl(var(--text-secondary));
          max-width: 320px;
        }

        /* Message wrapper template */
        .message-wrapper {
          display: flex;
          gap: 14px;
          padding: 8px 12px;
          border-radius: var(--radius-md);
          position: relative;
          transition: background 0.15s;
          animation: message-appear 0.25s ease-out;
        }

        .message-wrapper:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .message-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }

        .message-content-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .message-meta-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }

        .message-sender {
          font-size: 0.88rem;
          font-weight: 700;
          color: #fff;
        }

        .message-time {
          font-size: 0.68rem;
          color: hsl(var(--text-muted));
        }

        .message-text p {
          font-size: 0.88rem;
          color: hsl(var(--text-primary));
          line-height: 1.45;
          word-break: break-word;
        }

        .message-code-block {
          background: rgba(5, 5, 8, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          margin-top: 6px;
          overflow-x: auto;
        }

        .message-code-block code {
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.8rem;
          color: hsl(var(--color-cyan));
        }

        .message-media-attachment {
          margin-top: 8px;
          max-width: 100%;
          width: 280px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid rgba(168, 85, 247, 0.15);
          box-shadow: 0 4px 15px rgba(0,0,0,0.4);
        }

        .chat-attached-image {
          width: 100%;
          display: block;
          object-fit: cover;
        }

        /* Message Reactions style */
        .message-reactions-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
        }

        .reaction-pill-badge {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-sm);
          padding: 2px 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
        }

        .reaction-pill-badge:hover {
          background: rgba(168, 85, 247, 0.1);
          border-color: rgba(168, 85, 247, 0.3);
        }

        .reaction-emoji {
          font-size: 0.8rem;
        }

        .reaction-count {
          font-size: 0.72rem;
          color: hsl(var(--text-secondary));
          font-weight: 600;
        }

        /* Hover floating reactions block */
        .message-hover-actions {
          position: absolute;
          top: -12px;
          right: 20px;
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: var(--radius-full);
          padding: 2px 6px;
          display: flex;
          gap: 4px;
          opacity: 0;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          transition: opacity 0.2s, transform 0.2s;
          transform: translateY(2px);
          z-index: 10;
        }

        .message-wrapper:hover .message-hover-actions {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }

        .hover-react-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 1.1rem;
          padding: 2px 4px;
          border-radius: 50%;
          transition: transform 0.15s;
        }

        .hover-react-btn:hover {
          transform: scale(1.3);
        }

        /* Typing indicators dots */
        .typing-row {
          align-items: center;
          gap: 12px;
          padding-left: 12px;
        }

        .typing-indicator-dots {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255, 255, 255, 0.05);
          padding: 8px 12px;
          border-radius: var(--radius-full);
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          background: hsl(var(--color-purple));
          border-radius: 50%;
          animation: pulse-ring 1s infinite alternate;
        }

        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        .typing-label-text {
          font-size: 0.75rem;
          color: hsl(var(--text-muted));
          font-weight: 500;
        }

        /* Inputs footer panel */
        .chat-input-panel {
          padding: 16px 20px 24px 20px;
          background: rgba(10, 10, 12, 0.3);
          flex-shrink: 0;
        }

        .chat-input-form-inner {
          display: flex;
          align-items: center;
          padding: 6px 10px;
          border-radius: var(--radius-md);
          background: rgba(15, 23, 42, 0.5);
          position: relative;
        }

        .chat-text-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 0.88rem;
          padding: 10px;
          outline: none;
        }

        .input-action-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-action-btn {
          background: transparent;
          border: none;
          color: hsl(var(--text-muted));
          cursor: pointer;
          width: 34px;
          height: 34px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .input-action-btn:hover,
        .input-action-btn.active {
          color: hsl(var(--color-purple));
          background: rgba(168, 85, 247, 0.08);
        }

        .chat-submit-btn {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          border: none;
          background: linear-gradient(135deg, hsl(var(--color-purple)) 0%, hsl(var(--color-pink)) 100%);
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, opacity 0.2s;
          box-shadow: 0 2px 10px rgba(168, 85, 247, 0.3);
        }

        .chat-submit-btn:disabled {
          background: rgba(255,255,255,0.05);
          color: hsl(var(--text-muted));
          cursor: not-allowed;
          box-shadow: none;
          opacity: 0.6;
        }

        .chat-submit-btn:not(:disabled):hover {
          transform: scale(1.04);
        }

        /* Mock attachments dropdown styled */
        .attachment-dropdown {
          position: absolute;
          bottom: 46px;
          left: 0;
          width: 200px;
          background: rgba(15, 23, 42, 0.95);
          padding: 8px;
          z-index: 100;
          animation: slide-up 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dropdown-header {
          font-size: 0.68rem;
          font-weight: 700;
          color: hsl(var(--text-muted));
          padding: 4px 8px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .dropdown-item-btn {
          width: 100%;
          background: transparent;
          border: none;
          text-align: left;
          padding: 8px 10px;
          border-radius: var(--radius-sm);
          color: hsl(var(--text-secondary));
          cursor: pointer;
          font-size: 0.78rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .dropdown-item-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }

        .drop-icon {
          flex-shrink: 0;
        }

        .img-i { color: #f43f5e; }
        .code-i { color: hsl(var(--color-cyan)); }
        .doc-i { color: #f59e0b; }

        /* Emoji reactions dropdown */
        .emoji-picker-dropdown {
          position: absolute;
          bottom: 46px;
          right: 0;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 6px;
          padding: 8px;
          width: 220px;
          background: rgba(15, 23, 42, 0.95);
          z-index: 100;
          animation: slide-up 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .picker-emoji-btn {
          background: transparent;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          transition: transform 0.15s;
          padding: 4px;
          border-radius: 4px;
        }

        .picker-emoji-btn:hover {
          transform: scale(1.2);
          background: rgba(255,255,255,0.05);
        }

        /* Mobile adaptives */
        @media (max-width: 1024px) {
          .chat-header {
            justify-content: space-between;
          }
          .mobile-header-btn.hamburger,
          .mobile-header-btn.members-toggle {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatArea;
