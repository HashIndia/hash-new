import React from 'react';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`
        ${sizeClasses[size]} 
        border-4 border-gray-600 border-t-[#00D2FF] 
        rounded-full animate-spin
        ${className}
      `} />
    </div>
  );
};

const SpinnerWithText = ({ 
  size = 'md', 
  text = 'Loading...', 
  className = '',
  textClassName = 'text-muted-foreground mt-4' 
}) => {
  return (
    <div className="text-center">
      <Spinner size={size} className={className} />
      <p className={textClassName}>{text}</p>
    </div>
  );
};

// Loading overlay component
const LoadingOverlay = ({ 
  isLoading, 
  text = 'Loading...', 
  className = 'min-h-screen bg-background' 
}) => {
  if (!isLoading) return null;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <SpinnerWithText text={text} size="lg" />
    </div>
  );
};

export { Spinner, SpinnerWithText, LoadingOverlay };
export default Spinner;
