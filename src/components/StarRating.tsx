// components/StarRating.tsx
import clsx from 'clsx';
// import { ReactNode } from 'react'; ← 不要


type StarRatingProps = {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
    size?: 'small' | 'medium' | 'large';
};

export function StarRating({
    rating,
    onRatingChange,
    readonly = false,
    size = 'medium',
}: StarRatingProps) {
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
                    className={clsx(
                        'transition-all duration-200',
                        size === 'small' && 'text-base',
                        size === 'medium' && 'text-2xl',
                        size === 'large' && 'text-[32px]',
                        value <= rating ? 'text-[#FFD700]' : 'text-[#ddd]',
                        readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
                    )}
                    onClick={() => handleClick(value)}
                >
                    ★
                </span>
            ))}
        </div>
    );
}