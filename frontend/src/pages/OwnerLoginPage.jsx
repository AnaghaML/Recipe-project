import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function OwnerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFillDemo = () => {
    setEmail('owner@restaurant.com');
    setPassword('password123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate('/owner/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message ||
        'Authentication failed. Please verify owner credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="owner-login-page">
      <div className="owner-login-card">
        {/* Header Branding */}
        <div className="login-header">
          <div className="shield-icon-wrap">
            <ShieldCheck size={32} className="shield-icon" />
          </div>
          <span className="login-eyebrow">RESTAURANT PORTAL</span>
          <h1 className="login-title">Owner Administration</h1>
          <p className="login-subtitle">
            Sign in to access kitchen orders, update workflow statuses, and manage your menu.
          </p>
        </div>

        {/* Demo Credentials Quick-Fill Banner */}
        <div className="demo-credentials-card">
          <div className="demo-text">
            <Sparkles size={16} className="gold-accent" />
            <div>
              <strong>Quick Demo Access</strong>
              <p>Email: <code>owner@restaurant.com</code> | Pass: <code>password123</code></p>
            </div>
          </div>
          <button
            type="button"
            className="fill-demo-btn"
            onClick={handleFillDemo}
          >
            Auto-fill
          </button>
        </div>

        {error && (
          <div className="form-error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="owner-login-form">
          <div className="form-group">
            <label htmlFor="owner-email">Owner Email</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                id="owner-email"
                type="email"
                placeholder="owner@restaurant.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="owner-password">Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="owner-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spinner-icon" /> Authenticating...
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="login-footer-link">
          <Link to="/">← Return to Customer Website</Link>
        </div>
      </div>
    </div>
  );
}
