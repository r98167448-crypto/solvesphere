import { ChallengeDetailClient } from '@/components/ChallengeDetailClient';

export function generateStaticParams() {
  return [
    { id: 'c1' },
    { id: 'c2' },
    { id: 'c3' },
    { id: 'demo' },
  ];
}

export default function ChallengeDetailPage({ params }: { params: { id: string } }) {
  return <ChallengeDetailClient id={params.id} />;
}
