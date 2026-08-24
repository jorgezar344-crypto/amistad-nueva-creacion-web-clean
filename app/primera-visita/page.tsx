import type { Metadata } from 'next';
import { FirstVisitExperience } from '../../components/v2/FirstVisitExperience';

export const metadata: Metadata = { title: 'Primera visita' };

export default function FirstVisitPage() {
  return <FirstVisitExperience />;
}
