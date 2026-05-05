import React, { useState } from 'react';

const PasswordInput = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
  required = false,
  disabled = false,
  style = {},
  onFocus,
  onBlur,
  minLength,
  showChecklist = false,
  checklistContent
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const EyeIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  );

  return (
    <div style={{ position: 'relative', marginBottom: showChecklist && checklistContent ? '15px' : '15px' }}>
      <div style={{
        position: 'relative',
        marginBottom: showChecklist && checklistContent ? '0' : '15px'
      }}>
        <span style={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          transform: 'translateY(-50%)',
          color: '#888',
          fontSize: '17px',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 1
        }} aria-hidden="true">&#128274;</span>

        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          minLength={minLength}
          onFocus={onFocus}
          onBlur={onBlur}
          style={{
            width: '100%',
            padding: '10px 45px 10px 35px',
            border: '1.5px solid #ccc',
            borderRadius: '5px',
            fontSize: '14px',
            transition: 'border-color 0.25s ease',
            outlineOffset: '2px',
            boxSizing: 'border-box',
            ...style
          }}
        />

        <button
          type="button"
          onClick={togglePasswordVisibility}
          disabled={disabled}
          style={{
            position: 'absolute',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            padding: '5px',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            transition: 'color 0.2s ease, opacity 0.2s ease',
            opacity: disabled ? 0.5 : 1,
            zIndex: 1
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.target.style.color = '#3b41f3';
              e.target.style.opacity = '0.8';
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled) {
              e.target.style.color = '#666';
              e.target.style.opacity = '1';
            }
          }}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      {showChecklist && checklistContent && (
        <div style={{
          marginTop: '10px',
          marginBottom: '6px',
          padding: '12px',
          background: '#f8fafc',
          border: '1px solid #dbe4f0',
          borderRadius: '8px',
          textAlign: 'left'
        }}>
          {checklistContent}
        </div>
      )}
    </div>
  );
};

export default PasswordInput;