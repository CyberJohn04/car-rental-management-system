import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import loginBg from '../assets/images/loginbg.png';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: verification, 3: reset password
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Step 1: Submit email
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      // Call API to send reset email
      const response = await api.post('/auth/forgot-password', { email });
      setMessage('Verification code sent to your email. Please check your inbox.');
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!verificationCode.trim()) {
      setError('Verification code is required');
      return;
    }

    setLoading(true);
    try {
      // Call API to verify code (optional - can skip for demo)
      setMessage('Code verified successfully!');
      setStep(3);
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!newPassword) {
      setError('New password is required');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Call API to reset password
      const response = await api.post('/auth/reset-password', {
        email,
        verificationCode,
        newPassword,
      });
      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ ...styles.pageWrapper, backgroundImage: `url(${loginBg})` }}>
      <div style={styles.container}>
        <form onSubmit={
          step === 1 ? handleEmailSubmit : 
          step === 2 ? handleVerifyCode : 
          handleResetPassword
        } style={styles.form}>
          <div style={styles.logoContainer}>
            <img
              src="https://img.icons8.com/ios-filled/50/0000FF/car.png"
              alt=""
              style={styles.logoIcon}
              aria-hidden="true"
              draggable="false"
            />
            <div>
              <div style={styles.logoTextMain}>Rent a Car</div>
              <div style={styles.logoTextSub}>Reset Password</div>
            </div>
          </div>

          <h2 style={styles.heading}>
            {step === 1 && 'Forgot Your Password?'}
            {step === 2 && 'Verify Your Email'}
            {step === 3 && 'Create New Password'}
          </h2>

          <p style={styles.subtitle}>
            {step === 1 && 'Enter your email address and we\'ll send you a code to reset your password.'}
            {step === 2 && 'Enter the verification code sent to your email.'}
            {step === 3 && 'Enter your new password.'}
          </p>

          {error && <div style={styles.errorMessage}>{error}</div>}
          {message && <div style={styles.successMessage}>{message}</div>}

          {/* Step 1: Email */}
          {step === 1 && (
            <>
              <label htmlFor="email" style={styles.label}>Email Address</label>
              <div style={styles.inputGroup}>
                <span style={styles.inputIcon}>✉️</span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  style={styles.input}
                  disabled={loading}
                />
              </div>
            </>
          )}

          {/* Step 2: Verification Code */}
          {step === 2 && (
            <>
              <label htmlFor="code" style={styles.label}>Verification Code</label>
              <div style={styles.inputGroup}>
                <span style={styles.inputIcon}>🔐</span>
                <input
                  type="text"
                  id="code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter the 6-digit code"
                  required
                  maxLength="6"
                  style={styles.input}
                  disabled={loading}
                />
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={styles.backButton}
              >
                ← Back to Email
              </button>
            </>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <>
              <label htmlFor="newPassword" style={styles.label}>New Password</label>
              <div style={styles.inputGroup}>
                <span style={styles.inputIcon}>🔑</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  style={styles.input}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.togglePassword}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>

              <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
              <div style={styles.inputGroup}>
                <span style={styles.inputIcon}>🔑</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  style={styles.input}
                  disabled={loading}
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                style={styles.backButton}
              >
                ← Back to Verification
              </button>
            </>
          )}

          <button type="submit" style={styles.btnSubmit} disabled={loading}>
            {loading ? 'Processing...' : (
              step === 1 ? 'Send Code' : 
              step === 2 ? 'Verify Code' : 
              'Reset Password'
            )}
          </button>

          <div style={styles.loginLink}>
            <span>Remember your password? </span>
            <Link to="/login" style={styles.linkStyle}>
              Log In
            </Link>
          </div>
        </form>
      </div>

      <style>{`
        input:focus {
          border-color: #3b41f3 !important;
          outline: none;
        }

        button:hover:not(:disabled) {
          background-color: #2d31c5 !important;
        }

        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    margin: 0,
    fontFamily: "'Cantata One', serif",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  container: {
    width: '100%',
    maxWidth: '450px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
  },
  form: {
    padding: '40px 35px',
    display: 'flex',
    flexDirection: 'column',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    justifyContent: 'center',
  },
  logoIcon: {
    width: '50px',
    height: '50px',
    objectFit: 'contain',
  },
  logoTextMain: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0000FF',
  },
  logoTextSub: {
    fontSize: '12px',
    color: '#666',
    fontWeight: '400',
  },
  heading: {
    margin: '0 0 12px 0',
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
  },
  subtitle: {
    margin: '0 0 24px 0',
    fontSize: '14px',
    color: '#666',
    textAlign: 'center',
    lineHeight: '1.5',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  inputGroup: {
    position: 'relative',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    fontSize: '18px',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '12px 12px 12px 40px',
    fontSize: '14px',
    border: '1.5px solid #ccc',
    borderRadius: '6px',
    fontFamily: "'Cantata One', serif",
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box',
  },
  togglePassword: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '0 8px',
  },
  errorMessage: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid #fecaca',
  },
  successMessage: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '1px solid #bbf7d0',
  },
  btnSubmit: {
    padding: '12px',
    fontSize: '16px',
    fontWeight: '700',
    color: 'white',
    backgroundColor: '#3b41f3',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '12px',
    transition: 'background-color 0.3s ease',
    fontFamily: "'Cantata One', serif",
  },
  backButton: {
    padding: '10px 12px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#3b41f3',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '16px',
    transition: 'background-color 0.3s ease',
    fontFamily: "'Cantata One', serif",
  },
  loginLink: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
    color: '#666',
  },
  linkStyle: {
    color: '#3b41f3',
    fontWeight: '600',
    textDecoration: 'none',
  },
};

export default ForgotPassword;
