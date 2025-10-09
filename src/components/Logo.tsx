// components/Logo.tsx
import Image from 'next/image';

type LogoProps = {
    size?: 'small' | 'medium' | 'large';
};

export function Logo({ size = 'medium' }: LogoProps) {
    const sizeMap = {
        small: { width: 120, height: 40 },
        medium: { width: 160, height: 53 },
        large: { width: 200, height: 67 },
    };

    const { width, height } = sizeMap[size];

    return (
        <div className="flex items-center">
            <Image
                src="/logo.png"
                alt="よんだよ"
                width={width}
                height={height}
                priority
                className="object-contain"
            />
        </div>
    );
}