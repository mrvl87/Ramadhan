'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, Calendar, Loader2 } from "lucide-react";
import Image from 'next/image';
import { deleteHistoryItem } from '@/app/profile/actions';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface HistoryItem {
    id: string;
    image_url: string;
    prompt: string;
    feature_type: string;
    created_at: string;
}

interface HistoryTableProps {
    initialData: HistoryItem[];
    totalPages: number;
    currentPage: number;
}

export function HistoryTable({ initialData, totalPages, currentPage }: HistoryTableProps) {
    const [data, setData] = useState(initialData);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this image?")) return;

        setDeletingId(id);
        try {
            const result = await deleteHistoryItem(id);
            if (result.success) {
                toast.success("Image deleted from history");
                setData(prev => prev.filter(item => item.id !== id));
            } else {
                toast.error("Failed to delete: " + result.error);
            }
        } catch (e) {
            toast.error("Error deleting image");
        } finally {
            setDeletingId(null);
        }
    };

    if (data.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-500">No history found. Start creating!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">Details</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 w-24">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                                            <Image
                                                src={item.image_url}
                                                alt="Generated"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-md">
                                        <div className="font-medium text-slate-900 mb-1 capitalize">
                                            {item.feature_type.replace('-', ' ')}
                                        </div>
                                        <div className="text-slate-500 truncate" title={item.prompt}>
                                            {item.prompt}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            {format(new Date(item.created_at), 'dd MMM yyyy, HH:mm', { locale: id })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <a
                                                href={item.image_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                disabled={deletingId === item.id}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                                            >
                                                {deletingId === item.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Simple Pagination Feedback (Full pagination requires page reload or sophisticated client state, omitting for MVP unless requested) */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-2">
                <span>Page {currentPage} of {totalPages}</span>
                <span>Total {data.length} items shown</span>
            </div>
        </div>
    );
}
