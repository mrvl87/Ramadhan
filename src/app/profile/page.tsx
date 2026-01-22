import { getUserHistory, getUserStats } from './actions';
import { HistoryTable } from '@/components/profile/HistoryTable';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { User, CreditCard, History } from 'lucide-react';

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const stats = await getUserStats();
    const history = await getUserHistory(1, 20); // Initial load

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-sm text-slate-500">Account</div>
                        <div className="font-bold text-slate-900 truncate max-w-[150px]">{user.email}</div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                        <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-sm text-slate-500">Credits</div>
                        <div className="font-bold text-slate-900">
                            {stats?.credits ?? 0} <span className="text-xs font-normal text-slate-400">available</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                        <History className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-sm text-slate-500">Total Generated</div>
                        <div className="font-bold text-slate-900">{history.totalItems}</div>
                    </div>
                </div>
            </div>

            {/* History Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <History className="w-5 h-5 text-slate-400" />
                    Generation History
                </h2>
                <HistoryTable
                    initialData={history.data || []}
                    totalPages={history.totalPages}
                    currentPage={history.currentPage}
                />
            </div>
        </div>
    );
}
