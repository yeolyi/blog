import React from "react";

const Button = ({ 
  onClick, 
  children,
  className = ""
}: { 
  onClick?: () => void;
  children: React.ReactNode; 
  className?: string;
}) => {
  return (
    <button 
      onClick={onClick}
      className={`text-black bg-white border-none cursor-pointer text-lg font-semibold hover:bg-black hover:text-white ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;