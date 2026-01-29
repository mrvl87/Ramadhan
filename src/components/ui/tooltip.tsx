'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    side?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
}

export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
    const [isVisible, setIsVisible] = React.useState(false);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    const arrowClasses = {
        top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-900 dark:border-t-slate-100 border-x-transparent border-b-transparent',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-900 dark:border-b-slate-100 border-x-transparent border-t-transparent',
        left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-900 dark:border-l-slate-100 border-y-transparent border-r-transparent',
        right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-900 dark:border-r-slate-100 border-y-transparent border-l-transparent',
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div
                    className={cn(
                        'absolute z-50 px-2 py-1 text-xs font-medium text-white dark:text-slate-900 bg-slate-900 dark:bg-slate-100 rounded shadow-lg whitespace-nowrap pointer-events-none',
                        positionClasses[side],
                        className
                    )}
                    role="tooltip"
                >
                    {content}
                    <span
                        className={cn(
                            'absolute w-0 h-0 border-4',
                            arrowClasses[side]
                        )}
                    />
                </div>
            )}
        </div>
    );
}
