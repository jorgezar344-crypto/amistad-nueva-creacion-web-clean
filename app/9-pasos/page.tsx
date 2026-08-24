import type { Metadata } from 'next';
import { NineStepsExperience } from '../../components/v2/NineStepsExperience';
import { SiteNavbar } from '../../components/v2/SiteNavbar';
import { SiteFooter } from '../../components/v2/SiteFooter';

export const metadata: Metadata = {
  title: 'Los 9 Pasos',
  description: 'Un camino para crecer en Cristo, desde aceptar a Jesús hasta continuar caminando en comunidad.',
};

export default function NineStepsPage() {
  return (
    <div className="v2-site v2-nine-site">
      <SiteNavbar />
      <main><NineStepsExperience /></main>
      <SiteFooter />
    </div>
  );
}
