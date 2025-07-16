import MaintenanceServiceClient from '@/components/business/repair/MaintenanceServiceClient';
import React from 'react';
import {Metadata} from "next";
import Script from 'next/script';

export const metadata: Metadata = {
    title: "정비운영 장비 | DS 건설기계 - 최첨단 건설장비 정비 장비 소개",
    description: "DS 건설기계가 보유한 최첨단 정비운영 장비를 확인하세요. 얀마엔진, 카본세척기, DPF 청소장비, 인젝터 테스트기 등 전문 정비 장비로 정확하고 안전한 건설기계 정비 서비스를 제공합니다.",
    keywords: [
        "건설기계 정비장비", "얀마엔진", "카본세척기", "DPF 청소장비", "인젝터 테스트기",
        "엔진부품샌딩기", "부품세척기", "커민스시뮬레이터", "건설장비 정비도구",
        "DS 건설기계 장비", "전문 정비장비", "건설기계 진단장비", "군산 정비장비"
    ],
    applicationName: "DS 건설기계",
    authors: [{ name: "DS 건설기계", url: "https://deasung.kr" }],
    generator: "DS 건설기계",
    publisher: "DS 건설기계",
    category: "건설기계 정비 서비스",
    alternates: {
        canonical: "/repair",
        languages: {
            'ko': '/repair',
        },
    },
    robots: {
        index: true,
        follow: true,
        noarchive: false,
        nosnippet: false,
        noimageindex: false,
        nocache: false,
    },
    openGraph: {
        type: "website",
        title: "DS 건설기계 정비운영 장비 | 최첨단 건설장비 정비 장비 소개",
        description: "DS 건설기계가 보유한 최첨단 정비 장비를 통해 안전하고 효율적인 건설기계 정비 서비스를 제공합니다.",
        url: "https://deasung.kr/repair",
        siteName: "DS 건설기계",
        locale: "ko_KR",
        images: [
            {
                url: "/business/얀마엔진.jpg",
                width: 1200,
                height: 630,
                alt: "DS 건설기계 정비운영 장비 - 얀마엔진"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        title: "DS 건설기계 정비운영 장비",
        description: "최첨단 정비 장비를 통해 안전하고 효율적인 건설기계 정비 서비스를 제공합니다.",
        images: ["/business/얀마엔진.jpg"],
    },
    other: {
        "mobile-web-app-capable": "yes",
        "apple-mobile-web-app-capable": "yes",
        "apple-mobile-web-app-title": "DS 건설기계",
        "msapplication-TileColor": "#2563eb",
        "theme-color": "#2563eb",
    }
};

async function Page() {
    // 구조화된 데이터 - 회사 정보
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "DS 건설기계",
        "alternateName": "DS 건설기계",
        "url": "https://deasung.kr",
        "logo": {
            "@type": "ImageObject",
            "url": "https://deasung.kr/logo/mainLogo.png",
            "width": 300,
            "height": 100,
            "caption": "DS 건설기계 로고"
        },
        "image": {
            "@type": "ImageObject",
            "url": "https://deasung.kr/business/얀마엔진.jpg",
            "width": 1200,
            "height": 630,
            "caption": "DS 건설기계 정비 장비"
        },
        "description": "DS 건설기계가 보유한 최첨단 정비운영 장비를 확인하세요. 얀마엔진, 카본세척기, DPF 청소장비 등 전문 정비 장비로 정확하고 안전한 건설기계 정비 서비스를 제공합니다.",
        "telephone": "+82-10-2036-5073",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "KR",
            "addressRegion": "전라북도",
            "addressLocality": "군산시"
        },
        "foundingDate": "2019",
        "numberOfEmployees": "6",
        "slogan": "전문가가 하는 건설기계 정비 서비스"
    };

    // 구조화된 데이터 - 서비스 정보
    const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "건설기계 정비 장비 서비스",
        "description": "DS 건설기계가 보유한 최첨단 정비운영 장비를 통한 전문 건설기계 정비 서비스",
        "provider": {
            "@type": "Organization",
            "name": "DS 건설기계",
            "url": "https://deasung.kr"
        },
        "serviceType": "건설기계 정비",
        "availableChannel": {
            "@type": "ServiceChannel",
            "serviceUrl": "https://deasung.kr/repair",
            "servicePhone": "+82-10-2036-5073"
        },
        "areaServed": {
            "@type": "Country",
            "name": "대한민국"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "정비 장비 서비스 목록",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "얀마엔진 정비",
                        "description": "최첨단 얀마엔진을 활용한 엔진 정비 서비스"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "DPF 청소 서비스",
                        "description": "전문 DPF 청소장비를 통한 후처리장치 청소"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "인젝터 테스트",
                        "description": "인젝터 테스트기를 통한 정밀 진단 서비스"
                    }
                }
            ]
        }
    };

    // BreadcrumbList 스키마
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "DS 건설기계",
                "item": "https://deasung.kr"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "정비 서비스",
                "item": "https://deasung.kr/repair"
            }
        ]
    };

    return (
        <>
            {/* 구조화된 데이터 스크립트 */}
            <Script
                id="organization-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationSchema)
                }}
            />
            <Script
                id="service-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(serviceSchema)
                }}
            />
            <Script
                id="breadcrumb-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema)
                }}
            />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <MaintenanceServiceClient />
            </div>
        </>
    );
}

export default Page;
