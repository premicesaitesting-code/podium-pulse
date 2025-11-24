
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', titleClassName = '' }) => {
  return (
    <div className={`bg-dark-panel border border-medium-gray/30 rounded-lg p-3 sm:p-4 flex flex-col h-full ${className}`}>
      <h2 className={`font-orbitron text-sm sm:text-base font-bold text-light-gray uppercase tracking-widest mb-2 sm:mb-3 ${titleClassName}`}>
        {title}
      </h2>
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
};

export default Card;
