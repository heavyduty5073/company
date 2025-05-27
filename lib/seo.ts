import { Metadata } from 'next';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string[];
    canonical?: string;
    ogImage?: string;
    ogType?: 'website' | 'article' | 'service';
    noIndex?: boolean;
}

const baseUrl = 'https://deasung.kr';
const siteName = 'DS 건설기계';
const defaultDescription = '전북 군산 지역 덤프트럭, 포크레인 등 건설장비 출장수리 및 부품 전문업체. 20년 이상의 노하우로 신속하고 정확한 수리 서비스를 제공합니다.';

export function generateMetadata({
                                     title,
                                     description,
                                     keywords = [],
                                     canonical,
                                     ogImage = '/logo/mainLogo.png',
                                     ogType = 'website',
                                     noIndex = false
                                 }: SEOProps): Metadata {
    const fullTitle = `${title} | ${siteName}`;
    const canonicalUrl = canonical ? `${baseUrl}${canonical}` : baseUrl;

    return {
        title: fullTitle,
        description,
        keywords: keywords.length > 0 ? keywords : undefined,
        robots: {
            index: !noIndex,
            follow: !noIndex,
            googleBot: {
                index: !noIndex,
                follow: !noIndex,
            }
        },
        alternates: {
            canonical: canonicalUrl
        },
        openGraph: {
            title: fullTitle,
            description,
            url: canonicalUrl,
            siteName,
            locale: 'ko_KR',
            type: 'website',
            images: [
                {
                    url: `${baseUrl}${ogImage}`,
                    width: 1200,
                    height: 630,
                    alt: title
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: [`${baseUrl}${ogImage}`]
        }
    };
}

// 서비스 페이지용 SEO
export const servicePageSEO = {
    // 덤프트럭 서비스
    dumpTruck: generateMetadata({
        title: '덤프트럭 수리 및 정비 서비스',
        description: '덤프트럭 유압시스템, 엔진, 전기계통 전문 수리. 군산 지역 덤프트럭 출장수리 서비스. 신속하고 정확한 덤프트럭 정비 전문업체 DS 건설기계.',
        keywords: [
            '덤프트럭 수리', '덤프트럭 정비', '덤프트럭 유압수리', '덤프트럭 엔진수리',
            '군산 덤프트럭', '전북 덤프트럭', '덤프트럭 출장수리', '덤프트럭 AS'
        ],
        canonical: '/services/dump-truck',
        ogType: 'service'
    }),

    // 굴삭기 서비스
    excavator: generateMetadata({
        title: '굴삭기(포크레인) 수리 및 정비 서비스',
        description: '굴삭기 유압펌프, 엔진, 구동계통 전문 수리. 포크레인 현장 출장수리 서비스. 군산 지역 굴삭기 정비 전문업체 DS 건설기계.',
        keywords: [
            '굴삭기 수리', '포크레인 수리', '굴삭기 정비', '포크레인 정비','로더 정비',
            '굴삭기 유압수리', '포크레인 엔진수리', '군산 굴삭기', '전북 포크레인'
        ],
        canonical: '/services/excavator',
        ogType: 'service'
    }),

    // 긴급출장 서비스
    emergency: generateMetadata({
        title: '긴급출장 수리 서비스',
        description: '건설기계 긴급출장 수리 서비스. 현장에서 바로 수리 가능. 군산, 전북 지역 건설장비 응급처치 및 긴급수리 전문.',
        keywords: [
            '출장수리', '긴급출장', '건설기계 응급처치', '현장수리',
            '군산 긴급출장', '전북 응급수리', '건설장비 긴급수리'
        ],
        canonical: '/services/emergency',
        ogType: 'service'
    })
};

// 부품 페이지용 SEO
export const partsPageSEO = {
    main: generateMetadata({
        title: '건설기계 부품 판매 및 교체',
        description: '정품 건설기계 부품 판매. 덤프트럭, 굴삭기, 포크레인 부품 전문. 군산 지역 건설장비 부품 공급업체 DS 건설기계.',
        keywords: [
            '건설기계 부품', '덤프트럭 부품', '굴삭기 부품', '포크레인 부품',
            '건설장비 부품', '군산 건설기계 부품', '전북 건설장비 부품'
        ],
        canonical: '/parts',
        ogType: 'service'
    }),

    engine: generateMetadata({
        title: '건설기계 엔진 부품',
        description: '건설기계 엔진 부품 전문. 디젤엔진, 터보차저, 인젝터 등 엔진 관련 부품 판매 및 교체 서비스.',
        keywords: [
            '건설기계 엔진부품', '디젤엔진 부품', '터보차저', '인젝터',
            '엔진 오일필터', '연료필터', '에어필터'
        ],
        canonical: '/parts/engine',
        ogType: 'service'
    }),

    hydraulic: generateMetadata({
        title: '건설기계 유압 부품',
        description: '건설기계 유압시스템 부품 전문. 유압펌프, 유압모터, 유압실린더, 유압호스 등 유압 관련 부품 판매.',
        keywords: [
            '유압펌프', '유압모터', '유압실린더', '유압호스',
            '유압오일', '유압필터', '건설기계 유압부품'
        ],
        canonical: '/parts/hydraulic',
        ogType: 'service'
    })
};

// 지역 페이지용 SEO
export const areaPageSEO = {
    gunsan: generateMetadata({
        title: '군산시 건설기계 수리 서비스',
        description: '군산시 전 지역 건설기계 출장수리 서비스. 덤프트럭, 굴삭기, 포크레인 등 모든 건설장비 수리 및 정비. DS 건설기계.',
        keywords: [
            '군산 건설기계', '군산시 건설장비 수리', '군산 덤프트럭', '군산 굴삭기',
            '군산 포크레인', '군산 건설기계 정비', '군산 출장수리'
        ],
        canonical: '/areas/gunsan',
        ogType: 'service'
    }),

    jeonbuk: generateMetadata({
        title: '전라북도 건설기계 수리 서비스',
        description: '전라북도 전 지역 건설기계 출장수리 서비스. 익산, 전주, 정읍, 남원 등 전북 지역 건설장비 수리 전문업체.',
        keywords: [
            '전북 건설기계', '전라북도 건설장비', '익산 건설기계', '전주 건설기계',
            '정읍 건설기계', '남원 건설기계', '전북 출장수리'
        ],
        canonical: '/areas/jeonbuk',
        ogType: 'service'
    })
};

// 구조화된 데이터 생성 함수들
export function generateServiceSchema(service: {
    name: string;
    description: string;
    url: string;
    serviceType: string;
    areaServed: string;
    priceRange?: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": service.name,
        "description": service.description,
        "url": `${baseUrl}${service.url}`,
        "serviceType": service.serviceType,
        "provider": {
            "@type": "LocalBusiness",
            "name": "DS 건설기계",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "해망로 663",
                "addressLocality": "군산시",
                "addressRegion": "전라북도",
                "addressCountry": "KR"
            },
            "telephone": "+82-10-2036-5073"
        },
        "areaServed": {
            "@type": "State",
            "name": service.areaServed
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": service.name,
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": service.name
                    },
                    "priceRange": service.priceRange || "₩₩"
                }
            ]
        }
    };
}

// 사용 예시 함수들
export const commonSchemas = {
    // 메인 서비스들
    dumpTruckService: generateServiceSchema({
        name: "덤프트럭 수리 서비스",
        description: "덤프트럽 유압, 엔진, 전기계통 전문 수리",
        url: "/business/repair",
        serviceType: "건설기계 수리",
        areaServed: "전라북도",
        priceRange: "₩₩"
    }),

    excavatorService: generateServiceSchema({
        name: "굴삭기 수리 서비스",
        description: "굴삭기 유압펌프, 엔진, 구동계통 전문 수리",
        url: "/business/repair",
        serviceType: "건설기계 수리",
        areaServed: "전라북도",
        priceRange: "₩₩"
    }),

    // 긴급 서비스
    emergencyService: generateServiceSchema({
        name: "긴급출장 수리",
        description: "건설기계 긴급출장 수리 서비스",
        url: "/business/trip",
        serviceType: "긴급 수리",
        areaServed: "전라북도",
        priceRange: "₩₩₩"
    })
};

// 내보내기
export default {
    generateMetadata,
    servicePageSEO,
    partsPageSEO,
    areaPageSEO,
    commonSchemas
};