import { Metadata } from 'next';
import FamilyPhotoPage from '@/features/family-photo/page';

export const metadata: Metadata = {
    title: 'Ramadan Family Photo Generator | RamadanHub AI',
    description: 'Transform your photos into beautiful AI family portraits for Eid.',
};

export default function Page() {
    return <FamilyPhotoPage />;
}
