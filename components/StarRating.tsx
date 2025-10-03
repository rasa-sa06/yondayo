// components/StarRating.tsx
import React from 'react';

type StarRatingProps = {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
    size?: 'small' | 'medium' | 'large';
};

export const StarRating: React.FC<StarRatingProps> = ({
    rating,
    onRatingChange,
    readonly = false,
    size = 'medium',
}) => {
    const sizeClasses = {
        small: 'text-base',
        medium: 'text-2xl',
        large: 'text-[32px]',
    };
    
    const handleClick = (value: number) => {
        if (!readonly && onRatingChange) {
            onRatingChange(value);
        }
    };

    return (
    <div className="inline-flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
        <span
            key={value}
            className={`${sizeClasses[size]} ${value <= rating ? 'text-[#FFD700]' : 'text-[#ddd]'} ${!readonly ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-all duration-200`}
            onClick={() => handleClick(value)}
        >
            ★
        </span>
        ))}
    </div>
    );
};