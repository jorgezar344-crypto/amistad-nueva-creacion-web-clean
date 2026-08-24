'use client';

import { useState } from 'react';
import { CinematicHomeHero } from '../home/CinematicHomeHero';
import { HomeMotionSystem } from '../home/HomeMotionSystem';
import { VisitCoordinationModal } from '../home/VisitCoordinationModal';
import { SiteNavbar } from './SiteNavbar';
import { SiteFooter } from './SiteFooter';
import {
  ChurchHomeTeaser,
  ClosingPracticalHome,
  EventsHomeTeaser,
  FirstVisitHomeTeaser,
  GivingHomeTeaser,
  NineStepsHomePortal,
  RecentMessageHome,
} from './HomeV2Sections';

export function HomeV2() {
  const [visitOpen, setVisitOpen] = useState(false);
  return (
    <div className="v2-site">
      <HomeMotionSystem />
      <SiteNavbar />
      <main>
        <CinematicHomeHero onOpenVisitModal={() => setVisitOpen(true)} />
        <RecentMessageHome />
        <ChurchHomeTeaser />
        <FirstVisitHomeTeaser />
        <NineStepsHomePortal />
        <EventsHomeTeaser />
        <GivingHomeTeaser />
        <ClosingPracticalHome />
      </main>
      <SiteFooter />
      <VisitCoordinationModal isOpen={visitOpen} onClose={() => setVisitOpen(false)} />
    </div>
  );
}
