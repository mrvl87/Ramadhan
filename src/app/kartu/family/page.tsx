import { Metadata } from 'next';
import FamilyPhotoPage from '@/features/family-photo/page';

export const metadata: Metadata = {
    title: 'Buat Foto Keluarga Lebaran AI - Gratis & Instan',
    description: '📸 Sulap foto selfie jadi foto keluarga studio yang estetik untuk lebaran 2026. Coba sekarang, gratis!',
    openGraph: {
        title: '✨ Cek Hasil Foto Keluarga AI Saya!',
        description: 'Saya baru saja membuat foto keluarga lebaran pakai AI. Bagus banget hasilnya! Bikin punyamu di sini (Gratis).',
        images: ['/og-family.jpg'], // Needs a specific OG image for this feature
    }
};

export default function Page() {
    return <FamilyPhotoPage />;
}
