import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import ParticleBackground from './ParticleBackground';

interface LayoutProps {
  children: ReactNode;
  particleDensity?: number;
}

export default function Layout({ children, particleDensity = 20 }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <ParticleBackground density={particleDensity} />
      <Navbar />
      {children}
    </div>
  );
}