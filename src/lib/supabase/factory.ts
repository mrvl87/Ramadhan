import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createBrowserClient } from '@/lib/supabase/client';

/**
 * Unified Supabase client factory with proper error handling
 */
export class SupabaseClientFactory {
    private static serverInstance: Awaited<ReturnType<typeof createServerClient>> | null = null;
    private static browserInstance: ReturnType<typeof createBrowserClient> | null = null;

    /**
     * Get server-side Supabase client
     * @returns Server Supabase client
     */
    static async getServerClient() {
        if (!this.serverInstance) {
            this.serverInstance = await createServerClient();
        }
        return this.serverInstance;
    }

    /**
     * Get browser-side Supabase client
     * @returns Browser Supabase client
     */
    static getBrowserClient() {
        if (!this.browserInstance) {
            this.browserInstance = createBrowserClient();
        }
        return this.browserInstance;
    }

    /**
     * Reset client instances (useful for testing)
     */
    static reset() {
        this.serverInstance = null;
        this.browserInstance = null;
    }
}

/**
 * Convenience functions for backward compatibility
 */
export const createSupabaseServerClient = () => SupabaseClientFactory.getServerClient();
export const createSupabaseBrowserClient = () => SupabaseClientFactory.getBrowserClient();