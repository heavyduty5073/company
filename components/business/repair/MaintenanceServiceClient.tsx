
'use client';

import React from 'react';
import HeroSection from "@/components/business/repair/HeroSection";
import ServicesGrid from "@/components/business/repair/ServiceGrid";
import CTASection from "@/components/business/repair/CTASection";
import ExpertiseSection from "@/components/business/repair/ExpertiseSection";
import DiagnosticSection from "@/components/business/repair/DiagnosticSection";

const MaintenanceServiceClient = () => {
    return (
        <div className="overflow-hidden">
            <HeroSection />
            <DiagnosticSection />
            <ServicesGrid />
            <ExpertiseSection />
            <CTASection />
        </div>
    );
};

export default MaintenanceServiceClient;