// components/Button.tsx
import React from 'react';

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit';
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    disabled?: boolean;
};

    export const Button: React.FC<ButtonProps> = ({
        children,
        onClick,
        type = 'button',
        variant = 'primary',
        size = 'medium',
        fullWidth = false,
        disabled = false,
    }) => {
    const baseClasses = 'font-mplus font-medium rounded-[20px] cursor-pointer transition-all duration-300 shadow-[0_2px_4px_rgba(102,0,0,0.1)] hover:translate-y-[-2px] hover:shadow-[0_4px_8px_rgba(102,0,0,0.1)] active:translate-y-0 active:shadow-[0_2px_4px_rgba(102,0,0,0.1)] disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
        primary: 'bg-cyan text-brown',
        secondary: 'bg-white text-brown border-2 border-cyan',
        danger: 'bg-[#ffcccc] text-brown',
    };
    
    const sizeClasses = {
        small: 'px-4 py-2 text-sm',
        medium: 'px-6 py-3 text-base',
        large: 'px-8 py-4 text-lg',
    };
    
    const widthClass = fullWidth ? 'w-full' : '';
    
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass}`}
        >
        {children}
        </button>
    );
    };