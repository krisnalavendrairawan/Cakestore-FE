
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import SpecialOffers from './components/WhatNew';
import Products from './components/Products';
import Features from './components/Features';
import Footer from './components/Footer';
import ContactSection from './components/Contact';
import TestimonialsSection from './components/Testimonial';
import AboutSection from './components/About';
import StatsSection from './components/Stats';

export default function CakeStoreLanding() {

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <AboutSection />  
      <SpecialOffers />
      <Features />
      <Products />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}