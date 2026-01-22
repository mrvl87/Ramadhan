'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        // In production, you might want to send this to an error reporting service
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'exception', {
                description: error.message,
                fatal: false
            });
        }
    }

    retry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError && this.state.error) {
            const FallbackComponent = this.props.fallback || DefaultErrorFallback;
            return <FallbackComponent error={this.state.error} retry={this.retry} />;
        }

        return this.props.children;
    }
}

function DefaultErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
    return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="flex justify-center">
                    <div className="rounded-full bg-red-50 p-3">
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Something went wrong
                    </h2>
                    <p className="text-sm text-gray-600">
                        {error.message || 'An unexpected error occurred while loading this component.'}
                    </p>
                </div>
                
                <Button onClick={retry} variant="outline" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                </Button>
                
                {process.env.NODE_ENV === 'development' && (
                    <details className="text-left">
                        <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                            Error Details (Dev Only)
                        </summary>
                        <pre className="mt-2 text-xs bg-gray-50 p-2 rounded border overflow-auto">
                            {error.stack}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    );
}

// Specialized error boundaries for specific components
export function AIGenerationErrorBoundary({ children }: { children: React.ReactNode }) {
    return (
        <ErrorBoundary
            fallback={AIGenerationErrorFallback}
        >
            {children}
        </ErrorBoundary>
    );
}

function AIGenerationErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
    return (
        <div className="min-h-[300px] flex items-center justify-center p-4">
            <div className="text-center space-y-4 max-w-sm">
                <div className="flex justify-center">
                    <div className="rounded-full bg-orange-50 p-3">
                        <AlertTriangle className="h-6 w-6 text-orange-600" />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <h3 className="text-base font-semibold text-gray-900">
                        AI Generation Failed
                    </h3>
                    <p className="text-sm text-gray-600">
                        {error.message?.includes('credit') 
                            ? 'Unable to process your request. Please check your credit balance.'
                            : 'AI service is temporarily unavailable. Please try again in a moment.'}
                    </p>
                </div>
                
                <Button onClick={retry} size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Retry
                </Button>
            </div>
        </div>
    );
}

export function ImageUploadErrorBoundary({ children }: { children: React.ReactNode }) {
    return (
        <ErrorBoundary
            fallback={ImageUploadErrorFallback}
        >
            {children}
        </ErrorBoundary>
    );
}

function ImageUploadErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
    return (
        <div className="text-center p-6 border border-red-200 rounded-lg bg-red-50">
            <div className="space-y-3">
                <div className="flex justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-sm text-red-800">
                    Upload failed: {error.message || 'Please try selecting your images again.'}
                </p>
                <Button onClick={retry} size="sm" variant="outline">
                    Try Again
                </Button>
            </div>
        </div>
    );
}