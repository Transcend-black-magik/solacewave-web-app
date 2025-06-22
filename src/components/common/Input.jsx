import React from 'react';
import '../../styles/components/form.css';

const Input = ({
  type = 'text',
  id,
  name,
  label,
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  className = '',
  disabled = false
}) => {
  return (
    <div className={`form-input ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}
      
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="input-field"
      />
      
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Input;