import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"
// 폰트 설정
const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter"
});

// 메타데이터 설정
export const metadata: Metadata = {
    title: {
        template: "%s | DS 건설기계",
        default: "DS 건설기계 | 전북 군산 건설장비 수리 및 부품 전문",
    },
    description: "전북 군산 지역 덤프트럭, 포크레인 등 건설장비 출장수리 및 부품 전문업체. 20년 이상의 노하우로 신속하고 정확한 수리 서비스와 품질 좋은 건설기계 부품을 제공합니다.",
    keywords: [
        "건설기계", "건설장비", "덤프트럭", "포크레인", "건설기계 수리",
        "출장수리", "건설기계 부품", "배출가스 후처리", "굴삭기 수리",
        "건설장비 정비", "군산 건설기계", "전북 건설장비 수리"
    ],
    authors: [{ name: "DS 건설기계" }],
    creator: "DS 건설기계",
    publisher: "DS 건설기계",
    formatDetection: {
        telephone: true,
        email: true,
        address: true,
    },
    metadataBase: new URL("https://deasung.kr"),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "DS 건설기계 | 전북 군산 건설장비 수리 및 부품 전문",
        description: "전북 군산 지역 덤프트럭, 포크레인 등 건설장비 출장수리 및 부품 전문업체. 20년 이상의 노하우로 신속하고 정확한 수리 서비스와 품질 좋은 건설기계 부품을 제공합니다.",
        url: "https://deasung.kr",
        siteName: "DS 건설기계",
        locale: "ko_KR",
        type: "website",
        images: [
            {
                url: "/logo/mainLogo.png", // 추가해야 할 OG 이미지
                width: 400,
                height: 400,
                alt: "DS 건설기계 - 건설장비 수리 및 부품 전문",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "DS 건설기계 | 전북 군산 건설장비 수리 및 부품 전문",
        description: "전북 군산 지역 덤프트럭, 포크레인 등 건설장비 출장수리 및 부품 전문업체. 신속하고 정확한 수리 서비스를 제공합니다.",
        images: ["/logo/mainLogo.png"], // 트위터용 이미지
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    category: "건설기계",
    verification: {
        // 구글 서치 콘솔 확인용 태그 (실제 값으로 교체 필요)
        google: "Y3ZInLrjSDmqy0yY0h-r3ycaC9kcca5I-8UgzpY4gRw",
    },
};

// 뷰포트 설정
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
        { media: "(prefers-color-scheme: dark)", color: "#121212" },
    ],
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" className={inter.variable}>
        <body>
        <head>
            <meta name="naver-site-verification" content="3a47e48d2c526516d7e98cd936fdd517e12f0459" />
        </head>
        {/* JSON-LD 스키마 마크업 */}
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "LocalBusiness",
                    "name": "DS 건설기계",
                    "image": "/logo/mainLogo.png", //실제 이미지 링크
                    "@id": "https://deasung.kr", //회사 url
                    "url": "https://deasung.kr", //회사 url
                    "telephone": "+82-10-2036-5073", // 실제 전화번호로 변경 필요
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "해망로 663", // 실제 주소로 변경 필요
                        "addressLocality": "군산시",
                        "addressRegion": "전라북도",
                        "postalCode": "54160",
                        "addressCountry": "KR"
                    },
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": 35.978391,
                        "longitude": 126.670940
                    },
                    "openingHoursSpecification": {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": [
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday"
                        ],
                        "opens": "09:00",
                        "closes": "18:00"
                    },
                    "sameAs": [
                        "https://www.youtube.com/@DS_Heavyduty",
                        "https://www.band.us/@dsce",
                    ],
                    "description": "전북 군산 지역 덤프트럭, 포크레인 등 건설장비 출장수리 및 부품 전문업체. 20년 이상의 노하우로 신속하고 정확한 수리 서비스와 품질 좋은 건설기계 부품을 제공합니다.",
                    "priceRange": "₩₩",
                    "servesCuisine": "건설기계 수리, 부품 판매",
                    "potentialAction": {
                        "@type": "ReservationAction",
                        "target": {
                            "@type": "EntryPoint",
                            "urlTemplate": "https://deasung.kr/construction",
                            "inLanguage": "ko",
                            "actionPlatform": [
                                "http://schema.org/DesktopWebPlatform",
                                "http://schema.org/MobileWebPlatform"
                            ]
                        },
                        "result": {
                            "@type": "Reservation",
                            "name": "수리 예약"
                        }
                    }
                })
            }}
        />

        {children}
        <Analytics />
        <SpeedInsights/>
        </body>
        </html>
    );
}