import type { Metadata } from 'next';
import { GivingExperience } from '../../components/v2/GivingExperience';

export const metadata: Metadata = { title: 'Ofrendar' };

export default function GivingPage() {
  return <GivingExperience />;
}
