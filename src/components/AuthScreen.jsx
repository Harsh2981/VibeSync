import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import '../App.css';

const AuthScreen = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/user-not-found': return 'No account found with this email.';
      case 'auth/wrong-password': return 'Incorrect password. Try again.';
      case 'auth/email-already-in-use': return 'This email is already registered.';
      case 'auth/weak-password': return 'Password must be at least 6 characters.';
      case 'auth/invalid-email': return 'Please enter a valid email address.';
      case 'auth/invalid-credential': return 'Incorrect email or password.';
      default: return 'Something went wrong. Please try again.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!displayName.trim()) { setError('Please enter your name.'); setLoading(false); return; }
        await register(email, password, displayName.trim());
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Animated Background Orbs */}
      <div className="auth-orb orb-1" />
      <div className="auth-orb orb-2" />
      <div className="auth-orb orb-3" />

      <div className="auth-card glass-panel">
        {/* Logo & Branding */}
        <div className="auth-brand">
          <div className="auth-logo">
            <Sparkles size={28} />
          </div>
          <h1 className="auth-title">VibeSync</h1>
          <p className="auth-subtitle">Your personal friend lounge</p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError(''); }}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="auth-field">
              <label htmlFor="displayName">Your Name</label>
              <div className="field-wrapper">
                <User size={16} className="field-icon" />
                <input
                  id="displayName"
                  type="text"
                  placeholder="e.g. Harsh"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <div className="field-wrapper">
              <Mail size={16} className="field-icon" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus={mode === 'login'}
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <div className="field-wrapper">
              <Lock size={16} className="field-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="auth-error">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="auth-submit-btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="auth-loader" />
            ) : (
              mode === 'login' ? 'Enter the Lounge 🚀' : 'Join VibeSync ✨'
            )}
          </button>
        </form>

        <p className="auth-switch-hint">
          {mode === 'login' ? "New here? " : "Already have an account? "}
          <button
            type="button"
            className="auth-switch-link"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
          >
            {mode === 'login' ? 'Create an account' : 'Sign in instead'}
          </button>
        </p>
      </div>

      <style>{`
        .auth-page {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          background: hsl(var(--bg-base));
          position: relative;
          overflow: hidden;
        }

        /* Floating background orbs */
        .auth-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          animation: float-slow 8s ease-in-out infinite;
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          background: rgba(168, 85, 247, 0.2);
          top: -100px;
          left: -100px;
        }

        .orb-2 {
          width: 300px;
          height: 300px;
          background: rgba(37, 99, 235, 0.2);
          bottom: -80px;
          right: -80px;
          animation-delay: -3s;
        }

        .orb-3 {
          width: 200px;
          height: 200px;
          background: rgba(236, 72, 153, 0.15);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: -6s;
        }

        /* Card */
        .auth-card {
          width: 90%;
          max-width: 420px;
          padding: 36px 32px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(168, 85, 247, 0.2);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(168, 85, 247, 0.1);
          position: relative;
          z-index: 10;
          animation: fade-in 0.4s ease-out;
        }

        /* Branding */
        .auth-brand {
          text-align: center;
          margin-bottom: 28px;
        }

        .auth-logo {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          background: linear-gradient(135deg, hsl(var(--color-purple)) 0%, hsl(var(--color-pink)) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          margin: 0 auto 14px auto;
          box-shadow: 0 8px 24px rgba(168, 85, 247, 0.4);
          animation: float-slow 4s ease-in-out infinite;
        }

        .auth-title {
          font-size: 1.9rem;
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          background: linear-gradient(135deg, #fff 30%, hsl(var(--color-purple)) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 4px;
        }

        .auth-subtitle {
          font-size: 0.85rem;
          color: hsl(var(--text-secondary));
        }

        /* Tab Switcher */
        .auth-tabs {
          display: flex;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.05);
          padding: 4px;
          border-radius: var(--radius-md);
          margin-bottom: 24px;
        }

        .auth-tab {
          flex: 1;
          background: transparent;
          border: none;
          color: hsl(var(--text-secondary));
          padding: 9px;
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .auth-tab:hover { color: #fff; }

        .auth-tab.active {
          background: rgba(168, 85, 247, 0.18);
          color: #fff;
          border: 1px solid rgba(168, 85, 247, 0.2);
          box-shadow: 0 0 12px rgba(168, 85, 247, 0.15);
        }

        /* Form */
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 20px;
        }

        .auth-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .auth-field label {
          font-size: 0.8rem;
          font-weight: 600;
          color: hsl(var(--text-secondary));
        }

        .field-wrapper {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--radius-md);
          padding: 0 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .field-wrapper:focus-within {
          border-color: hsl(var(--color-purple));
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.12);
        }

        .field-icon {
          color: hsl(var(--text-muted));
          flex-shrink: 0;
          margin-right: 10px;
        }

        .field-wrapper input {
          flex: 1;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 0.9rem;
          padding: 13px 0;
          outline: none;
        }

        .field-wrapper input::placeholder {
          color: hsl(var(--text-muted));
        }

        .show-password-btn {
          background: transparent;
          border: none;
          color: hsl(var(--text-muted));
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .show-password-btn:hover { color: hsl(var(--text-primary)); }

        /* Error */
        .auth-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          color: #f87171;
          font-size: 0.82rem;
        }

        /* Submit Button */
        .auth-submit-btn {
          width: 100%;
          padding: 13px;
          font-size: 0.95rem;
          font-weight: 700;
          justify-content: center;
          border-radius: var(--radius-md);
          margin-top: 4px;
          letter-spacing: 0.2px;
        }

        .auth-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Spinner */
        .auth-loader {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Switch hint */
        .auth-switch-hint {
          text-align: center;
          font-size: 0.82rem;
          color: hsl(var(--text-muted));
        }

        .auth-switch-link {
          background: transparent;
          border: none;
          color: hsl(var(--color-purple));
          cursor: pointer;
          font-weight: 600;
          font-size: 0.82rem;
          transition: opacity 0.2s;
        }

        .auth-switch-link:hover { opacity: 0.8; text-decoration: underline; }

        @media (max-width: 480px) {
          .auth-card { padding: 28px 20px; }
        }
      `}</style>
    </div>
  );
};

export default AuthScreen;
