// components/Card.tsx
import { ReactNode } from 'react';
import clsx from 'clsx';

type CardProps = {
    children: ReactNode;
    onClick?: () => void;
    hoverable?: boolean;
    className?: string;
};

export function Card({
    children,
    onClick,
    hoverable = false,
    className = '',
}: CardProps) {
    return (
        <div
            onClick={onClick}
            className={clsx(
                'bg-white rounded-2xl p-4 shadow-[0_2px_8px_rgba(102,0,0,0.1)] transition-all duration-300',
                hoverable && [
                    'cursor-pointer',
                    'hover:translate-y-[-4px] hover:shadow-[0_4px_12px_rgba(102,0,0,0.1)]',
                    'active:translate-y-[-2px] active:shadow-[0_3px_10px_rgba(102,0,0,0.1)]'
                ],
                className
            )}
        >
            {children}
        </div>
    );
}