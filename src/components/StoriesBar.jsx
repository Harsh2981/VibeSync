import { useState } from 'react';
import { useHangout } from '../context/HangoutContext';
import StoryModal from './StoryModal';
import { Plus, X, Image as ImageIcon, Type, Sparkles } from 'lucide-react';

const StoriesBar = () => {
  const { stories, addStory } = useHangout();
  const [activeStoryIndex, setActiveStoryIndex] = useState(null); // tracking open story
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [storyType, setStoryType] = useState('text'); // 'text' or 'image'
  const [textVal, setTextVal] = useState('');
  const [bgGrad, setBgGrad] = useState('linear-gradient(135deg, #a855f7 0%, #0d6efd 100%)');
  const [mockImgUrl, setMockImgUrl] = useState('');

  const textStoryGradients = [
    'linear-gradient(135deg, #a855f7 0%, #0d6efd 100%)',
    'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
    'linear-gradient(135deg, #111827 0%, #374151 100%)',
    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)'
  ];

  const presetMockImages = [
    { label: 'Gaming Setup', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80' },
    { label: 'Aesthetic Coffee', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80' },
    { label: 'Midnight City', url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80' },
    { label: 'Vinyl Player', url: 'https://images.unsplash.com/photo-1484755560693-a4074577af3a?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleCreateStory = (e) => {
    e.preventDefault();
    if (storyType === 'text') {
      if (!textVal.trim()) return;
      addStory('text', textVal.trim(), bgGrad);
    } else {
      const imgUrl = mockImgUrl.trim() || presetMockImages[0].url;
      addStory('image', imgUrl);
    }
    // Reset state
    setTextVal('');
    setMockImgUrl('');
    setIsCreatorOpen(false);
  };

  const handleNextStory = () => {
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(prev => prev + 1);
    } else {
      setActiveStoryIndex(null); // close at end
    }
  };

  const handlePrevStory = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(prev => prev - 1);
    } else {
      setActiveStoryIndex(null);
    }
  };

  return (
    <div className="stories-bar-container">
      <div className="stories-carousel">
        {/* Add Story Trigger */}
        <div className="story-item-circle" onClick={() => setIsCreatorOpen(true)}>
          <div className="story-avatar-ring plus-ring">
            <div className="story-inner-avatar add-story-btn">
              <Plus size={20} className="plus-icon" />
            </div>
          </div>
          <span className="story-label">Add Story</span>
        </div>

        {/* Stories List */}
        {stories.map((story, idx) => (
          <div key={story.id} className="story-item-circle" onClick={() => setActiveStoryIndex(idx)}>
            <div className="story-avatar-ring active-gradient">
              <div className="story-inner-avatar" style={{ background: story.avatarBg }}>
                {story.avatarChar}
              </div>
            </div>
            <span className="story-label">{story.friendId === 'user' ? 'Your Story' : story.friendName}</span>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {activeStoryIndex !== null && (
        <StoryModal
          story={stories[activeStoryIndex]}
          onClose={() => setActiveStoryIndex(null)}
          onNextStory={handleNextStory}
          onPrevStory={handlePrevStory}
        />
      )}

      {/* Story Creator Modal */}
      {isCreatorOpen && (
        <div className="modal-overlay" onClick={() => setIsCreatorOpen(false)}>
          <div className="creator-modal glass-panel glass-panel-glow" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <Sparkles className="modal-title-icon" />
                <h3>Share a Story</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsCreatorOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="creator-type-tabs">
              <button 
                type="button" 
                className={`tab-btn ${storyType === 'text' ? 'active' : ''}`}
                onClick={() => setStoryType('text')}
              >
                <Type size={16} /> Text Slide
              </button>
              <button 
                type="button" 
                className={`tab-btn ${storyType === 'image' ? 'active' : ''}`}
                onClick={() => setStoryType('image')}
              >
                <ImageIcon size={16} /> Picture
              </button>
            </div>

            <form onSubmit={handleCreateStory}>
              {storyType === 'text' ? (
                <div className="creator-text-panel">
                  <div className="story-text-preview" style={{ background: bgGrad }}>
                    <textarea
                      placeholder="Type your story card text here..."
                      value={textVal}
                      onChange={(e) => setTextVal(e.target.value)}
                      maxLength={100}
                      className="preview-textarea"
                      required
                    />
                  </div>
                  <div className="gradient-pickers-label">Select Background Vibe:</div>
                  <div className="gradient-pickers-grid">
                    {textStoryGradients.map(grad => (
                      <button
                        key={grad}
                        type="button"
                        className={`grad-circle ${bgGrad === grad ? 'active' : ''}`}
                        style={{ background: grad }}
                        onClick={() => setBgGrad(grad)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="creator-image-panel">
                  <div className="image-url-field">
                    <label>Mock Image URL:</label>
                    <input
                      type="url"
                      placeholder="Paste picture URL here..."
                      value={mockImgUrl}
                      onChange={(e) => setMockImgUrl(e.target.value)}
                      className="image-url-input"
                    />
                  </div>
                  <div className="presets-label">Or choose an aesthetic preset:</div>
                  <div className="image-presets-grid">
                    {presetMockImages.map(img => (
                      <button
                        key={img.label}
                        type="button"
                        className={`image-preset-btn ${mockImgUrl === img.url ? 'active' : ''}`}
                        onClick={() => setMockImgUrl(img.url)}
                      >
                        <img src={img.url} alt={img.label} className="preset-thumb" />
                        <span className="preset-thumb-label">{img.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsCreatorOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Share Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .stories-bar-container {
          padding: 12px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(10, 10, 12, 0.1);
        }

        .stories-carousel {
          display: flex;
          gap: 18px;
          overflow-x: auto;
          padding: 4px 0;
          scrollbar-width: none;
        }

        .stories-carousel::-webkit-scrollbar {
          display: none;
        }

        .story-item-circle {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .story-avatar-ring {
          width: 58px;
          height: 58px;
          border-radius: var(--radius-full);
          padding: 2.5px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.08);
          transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .story-item-circle:hover .story-avatar-ring {
          transform: scale(1.08);
        }

        .active-gradient {
          background: linear-gradient(45deg, #f9ce34 10%, #ee2a7b 40%, #6228d7 60%, #37aee2 90%);
          box-shadow: 0 0 10px rgba(238, 42, 123, 0.2);
        }

        .plus-ring {
          background: rgba(255, 255, 255, 0.05);
          border: 1px dashed rgba(255, 255, 255, 0.2);
        }

        .story-item-circle:hover .plus-ring {
          border-color: hsl(var(--color-purple));
          background: rgba(168, 85, 247, 0.1);
        }

        .story-inner-avatar {
          width: 100%;
          height: 100%;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.15rem;
          color: #fff;
          border: 2px solid #0a0a0c;
        }

        .add-story-btn {
          background: rgba(255, 255, 255, 0.05);
          color: hsl(var(--text-secondary));
        }

        .story-item-circle:hover .add-story-btn {
          color: hsl(var(--color-purple));
        }

        .story-label {
          font-size: 0.72rem;
          color: hsl(var(--text-secondary));
          font-weight: 500;
          max-width: 62px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Creator Modal CSS */
        .creator-modal {
          width: 90%;
          max-width: 500px;
          padding: 24px;
          background: rgba(15, 23, 42, 0.8);
          animation: slide-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .creator-type-tabs {
          display: flex;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 4px;
          border-radius: var(--radius-md);
          margin-bottom: 20px;
        }

        .tab-btn {
          flex: 1;
          background: transparent;
          border: none;
          color: hsl(var(--text-secondary));
          padding: 8px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .tab-btn:hover {
          color: #fff;
        }

        .tab-btn.active {
          background: rgba(168, 85, 247, 0.15);
          color: hsl(var(--color-purple));
          border: 1.5px solid rgba(168, 85, 247, 0.12);
        }

        /* Text Slide Creator */
        .story-text-preview {
          width: 100%;
          height: 180px;
          border-radius: var(--radius-md);
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.3);
        }

        .preview-textarea {
          width: 100%;
          height: 100%;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 1.3rem;
          font-weight: 700;
          text-align: center;
          resize: none;
          outline: none;
          font-family: 'Outfit', sans-serif;
        }

        .preview-textarea::placeholder {
          color: rgba(255,255,255,0.45);
        }

        .gradient-pickers-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: hsl(var(--text-secondary));
          margin-bottom: 8px;
        }

        .gradient-pickers-grid {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .grad-circle {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          border: 2px solid transparent;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .grad-circle:hover {
          transform: scale(1.15);
        }

        .grad-circle.active {
          border-color: #fff;
          box-shadow: 0 0 10px rgba(255,255,255,0.4);
        }

        /* Image Creator */
        .image-url-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }

        .image-url-field label {
          font-size: 0.8rem;
          font-weight: 600;
          color: hsl(var(--text-secondary));
        }

        .image-url-input {
          width: 100%;
          background: rgba(0,0,0,0.25);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          color: #fff;
          font-size: 0.85rem;
          outline: none;
        }

        .image-url-input:focus {
          border-color: hsl(var(--color-purple));
        }

        .image-presets-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 24px;
        }

        .image-preset-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px;
        }

        .image-preset-btn:hover {
          background: rgba(168, 85, 247, 0.08);
          border-color: rgba(168, 85, 247, 0.25);
        }

        .image-preset-btn.active {
          background: rgba(168, 85, 247, 0.15);
          border-color: hsl(var(--color-purple));
        }

        .preset-thumb {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          object-fit: cover;
        }

        .preset-thumb-label {
          font-size: 0.72rem;
          font-weight: 500;
          color: hsl(var(--text-primary));
        }
      `}</style>
    </div>
  );
};

export default StoriesBar;
