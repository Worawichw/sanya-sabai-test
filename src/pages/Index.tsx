import React from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { StatsSection } from "@/components/StatsSection";
import { DocumentScanner } from "@/components/DocumentScanner";
import { AnalysisResult } from "@/components/AnalysisResult";
import { Footer } from "@/components/Footer";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <DocumentScanner />
        <AnalysisResult />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
