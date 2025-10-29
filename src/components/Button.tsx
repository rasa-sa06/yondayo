import { ReactNode } from 'react';
import clsx from 'clsx';

type ButtonProps = {
    children: ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit';
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    disabled?: boolean;
};

export function Button({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    disabled = false,
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                'font-mplus font-medium rounded-[20px] cursor-pointer transition-all duration-300',
                'shadow-[0_2px_4px_rgba(102,0,0,0.1)]',
                'hover:translate-y-[-2px] hover:shadow-[0_4px_8px_rgba(102,0,0,0.1)]',
                'active:translate-y-0 active:shadow-[0_2px_4px_rgba(102,0,0,0.1)]',
                'disabled:opacity-50 disabled:cursor-not-allowed',

                variant === 'primary' && 'bg-cyan text-brown',
                variant === 'secondary' && 'bg-white text-brown border-2 border-cyan',
                variant === 'danger' && 'bg-[#ffcccc] text-brown',

                size === 'small' && 'px-4 py-2 text-sm',
                size === 'medium' && 'px-6 py-3 text-base',
                size === 'large' && 'px-8 py-4 text-lg',

                fullWidth && 'w-full'
            )}
        >
            {children}
        </button>
    )
}