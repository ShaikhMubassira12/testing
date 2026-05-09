import React from 'react';
import Eyebrow from './Eyebrow';
import HeroTitle from './HeroTitle';
import HeroSubtitle from './HeroSubtitle';
import HeroCTA from './HeroCTA';
import Chips from './Chips';
import Stats from './Stats';
import HUDLabels from './HUDLabels';
import ScrollHint from './ScrollHint';

const Hero = () => {
  return (
    <section className="hero">
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
