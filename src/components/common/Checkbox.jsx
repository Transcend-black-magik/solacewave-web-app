import React from 'react';
import '../../styles/components/form.css';

const Checkbox = ({
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
    <div className={`checkbox-option ${className} ${checked ? 'selected' : ''}`}>
      <input
        type="checkbox"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="checkbox-input"
      />
      <label htmlFor={id} className="checkbox-label">
        <span className="checkbox-box"></span>
        <span className="checkbox-text">{label}</span>
      </label>
    </div>
  );
};

export default Checkbox;