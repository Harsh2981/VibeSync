import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

const StoryModal = ({ story, onClose, onNextStory, onPrevStory }) => {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [particles, setParticles] = useState([]);
  const progressInterval = useRef(null);
  
  const currentItem = story.items[activeItemIndex];
  const STORY_DURATION = 5000; // 5 seconds per slide

  // Reset progress during render when slide changes
  const [prevActiveItemIndex, setPrevActiveItemIndex] = useState(activeItemIndex);
  const [prevStoryId, setPrevStoryId] = useState(story.id);

  if (activeItemIndex !== prevActiveItemIndex || story.id !== prevStoryId) {
    setPrevActiveItemIndex(activeItemIndex);
    setPrevStoryId(story.id);
    setProgress(0);
  }

  const handleNextItem = useCallback(() => {
    if (activeItemIndex < story.items.length - 1) {
      setActiveItemIndex(prev => prev + 1);
    } else {
      // End of this friend's stories, go to next friend's stories
      onNextStory();
    }
  }, [activeItemIndex, story.items.length, onNextStory]);

  const handlePrevItem = useCallback(() => {
    if (activeItemIndex > 0) {
      setActiveItemIndex(prev => prev - 1);
    } else {
      // Go to previous friend's stories
      onPrevStory();
    }
  }, [activeItemIndex, onPrevStory]);

  // Handle slide timing and progression
  useEffect(() => {
    if (isPaused) {
      if (progressInterval.current) clearInterval(progressInterval.current);
      return;
    }

    const startTime = Date.now();
    const intervalTime = 50; // update progress every 50ms

    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = (elapsed / STORY_DURATION) * 100;

      if (calculatedProgress >= 100) {
        clearInterval(progressInterval.current);
        handleNextItem();
      } else {
        setProgress(calculatedProgress);
      }
    }, intervalTime);

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [activeItemIndex, isPaused, story, handleNextItem]);

  // Pause on click-and-hold (or touch-and-hold)
  const handleMouseDown = () => setIsPaused(true);
  const handleMouseUp = () => setIsPaused(false);

  // Spawn reaction particles
  const spawnReaction = (emoji) => {
    const id = Date.now() + Math.random();
    const newParticle = {
      id,
      emoji,
      left: Math.random() * 60 + 20, // random percentage from 20% to 80%
      animDuration: Math.random() * 1.5 + 1.5 // 1.5s to 3s
    };
    
    setParticles(prev => [...prev, newParticle]);
    
    // Remove particle after animation ends
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id));
    }, 3000);
  };

  const reactionEmojis = ['🔥', '❤️', '😂', '😮', '😢', '💯'];

  return (
    <div className="story-overlay" onClick={onClose}>
      <div 
        className="story-container" 
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        {/* Progress Bars Indicator */}
        <div className="progress-bars-container">
          {story.items.map((item, idx) => (
            <div key={item.id} className="progress-bar-track">
              <div 
                className="progress-bar-fill" 
                style={{
                  width: idx < activeItemIndex ? '100%' : idx === activeItemIndex ? `${progress}%` : '0%',
                  transition: idx === activeItemIndex && progress === 0 ? 'none' : 'width 0.05s linear'
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="story-header">
          <div className="story-user-info">
            <div className="story-avatar" style={{ background: story.avatarBg }}>
              {story.avatarChar}
            </div>
            <div className="story-meta">
              <span className="story-username">{story.friendName}</span>
              <span className="story-time">{currentItem.timestamp}</span>
            </div>
          </div>
          <div className="story-actions">
            <button className="story-action-btn" onClick={() => setIsPaused(!isPaused)}>
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
            </button>
            <button className="story-action-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Story Content Area */}
        <div className="story-viewport">
          {currentItem.type === 'text' ? (
            <div className="story-text-content" style={{ background: currentItem.background || 'linear-gradient(135deg, #1e1e24 0%, #0c0c0f 100%)' }}>
              <p>{currentItem.content}</p>
            </div>
          ) : (
            <div className="story-image-content">
              <img src={currentItem.src} alt="Story Card" className="story-image" />
              {currentItem.content && (
                <div className="story-caption-overlay">
                  <p>{currentItem.content}</p>
                </div>
              )}
            </div>
          )}

          {/* Left/Right Click Nav Panels for easy navigation */}
          <div className="story-nav-panel left-panel" onClick={(e) => { e.stopPropagation(); handlePrevItem(); }}>
            <ChevronLeft size={24} />
          </div>
          <div className="story-nav-panel right-panel" onClick={(e) => { e.stopPropagation(); handleNextItem(); }}>
            <ChevronRight size={24} />
          </div>
        </div>

        {/* Floating Particles Canvas Overlay */}
        <div className="particle-layer">
          {particles.map(p => (
            <div 
              key={p.id} 
              className="floating-emoji" 
              style={{
                left: `${p.left}%`,
                animationDuration: `${p.animDuration}s`
              }}
            >
              {p.emoji}
            </div>
          ))}
        </div>

        {/* Reaction Bar */}
        <div className="story-footer" onClick={(e) => e.stopPropagation()}>
          <div className="quick-reply-wrapper">
            <input 
              type="text" 
              placeholder="Send quick reaction..." 
              className="quick-reply-input"
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  spawnReaction('💬');
                  e.target.value = '';
                }
              }}
            />
          </div>
          <div className="reaction-emojis-list">
            {reactionEmojis.map(emoji => (
              <button 
                key={emoji} 
                className="story-emoji-btn" 
                onClick={() => spawnReaction(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .story-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(5, 5, 8, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: fade-in 0.2s ease-out;
        }

        .story-container {
          position: relative;
          width: 100%;
          max-width: 420px;
          height: 100%;
          max-height: 800px;
          background: #000;
          border-radius: var(--radius-lg);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 40px rgba(168, 85, 247, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Progress Indicators */
        .progress-bars-container {
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          display: flex;
          gap: 6px;
          z-index: 20;
        }

        .progress-bar-track {
          flex: 1;
          height: 3px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: #fff;
          width: 0;
          border-radius: var(--radius-full);
        }

        /* Story Header */
        .story-header {
          position: absolute;
          top: 24px;
          left: 16px;
          right: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 20;
          pointer-events: auto;
        }

        .story-user-info {
          display: flex;
          align-items: center;
          gap: 10px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.6);
        }

        .story-avatar {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #fff;
          border: 1.5px solid #fff;
        }

        .story-meta {
          display: flex;
          flex-direction: column;
        }

        .story-username {
          font-size: 0.85rem;
          font-weight: 600;
          color: #fff;
        }

        .story-time {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .story-actions {
          display: flex;
          gap: 8px;
        }

        .story-action-btn {
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .story-action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        /* Story Viewport Content */
        .story-viewport {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .story-text-content {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          text-align: center;
        }

        .story-text-content p {
          font-size: 1.6rem;
          font-weight: 800;
          line-height: 1.4;
          color: #fff;
          text-shadow: 0 4px 15px rgba(0,0,0,0.5);
          font-family: 'Outfit', sans-serif;
        }

        .story-image-content {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .story-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .story-caption-overlay {
          position: absolute;
          bottom: 120px;
          left: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 14px;
          border-radius: var(--radius-md);
          color: #fff;
          font-size: 0.9rem;
          line-height: 1.35;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }

        /* Left/Right nav panels */
        .story-nav-panel {
          position: absolute;
          top: 0;
          height: 100%;
          width: 25%;
          display: flex;
          align-items: center;
          opacity: 0;
          cursor: pointer;
          transition: opacity 0.2s;
          z-index: 15;
        }

        .left-panel {
          left: 0;
          justify-content: flex-start;
          padding-left: 10px;
        }

        .right-panel {
          right: 0;
          justify-content: flex-end;
          padding-right: 10px;
        }

        .story-nav-panel:hover {
          opacity: 0.35;
        }

        .story-nav-panel svg {
          color: #fff;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
        }

        /* Reaction Particles Overlay */
        .particle-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 30;
          overflow: hidden;
        }

        @keyframes emoji-float-up {
          0% {
            transform: translateY(100vh) scale(0.6) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(80vh) scale(1.1) rotate(15deg);
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-10vh) scale(0.8) rotate(-45deg);
            opacity: 0;
          }
        }

        .floating-emoji {
          position: absolute;
          bottom: 0;
          font-size: 2.2rem;
          animation-name: emoji-float-up;
          animation-timing-function: cubic-bezier(0.08, 0.82, 0.17, 1);
          animation-fill-mode: forwards;
        }

        /* Story Footer */
        .story-footer {
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%);
          padding: 16px;
          padding-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          z-index: 25;
        }

        .quick-reply-wrapper {
          width: 100%;
        }

        .quick-reply-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: var(--radius-full);
          padding: 12px 18px;
          color: #fff;
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .quick-reply-input:focus {
          border-color: hsl(var(--color-purple));
          background: rgba(255, 255, 255, 0.12);
        }

        .reaction-emojis-list {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .story-emoji-btn {
          background: transparent;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          transition: transform 0.2s;
          padding: 4px;
          border-radius: var(--radius-sm);
        }

        .story-emoji-btn:hover {
          transform: scale(1.25);
        }

        .story-emoji-btn:active {
          transform: scale(0.95);
        }

        @media (max-width: 480px) {
          .story-container {
            max-width: 100%;
            height: 100%;
            border-radius: 0;
            border: none;
          }
          .story-footer {
            padding-bottom: 32px; /* safe area for modern phones */
          }
        }
      `}</style>
    </div>
  );
};

export default StoryModal;
