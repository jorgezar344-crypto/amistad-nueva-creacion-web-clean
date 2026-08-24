'use client';

import { useEffect } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const DEFAULT_PARALLAX_FACTOR = 0.045;
const MAX_PARALLAX_FACTOR = 0.1;
const MAX_PARALLAX_OFFSET = 36;

const clamp = (value: number, minimum: number, maximum: number) => (
  Math.min(maximum, Math.max(minimum, value))
);

const getParallaxFactor = (element: HTMLElement) => {
  const requestedFactor = Number.parseFloat(element.dataset.homeParallax ?? '');
  if (!Number.isFinite(requestedFactor)) return DEFAULT_PARALLAX_FACTOR;
  return clamp(requestedFactor, -MAX_PARALLAX_FACTOR, MAX_PARALLAX_FACTOR);
};

const revealImmediately = (elements: HTMLElement[]) => {
  elements.forEach((element) => {
    element.classList.remove('home-pass2-reveal-pending');
    element.classList.add('home-pass2-reveal-visible');
    element.dataset.homeRevealComplete = 'true';
  });
};

export function HomeMotionSystem() {
  useEffect(() => {
    const motionPreference = window.matchMedia(REDUCED_MOTION_QUERY);
    let stopCurrentSystem: (() => void) | null = null;

    const startSystem = () => {
      const revealElements = Array.from(
        document.querySelectorAll<HTMLElement>('[data-home-reveal]'),
      );
      const parallaxElements = Array.from(
        document.querySelectorAll<HTMLElement>('[data-home-parallax]'),
      );

      if (motionPreference.matches) {
        revealImmediately(revealElements);
        parallaxElements.forEach((element) => {
          element.classList.remove('home-pass2-parallax-active');
          element.style.setProperty('--home-parallax-y', '0px');
        });

        return () => {
          parallaxElements.forEach((element) => {
            element.style.removeProperty('--home-parallax-y');
          });
        };
      }

      let revealObserver: IntersectionObserver | null = null;

      const Observer = window.IntersectionObserver;

      if (typeof Observer === 'function') {
        revealObserver = new Observer((entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const element = entry.target as HTMLElement;
            element.classList.remove('home-pass2-reveal-pending');
            element.classList.add('home-pass2-reveal-visible');
            element.dataset.homeRevealComplete = 'true';
            observer.unobserve(element);
          });
        }, {
          rootMargin: '0px 0px -8% 0px',
          threshold: 0.14,
        });

        revealElements.forEach((element) => {
          if (element.dataset.homeRevealComplete === 'true') return;

          const bounds = element.getBoundingClientRect();
          if (bounds.top < window.innerHeight * 0.94 && bounds.bottom > 0) {
            element.classList.add('home-pass2-reveal-visible');
            element.dataset.homeRevealComplete = 'true';
            return;
          }

          element.classList.remove('home-pass2-reveal-visible');
          element.classList.add('home-pass2-reveal-pending');
          revealObserver?.observe(element);
        });
      } else {
        revealImmediately(revealElements);
      }

      let frameId: number | null = null;

      const updateParallax = () => {
        frameId = null;
        const viewportHeight = window.innerHeight;
        const viewportCenter = viewportHeight / 2;

        parallaxElements.forEach((element) => {
          const bounds = element.getBoundingClientRect();
          if (bounds.bottom < -MAX_PARALLAX_OFFSET || bounds.top > viewportHeight + MAX_PARALLAX_OFFSET) return;

          const elementCenter = bounds.top + bounds.height / 2;
          const distanceFromCenter = elementCenter - viewportCenter;
          const offset = clamp(
            -distanceFromCenter * getParallaxFactor(element),
            -MAX_PARALLAX_OFFSET,
            MAX_PARALLAX_OFFSET,
          );

          element.style.setProperty('--home-parallax-y', `${offset.toFixed(2)}px`);
        });
      };

      const queueParallaxUpdate = () => {
        if (frameId === null) frameId = window.requestAnimationFrame(updateParallax);
      };

      parallaxElements.forEach((element) => {
        element.classList.add('home-pass2-parallax-active');
      });

      if (parallaxElements.length > 0) {
        updateParallax();
        window.addEventListener('scroll', queueParallaxUpdate, { passive: true });
        window.addEventListener('resize', queueParallaxUpdate, { passive: true });
      }

      return () => {
        revealObserver?.disconnect();
        revealElements.forEach((element) => {
          element.classList.remove('home-pass2-reveal-pending');
        });
        parallaxElements.forEach((element) => {
          element.classList.remove('home-pass2-parallax-active');
          element.style.removeProperty('--home-parallax-y');
        });
        window.removeEventListener('scroll', queueParallaxUpdate);
        window.removeEventListener('resize', queueParallaxUpdate);
        if (frameId !== null) window.cancelAnimationFrame(frameId);
      };
    };

    const restartSystem = () => {
      stopCurrentSystem?.();
      stopCurrentSystem = startSystem();
    };

    restartSystem();

    if (typeof motionPreference.addEventListener === 'function') {
      motionPreference.addEventListener('change', restartSystem);
    } else {
      motionPreference.addListener(restartSystem);
    }

    return () => {
      stopCurrentSystem?.();
      if (typeof motionPreference.removeEventListener === 'function') {
        motionPreference.removeEventListener('change', restartSystem);
      } else {
        motionPreference.removeListener(restartSystem);
      }
    };
  }, []);

  return null;
}
