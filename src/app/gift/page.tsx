import { Metadata } from 'next';
import GiftRecommendationPage from '@/features/gift-recommendation/page';

export const metadata: Metadata = {
    title: 'Eid Gift Assistant | RamadanHub AI',
    description: 'Get personalized gift ideas for your loved ones.',
};

export default function Page() {
    return <GiftRecommendationPage />;
}
