import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingButton = ({
  children,
  loading = false,
  loadingText = '',
  disabled = false,
  className = '',
  variant = 'primary', // primary, secondary, danger, success
  size = 'medium', // small, medium, large
  type = 'button',
  onClick,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 focus:ring-green-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    outline:
      'border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white focus:ring-green-500',
  };

  const disabledClasses =
    'opacity-50 cursor-not-allowed bg-gray-400 text-gray-600 hover:bg-gray-400 hover:text-gray-600';

  const classes = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    disabled || loading ? disabledClasses : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={classes}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <LoadingSpinner
          size="small"
          inline
          className="mr-2"
          color="currentColor"
        />
      )}
      {loading && loadingText ? loadingText : children}
    </button>
  );
};

export default LoadingButton;
