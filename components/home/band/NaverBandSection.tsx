// components/band/NaverBandSection.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import NaverBandSkeleton from './NaverBandSkeleton';

// Dynamically import the NaverBandFeed component
const NaverBandFeed = dynamic(() => import('./NaverBandFeed'), {
    loading: () => <NaverBandSkeleton />,
    ssr: false // Disable server-side rendering
});

interface NaverBandSectionProps {
    bandUrl: string;
}

const NaverBandSection: React.FC<NaverBandSectionProps> = ({ bandUrl }) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Create IntersectionObserver to detect when the section is visible
        const observer = new IntersectionObserver(
            ([entry]) => {
                // When section becomes visible in viewport
                if (entry.isIntersecting) {
                    console.log('NaverBandSection is now visible!');
                    setIsVisible(true);
                    // Disconnect observer after it's loaded once
                    observer.disconnect();
                }
            },
            {
                // Start loading when section is 200px away from viewport
                rootMargin: '200px',
                threshold: 0.01
            }
        );

        // Start observing the section
        if (sectionRef.current) {
            observer.observe(sectionRef.current);
            console.log('NaverBandSection observer started');
        }

        return () => {
            console.log('NaverBandSection observer cleanup');
            observer.disconnect();
        };
    }, []);


    return (
        <div ref={sectionRef} className="band-section-container">
            {isVisible ? (
                <NaverBandFeed bandUrl={bandUrl} />
            ) : (
                <NaverBandSkeleton />
            )}
        </div>
    );
};

export default NaverBandSection;