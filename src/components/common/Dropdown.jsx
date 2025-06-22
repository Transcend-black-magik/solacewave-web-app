import React, { useState, useRef, useEffect } from 'react';
import '../../styles/components/form.css';

const Dropdown = ({
  id,
  name,
  options = [],
  value,
  onChange,
  defaultLabel = 'Select an option',
  featuredOptions = [],
  error = '',
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  
  // Find the selected option's label
  const selectedOption = options.find(option => 
    option.code === value || option.value === value || option.name === value
  );
  
  const selectedText = selectedOption ? 
    (selectedOption.label || selectedOption.name) : 
    defaultLabel;
  
  // Filter options based on search
  const filteredOptions = options.filter(option => {
    const optionText = option.label || option.name || '';
    return optionText.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle option selection
  const handleOptionSelect = (option) => {
    const value = option.code || option.value || option.name;
    onChange(value);
    setIsOpen(false);
    setSearchQuery('');
  };
  
  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Toggle dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
  
  return (
    <div 
      className={`dropdown-container ${className} ${isOpen ? 'open' : ''} ${error ? 'has-error' : ''}`} 
      ref={dropdownRef}
    >
      <div 
        className={`dropdown-selected ${disabled ? 'disabled' : ''}`}
        onClick={toggleDropdown}
      >
        <span className="selected-text">
          {value && selectedOption?.flag ? (
            <span className="option-flag">{selectedOption.flag}</span>
          ) : null}
          {selectedText}
        </span>
        <span className="dropdown-arrow"></span>
      </div>
      
      {isOpen && (
        <div className="dropdown-menu">
          {options.length > 10 && (
            <div className="dropdown-search">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                onClick={(e) => e.stopPropagation()}
                className="dropdown-search-input"
              />
            </div>
          )}
          
          {featuredOptions.length > 0 && (
            <>
              <div className="dropdown-group">
                <div className="dropdown-group-header">Popular</div>
                {featuredOptions.map((option, index) => (
                  <div 
                    key={`featured-${option.code || option.value || index}`}
                    className={`dropdown-option ${
                      (option.code === value || option.value === value || option.name === value) 
                        ? 'selected' 
                        : ''
                    }`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option.flag && <span className="option-flag">{option.flag}</span>}
                    <span className="option-text">{option.label || option.name}</span>
                  </div>
                ))}
              </div>
              <div className="dropdown-divider"></div>
            </>
          )}
          
          <div className="dropdown-options">
            {filteredOptions.length === 0 ? (
              <div className="no-options">No options found</div>
            ) : (
              filteredOptions.map((option, index) => (
                <div 
                  key={`option-${option.code || option.value || index}`}
                  className={`dropdown-option ${
                    (option.code === value || option.value === value || option.name === value) 
                      ? 'selected' 
                      : ''
                  }`}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option.flag && <span className="option-flag">{option.flag}</span>}
                  <span className="option-text">{option.label || option.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Dropdown;