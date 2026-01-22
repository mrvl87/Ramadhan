import { NextResponse } from 'next/server';

export interface ApiError {
    code: string;
    message: string;
    details?: any;
}

export class ApiErrorHandler {
    /**
     * Handle server action errors with consistent response format
     */
    static handleActionError(error: any): { success: false; error: string } {
        console.error('Server Action Error:', error);
        
        // Handle specific error types
        if (error.code === 'PGRST116') {
            return { 
                success: false, 
                error: 'Resource not found or access denied' 
            };
        }
        
        if (error.code === 'PGRST301') {
            return { 
                success: false, 
                error: 'Unauthorized action' 
            };
        }
        
        // Credit-related errors
        if (error.message?.includes('credit') || error.message?.includes('Insufficient')) {
            return { 
                success: false, 
                error: 'Insufficient credits. Please upgrade your plan.' 
            };
        }
        
        // AI service errors
        if (error.message?.includes('AI') || error.message?.includes('generation')) {
            return { 
                success: false, 
                error: 'AI service temporarily unavailable. Please try again.' 
            };
        }
        
        // Generic error with user-friendly message
        return { 
            success: false, 
            error: error.message || 'An unexpected error occurred' 
        };
    }
    
    /**
     * Handle API route errors with consistent response format
     */
    static handleApiError(error: any, context?: string): NextResponse {
        console.error(`API Error${context ? ` in ${context}` : ''}:`, error);
        
        // Determine status code
        let statusCode = 500;
        let message = 'Internal server error';
        
        if (error.code === 'PGRST116' || error.message?.includes('not found')) {
            statusCode = 404;
            message = 'Resource not found';
        } else if (error.code === 'PGRST301' || error.message?.includes('unauthorized')) {
            statusCode = 401;
            message = 'Unauthorized';
        } else if (error.message?.includes('credit')) {
            statusCode = 402;
            message = 'Payment required';
        } else if (error.message?.includes('validation')) {
            statusCode = 400;
            message = 'Bad request';
        }
        
        const errorResponse: ApiError = {
            code: error.code || 'INTERNAL_ERROR',
            message: error.message || message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        };
        
        return NextResponse.json(
            { success: false, error: errorResponse },
            { status: statusCode }
        );
    }
    
    /**
     * Validate user session
     */
    static async validateUser(supabase: any) {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (error || !user) {
                throw new Error('Unauthorized - No valid user session');
            }
            
            return user;
        } catch (error) {
            throw new Error('Authentication failed');
        }
    }
}

/**
 * Higher-order function for consistent server action error handling
 */
export function withActionErrorHandling<T extends any[], R>(
    action: (...args: T) => Promise<R>
) {
    return async (...args: T): Promise<{ success: true; data: R } | { success: false; error: string }> => {
        try {
            const result = await action(...args);
            return { success: true, data: result };
        } catch (error: any) {
            return ApiErrorHandler.handleActionError(error);
        }
    };
}

/**
 * Higher-order function for consistent API route error handling
 */
export function withApiErrorHandling(
    handler: (request: Request) => Promise<Response>
) {
    return async (request: Request): Promise<Response> => {
        try {
            return await handler(request);
        } catch (error: any) {
            return ApiErrorHandler.handleApiError(error);
        }
    };
}