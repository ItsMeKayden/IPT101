import React from 'react';

export const Button = ({ 
  children, 
  variant = 'default',
  className = '',
  ...props 
}) => {
  const baseClasses = 'rounded-[5px] transition-all duration-200 flex items-center justify-center';
  
  const variantClasses = {
    default: 'bg-purple-600 text-white',
    ghost: 'bg-transparent',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};