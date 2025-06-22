import React from 'react';
import '../../styles/components/form.css';

const RadioButton = ({
  id,
  name,
  value,
  label,
  checked,
  onChange,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`radio-option ${className} ${checked ? 'selected' : ''}`}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="radio-input"
      />
      <label htmlFor={id} className="radio-label">
        <span className="radio-button"></span>
        <span className="radio-text">{label}</span>
      </label>
    </div>
  );
};

export default RadioButton;