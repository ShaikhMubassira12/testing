import React, { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  Navbar,
  Background,
  ParticleScene,
  Hero,
  NextSection,
} from '../../components';

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  useEffect(() => {
    // Setup Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    let rafId;

    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // GSAP Entrance Timeline
    const titleLines = document.querySelectorAll('.hero-title .line > span');
    const fades = document.querySelectorAll('[data-anim="fade"]');
    const chips = document.querySelectorAll('.chips .chip');

    gsap.set(titleLines, { yPercent: 110 });
    gsap.set(fades, { y: 24, opacity: 0 });
    gsap.set(chips, { y: 14, opacity: 0 });

    const canvas = document.getElementById('particle-canvas');
    gsap.set(canvas, { opacity: 0 });

    // Run entrance animations
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    tl.to(canvas, { opacity: 1, duration: 1.4 }, 0)
      .to(titleLines, { yPercent: 0, duration: 1.2, stagger: 0.09 }, 0.3)
      .to(fades, { y: 0, opacity: 1, duration: 1.0, stagger: 0.08 }, 0.6)
      .to(chips, { y: 0, opacity: 1, duration: 0.7, stagger: 0.06 }, 1.0);

    // Hover micro-interactions on chips
    const chipsElements = document.querySelectorAll('.chips .chip');
    chipsElements.forEach((chip) => {
      chip.addEventListener('mouseenter', () => {
        gsap.to(chip, { y: -3, duration: 0.2, overwrite: 'auto' });
      });
      chip.addEventListener('mouseleave', () => {
        gsap.to(chip, { y: 0, duration: 0.2, overwrite: 'auto' });
      });
    });

    // Pause animation when tab not visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="app">
      <Background />
      <ParticleScene />
      <Navbar />
      <Hero />
      <NextSection />
    </div>
  );
};

export default HomePage;
