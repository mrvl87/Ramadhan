import * as React from 'react';

interface RamadanLogoProps {
    className?: string;
    size?: number;
}

/**
 * Custom Ramadan Hub AI Logo
 * A crescent moon with a star, representing Ramadan
 */
export function RamadanLogo({ className, size = 24 }: RamadanLogoProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Crescent Moon */}
            <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Star */}
            <path
                d="M17 6l.55 1.1 1.22.18-.88.86.21 1.21L17 8.75l-1.1.6.21-1.21-.88-.86 1.22-.18L17 6z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
