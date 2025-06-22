import React from 'react';
import '../../styles/components/button.css';

const Button = ({ 
  children, 
  type = 'button', 
  className = '', 
  onClick, 
  disabled = false,
  variant = 'primary',
  size = 'medium',
  icon = null
}) => {
  const buttonClasses = `btn btn-${variant} btn-${size} ${className}`;
  
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="btn-icon"><i className={`fas fa-${icon}`}></i></span>}
      {children}
    </button>
  );
};

export default Button;