// components/Card.tsx
import React from 'react';

    type CardProps = {
        children: React.ReactNode;
        onClick?: () => void;
        hoverable?: boolean;
        className?: string;
    };

    export const Card: React.FC<CardProps> = ({
        children,
        onClick,
        hoverable = false,
        className = '',
    }) => {
    const baseClasses = 'bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(102,0,0,0.1)] transition-all duration-300';
    const hoverClasses = hoverable ? 'cursor-pointer hover:translate-y-[-4px] hover:shadow-[0_4px_12px_rgba(102,0,0,0.1)] active:translate-y-[-2px] active:shadow-[0_3px_10px_rgba(102,0,0,0.1)]' : '';
    
    return (
        <div
            onClick={onClick}
            className={`${baseClasses} ${hoverClasses} ${className}`}
        >
        {children}
        </div>
    );
    };