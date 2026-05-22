1 import { useState } from 'react';
     2 import { useHangout } from '../context/HangoutContext';
     3 import { Plus, Smile, X } from 'lucide-react';
     4
     5 const NotesBar = () => {
     6   const { currentUser, friends, setUserNote } = useHangout();
     7   const [isModalOpen, setIsModalOpen] = useState(false);
     8   const [customText, setCustomText] = useState('');
     9   const [selectedEmoji, setSelectedEmoji] = useState('✨');
    10
    11   if (!currentUser) return null;
    12
    13   const presetMoods = [
    14     { emoji: '✨', label: 'Vibing', text: 'Just vibing in the lounge' },
    15     { emoji: '☕', label: 'Chill', text: 'Coffee and chill chats' },
    16     { emoji: '💻', label: 'Grinding', text: 'Deep work, coding away' },
    17     { emoji: '😴', label: 'Sleepy', text: 'Running on 2 hours of sleep' },
    18     { emoji: '🎮', label: 'Gaming', text: 'Ready for lobbies!' },
    19     { emoji: '🔥', label: 'Hype', text: 'Feeling absolutely hyped!' }
    20   ];
    21
    22   const handleSubmit = (e) => {
    23     e.preventDefault();
    24     setUserNote(selectedEmoji, customText.trim() || 'No thoughts, head empty');
    25     setIsModalOpen(false);
    26   };
    27
    28   const selectPreset = (preset) => {
    29     setSelectedEmoji(preset.emoji);
    30     setCustomText(preset.text);
    31   };
    32
    33   return (
    34     <div className="notes-container">
    35       <div className="notes-scroll">
    36         <div className="note-bubble-item" onClick={() => setIsModalOpen(true)}>
    37           <div className="note-avatar-wrapper">
    38             <div className="avatar-gradient" style={{ background: currentUser.avatarBg }}>
    39               {currentUser.avatarChar}
    40             </div>
    41             <div className="user-note-badge">
    42               <Plus size={12} />
    43             </div>
    44             {currentUser.note && (
    45               <div className="thought-bubble user-thought">
    46                 <span className="thought-emoji">{currentUser.note.emoji}</span>
    47                 <span className="thought-text">{currentUser.note.text}</span>
    48               </div>
    49             )}
    50           </div>
    51           <span className="note-username">You</span>
    52         </div>
    53
    54         {friends.map((friend) => (
    55           friend.note && (
    56             <div key={friend.id} className="note-bubble-item">
    57               <div className="note-avatar-wrapper">
    58                 <div className="avatar-gradient" style={{ background: friend.avatarBg }}>
    59                   {friend.avatarChar}
    60                 </div>
    61                 <div className={`status-badge status-${friend.status}`}></div>
    62                 <div className="thought-bubble">
    63                   <span className="thought-emoji">{friend.note.emoji}</span>
    64                   <span className="thought-text">{friend.note.text}</span>
    65                 </div>
    66               </div>
    67               <span className="note-username">{friend.displayName}</span>
    68             </div>
    69           )
    70         ))}
    71       </div>
    72
    73       {isModalOpen && (
    74         <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
    75           <div className="modal-content glass-panel glass-panel-glow" onClick={(e) => e.stopPropagation()}>
    76             <div className="modal-header">
    77               <div className="modal-title-group">
    78                 <Smile className="modal-title-icon" />
    79                 <h3>What are you feeling now?</h3>
    80               </div>
    81               <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
    82                 <X size={18} />
    83               </button>
    84             </div>
    85
    86             <form onSubmit={handleSubmit}>
    87               <div className="status-input-wrapper">
    88                 <div className="status-emoji-selector">
    89                   <input
    90                     type="text"
    91                     value={selectedEmoji}
    92                     onChange={(e) => setSelectedEmoji(e.target.value)}
    93                     maxLength={2}
    94                     className="emoji-input"
    95                   />
    96                   <span className="emoji-input-hint">Emoji</span>
    97                 </div>
    98                 <div className="status-text-field">
    99                   <input
   100                     type="text"
   101                     placeholder="Share a quick thought with the circle..."
   102                     value={customText}
   103                     onChange={(e) => setCustomText(e.target.value)}
   104                     maxLength={35}
   105                     className="thought-input"
   106                     autoFocus
   107                   />
   108                   <span className="char-limit">{customText.length}/35</span>
   109                 </div>
   110               </div>
   111
   112               <div className="presets-label">Quick Vibes:</div>
   113               <div className="presets-grid">
   114                 {presetMoods.map((preset) => (
   115                   <button
   116                     key={preset.label}
   117                     type="button"
   118                     className={`preset-btn ${selectedEmoji === preset.emoji && customText === preset.text ?
       'active' : ''}`}
   119                     onClick={() => selectPreset(preset)}
   120                   >
   121                     <span className="preset-emoji">{preset.emoji}</span>
   122                     <span className="preset-text">{preset.label}</span>
   123                   </button>
   124                 ))}
   125               </div>
   126
   127               <div className="modal-actions">
   128                 <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
   129                   Cancel
   130                 </button>
   131                 <button type="submit" className="btn-primary">
   132                   Set Vibe
   133                 </button>
   134               </div>
   135             </form>
   136           </div>
   137         </div>
   138       )}
   139
   140       <style>{`
   141         .notes-container { padding: 16px 20px 12px 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.05);
       background: rgba(10, 10, 12, 0.2); overflow: visible; position: relative; z-index: 5; }
   142         .notes-scroll { display: flex; gap: 24px; overflow-x: auto; padding-top: 15px; padding-bottom: 4px;
       scrollbar-width: none; }
   143         .note-bubble-item { display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer;
       flex-shrink: 0; position: relative; }
   144         .note-avatar-wrapper { position: relative; width: 56px; height: 56px; }
   145         .avatar-gradient { width: 100%; height: 100%; border-radius: 50%; display: flex; align-items: center;
       justify-content: center; font-weight: 700; font-size: 1.25rem; color: #fff; border: 2px solid rgba(255, 255, 255,
       0.08); }
   146         .thought-bubble { position: absolute; top: -24px; left: 50%; transform: translateX(-50%); background:
       rgba(18, 18, 24, 0.9); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px; padding: 4px 10px;
       display: flex; align-items: center; gap: 6px; z-index: 10; }
   147         .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0,
       0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
   148         .modal-content { width: 90%; max-width: 480px; padding: 24px; background: rgba(15, 23, 42, 0.75); }
   149       `}</style>
   150     </div>
   151   );
   152 };
   153
   154 export default NotesBar;
  </details>
