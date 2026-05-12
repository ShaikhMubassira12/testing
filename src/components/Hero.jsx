import React from 'react';
import Eyebrow from './Eyebrow';
import HeroTitle from './HeroTitle';
import HeroSubtitle from './HeroSubtitle';
import HeroCTA from './HeroCTA';
import Chips from './Chips';
import Stats from './Stats';
import HUDLabels from './HUDLabels';
import ScrollHint from './ScrollHint';
import Background from './Background';
import ParticleScene from './ParticleScene';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-visuals" aria-hidden="true">
        <Background />
        <ParticleScene />
      </div>

      <div className="hero-inner">
        <Eyebrow />
        <HeroTitle />
        <HeroSubtitle />
        <HeroCTA />
        <Chips />
        <Stats />
      </div>

      <HUDLabels />
      <ScrollHint />
    </section>
  );
};

export default Hero;
