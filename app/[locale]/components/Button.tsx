import type React from 'react';

const Button = ({
  onClick,
  children,
  className = '',
}: {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={`text-black bg-white border-none px-1 cursor-pointer text-md font-semibold hover:bg-black hover:text-white ${className}`}
      type="button"
    >
      {children}
    </button>
  );
};

export default Button;
