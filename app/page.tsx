'use client';

import React, { useState } from 'react';
import { HomeNavbar } from '../components/home/HomeNavbar';
import { HomeHero } from '../components/home/HomeHero';
import { FirstVisitSection } from '../components/home/FirstVisitSection';
import { OurChurchSection } from '../components/home/OurChurchSection';
import { ScheduleSection } from '../components/home/ScheduleSection';
import { SermonSection } from '../components/home/SermonSection';
import { EventsSection } from '../components/home/EventsSection';
import { NineStepsCtaSection } from '../components/home/NineStepsCtaSection';
import { PrayerSection } from '../components/home/PrayerSection';
import { LocationSection } from '../components/home/LocationSection';
import { SocialCommunitySection } from '../components/home/SocialCommunitySection';
import { HomeFooter } from '../components/home/HomeFooter';
import { VisitCoordinationModal } from '../components/home/VisitCoordinationModal';

export default function ChurchHomePage() {
  const [visitModalOpen, setVisitModalOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-void text-brandText-primary selection:bg-cyan-electric/30">
      {/* Institutional Header */}
      <HomeNavbar onOpenVisitModal={() => setVisitModalOpen(true)} />

      {/* Main Home Sections */}
      <div className="relative z-10">
        <HomeHero onOpenVisitModal={() => setVisitModalOpen(true)} />

        <FirstVisitSection onOpenVisitModal={() => setVisitModalOpen(true)} />

        <OurChurchSection />

        <ScheduleSection />

        <SermonSection />

        <EventsSection />

        <NineStepsCtaSection />

        <PrayerSection />

        <LocationSection />

        <SocialCommunitySection />
      </div>

      {/* Institutional Footer */}
      <HomeFooter />

      {/* Visit Coordination Modal */}
      <VisitCoordinationModal
        isOpen={visitModalOpen}
        onClose={() => setVisitModalOpen(false)}
      />
    </main>
  );
}
