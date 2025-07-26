import React from 'react';

const LoadingSpinner = ({
  size = 'medium',
  color = '#2f5148',
  className = '',
  text = '',
  inline = false,
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
    xlarge: 'w-12 h-12',
  };

  const spinnerStyle = {
    width:
      size === 'small'
        ? '16px'
        : size === 'medium'
        ? '24px'
        : size === 'large'
        ? '32px'
        : '48px',
    height:
      size === 'small'
        ? '16px'
        : size === 'medium'
        ? '24px'
        : size === 'large'
        ? '32px'
        : '48px',
    borderColor: color,
    borderTopColor: 'transparent',
  };

  if (inline) {
    return (
      <span className={`loading-spinner ${className}`} style={{ color }}>
        ⏳
      </span>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className="animate-spin rounded-full border-2 border-solid"
        style={spinnerStyle}
      />
      {text && <p className="mt-2 text-sm text-gray-600 font-medium">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
