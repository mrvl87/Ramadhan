'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-skeleton rounded-md bg-muted',
                className
            )}
        />
    );
}

// Pre-built skeleton variants for common use cases
export function CardSkeleton() {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <Skeleton className="h-48 w-full rounded-none" />
            <div className="p-6 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="px-6 pb-6">
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    );
}

export function TextBlockSkeleton({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={cn(
                        'h-4',
                        i === lines - 1 ? 'w-2/3' : 'w-full'
                    )}
                />
            ))}
        </div>
    );
}

export function ImageSkeleton({ className }: SkeletonProps) {
    return (
        <div className={cn('relative overflow-hidden', className)}>
            <Skeleton className="absolute inset-0" />
            <div className="absolute inset-0 flex items-center justify-center">
                <svg
                    className="w-12 h-12 text-muted-foreground/30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            </div>
        </div>
    );
}
