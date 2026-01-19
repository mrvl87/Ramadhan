import { Metadata } from 'next';
import RamadanMenuPage from '@/features/ramadan-menu/page';

export const metadata: Metadata = {
    title: 'Ramadan Meal Planner | RamadanHub AI',
    description: 'Generate 7-day personalized Iftar and Sahur meal plans.',
};

export default function Page() {
    return <RamadanMenuPage />;
}
