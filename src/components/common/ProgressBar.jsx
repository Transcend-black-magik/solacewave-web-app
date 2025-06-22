import React from 'react';
import '../../styles/components/progress-bar.css';

const ProgressBar = ({ progress = 0, color = 'primary', showPercentage = false }) => {
  const percentage = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={`progress-bar progress-${color}`}>
      <div 
        className="progress-bar-fill" 
        style={{ width: `${percentage}%` }}
      ></div>
      {showPercentage && (
        <div className="progress-percentage">{Math.round(percentage)}%</div>
      )}
    </div>
  );
};

export default ProgressBar;