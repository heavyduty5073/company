import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script";
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
        default: "DS 건설기계 | 전북 군산 건설장비 수리 및 부품 전문 - 덤프트럭 포크레인 출장수리",
    },
    description: "전북 군산 지역 덤프트럭, 포크레인, 굴삭기 등 건설장비 출장수리 및 부품 전문업체. 20년 이상의 노하우로 신속하고 정확한 수리 서비스와 품질 좋은 건설기계 부품을 제공합니다. 배출가스 후처리장치, 건설기계 정비, 긴급출장 24시간 서비스 가능.",
    keywords: [
        // 메인 키워드
        "건설기계", "건설장비", "덤프트럭", "포크레인", "굴삭기",
        // 서비스 키워드
        "건설기계 수리", "출장수리", "건설기계 부품", "배출가스 후처리",
        "건설장비 정비", "건설기계 정비", "긴급출장", "24시간 수리",
        // 지역 키워드
        "군산 건설기계", "전북 건설장비", "군산 포크레인", "군산 덤프트럭",
        "전라북도 건설기계", "군산시 건설장비 수리",
        // 브랜드 키워드
        "DS 건설기계", "DS건설기계", "해망로 건설기계",
        // 롱테일 키워드
        "덤프트럭 유압 수리", "포크레인 엔진 수리", "굴삭기 부품 교체",
        "건설기계 현장 출장", "군산 건설장비 AS", "전북 건설기계 서비스센터"
    ],
    authors: [{ name: "DS 건설기계", url: "https://deasung.kr" }],
    creator: "DS 건설기계",
    publisher: "DS 건설기계",
    applicationName: "DS 건설기계",
    generator: "Next.js",
    referrer: "origin-when-cross-origin",
    formatDetection: {
        telephone: true,
        email: true,
        address: true,
        date: true,
        url: true
    },
    metadataBase: new URL("https://deasung.kr"),
    alternates: {
        canonical: "/",
        languages: {
            'ko-KR': '/',
        },
    },
    // 오픈그래프 (네이버, 카카오톡, 페이스북 등)
    openGraph: {
        title: "DS 건설기계 | 전북 군산 건설장비 수리 및 부품 전문",
        description: "전북 군산 지역 덤프트럭, 포크레인 등 건설장비 출장수리 및 부품 전문업체. 20년 이상의 노하우로 신속하고 정확한 수리 서비스를 제공합니다.",
        url: "https://deasung.kr",
        siteName: "DS 건설기계",
        locale: "ko_KR",
        type: "website",
        images: [
            {
                url: "https://deasung.kr/logo/mainLogo.png",
                width: 500,
                height: 500,
                alt: "DS 건설기계 - 건설장비 수리 및 부품 전문",
                type: "image/png"
            },
            {
                url: "https://deasung.kr/business/fix.png",
                width: 1200,
                height: 630,
                alt: "DS 건설기계 작업 현장",
                type: "image/png"
            },
            {
                url: "https://deasung.kr/home/mainBanner1.jpg",
                width: 500,
                height: 500,
                alt: "DS 건설기계 메인",
                type: "image/jpeg"
            },
            {
                url: "https://deasung.kr/home/mainBanner4.jpg",
                width: 500,
                height: 500,
                alt: "DS 건설기계 메인2",
                type: "image/jpeg"
            },
        ],
    },
    // 트위터 카드
    twitter: {
        card: "summary_large_image",
        title: "DS 건설기계 | 전북 군산 건설장비 수리 및 부품 전문",
        description: "전북 군산 지역 덤프트럭, 포크레인 등 건설장비 출장수리 및 부품 전문업체. 신속하고 정확한 수리 서비스를 제공합니다.",
        images: [
            {
                url: "https://deasung.kr/logo/mainLogo.png",
                alt: "DS 건설기계 대표 이미지"
            }
        ]
    },
    // 로봇 설정 (검색엔진 크롤링)
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    // 카테고리 및 분류
    category: "건설기계",
    classification: "비즈니스",
    // 검색엔진 인증
    verification: {
        google: "Y3ZInLrjSDmqy0yY0h-r3ycaC9kcca5I-8UgzpY4gRw",
        // 네이버는 별도 meta 태그로 처리
        other: {
            "naver-site-verification": "3a47e48d2c526516d7e98cd936fdd517e12f0459"
        }
    },
    // 기타 메타 정보
    other: {
        "theme-color": "#1e40af",
        "mobile-web-app-capable": "yes",
        "apple-mobile-web-app-capable": "yes",
        "apple-mobile-web-app-status-bar-style": "default",
        "msapplication-TileColor": "#1e40af",
        "msapplication-config": "/browserconfig.xml",
        // 네이버 메타 태그들
        "naver-site-verification": "3a47e48d2c526516d7e98cd936fdd517e12f0459",
        // 추가 SEO 메타 태그
        "revisit-after": "7 days",
        "rating": "general",
        "distribution": "global",
        "copyright": "DS 건설기계",
        "language": "Korean",
        "reply-to": "contact@deasung.kr",
        "owner": "DS 건설기계",
        "url": "https://deasung.kr",
        "identifier-URL": "https://deasung.kr",
        "directory": "submission",
        "pagename": "DS 건설기계 홈페이지",
        "coverage": "Worldwide",
        "subject": "건설기계 수리 및 부품",
        "abstract": "전북 군산 건설장비 출장수리 전문",
        "topic": "건설기계, 건설장비, 수리, 부품"
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
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            // 메인 비즈니스 정보
            {
                "@type": "LocalBusiness",
                "@id": "https://deasung.kr/#business",
                "name": "DS 건설기계",
                "alternateName": "DS건설기계",
                "description": "전북 군산 지역 덤프트럭, 포크레인 등 건설장비 출장수리 및 부품 전문업체. 20년 이상의 노하우로 신속하고 정확한 수리 서비스와 품질 좋은 건설기계 부품을 제공합니다.",
                "image": {
                    "@type": "ImageObject",
                    "url": "https://deasung.kr/logo/mainLogo.png",
                    "width": 400,
                    "height": 400
                },
                "logo": "https://deasung.kr/logo/mainLogo.png",
                "url": "https://deasung.kr",
                "telephone": "+82-10-2036-5073",
                "email": "contact@deasung.kr",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "해망로 663",
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
                "openingHoursSpecification": [
                    {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                        "opens": "08:30",
                        "closes": "18:30"
                    },
                    {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": "Saturday",
                        "opens": "08:30",
                        "closes": "18:30"
                    }
                ],
                "priceRange": "₩₩",
                "currenciesAccepted": "KRW",
                "paymentAccepted": "현금, 카드, 계좌이체",
                "areaServed": {
                    "@type": "City",
                    "name": "군산시",
                    "sameAs": "https://ko.wikipedia.org/wiki/군산시"
                },
                "serviceArea": {
                    "@type": "GeoCircle",
                    "geoMidpoint": {
                        "@type": "GeoCoordinates",
                        "latitude": 35.978391,
                        "longitude": 126.670940
                    },
                    "geoRadius": "50000"
                },
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "건설기계 서비스",
                    "itemListElement": [
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name": "덤프트럭 수리",
                                "description": "덤프트럭 유압, 엔진, 전기계통 수리 및 정비"
                            }
                        },
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name": "포크레인 수리",
                                "description": "포크레인 엔진, 유압, 구동계통 수리 및 정비"
                            }
                        },
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name": "굴삭기 수리",
                                "description": "굴삭기 점검, 수리, 정비 서비스"
                            }
                        },
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name": "출장 수리",
                                "description": "현장 출장 수리 서비스, 24시간 긴급 출장 가능"
                            }
                        },
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Product",
                                "name": "건설기계 부품",
                                "description": "정품 건설기계 부품 판매 및 교체"
                            }
                        }
                    ]
                },
                "sameAs": [
                    "https://www.youtube.com/@DS_Heavyduty",
                    "https://www.band.us/@dsce"
                ],
                "founder": {
                    "@type": "Person",
                    "name": "DS 건설기계 대표"
                },
                "numberOfEmployees": "10-20",
                "foundingDate": "2004",
                "slogan": "믿을 수 있는 건설기계 파트너"
            },
            // 웹사이트 정보
            {
                "@type": "WebSite",
                "@id": "https://deasung.kr/#website",
                "url": "https://deasung.kr",
                "name": "DS 건설기계",
                "description": "전북 군산 건설장비 수리 및 부품 전문",
                "publisher": {
                    "@id": "https://deasung.kr/#business"
                },
                "inLanguage": "ko-KR",
                "potentialAction": [
                    {
                        "@type": "SearchAction",
                        "target": {
                            "@type": "EntryPoint",
                            "urlTemplate": "https://deasung.kr/search?q={search_term_string}"
                        },
                        "query-input": "required name=search_term_string"
                    }
                ]
            },
            // 조직 정보
            {
                "@type": "Organization",
                "@id": "https://deasung.kr/#organization",
                "name": "DS 건설기계",
                "url": "https://deasung.kr",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://deasung.kr/logo/mainLogo.png",
                    "width": 400,
                    "height": 400
                },
                "contactPoint": [
                    {
                        "@type": "ContactPoint",
                        "telephone": "+82-10-2036-5073",
                        "contactType": "customer service",
                        "availableLanguage": "Korean",
                        "areaServed": "KR"
                    },
                    {
                        "@type": "ContactPoint",
                        "telephone": "+82-10-2036-5073",
                        "contactType": "emergency",
                        "availableLanguage": "Korean",
                        "areaServed": "KR"
                    }
                ],
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "해망로 663",
                    "addressLocality": "군산시",
                    "addressRegion": "전라북도",
                    "postalCode": "54160",
                    "addressCountry": "KR"
                }
            }
        ]
    };

    // 브레드크럼 스키마
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "홈",
                "item": "https://deasung.kr"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "건설기계 정비 서비스",
                "item": "https://deasung.kr/business/repair"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "부품",
                "item": "https://deasung.kr/business/parts"
            },
            {
                "@type": "ListItem",
                "position": 4,
                "name": "출장 서비스",
                "item": "https://deasung.kr/business/trip"
            },
            {
                "@type": "ListItem",
                "position": 5,
                "name": "회사소개",
                "item": "https://deasung.kr/introduce/about"
            }
        ]
    };
    return (
        <html lang="ko" className={inter.variable}>
        <head>
            <title>DS 건설기계</title>
            {/* 네이버 사이트 확인 */}
            <meta name="naver-site-verification" content="3a47e48d2c526516d7e98cd936fdd517e12f0459" />

            {/* 추가 SEO 메타 태그 */}
            <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
            <meta name="googlebot" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
            <meta name="bingbot" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />

            {/* 지역 검색 최적화 */}
            <meta name="geo.region" content="KR-46" />
            <meta name="geo.placename" content="군산시" />
            <meta name="geo.position" content="35.978391;126.670940" />
            <meta name="ICBM" content="35.978391, 126.670940" />

            {/* 모바일 최적화 */}
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="apple-mobile-web-app-title" content="DS 건설기계" />

            {/* 파비콘 */}
            <link rel="icon" href="/favicon.ico" sizes="any" />

            {/* 프리로드 */}
            <link rel="preload" href="/introduce/car2.jpg" as="image" />
            <link rel="preload" href="/introduce/introImage_3.jpg" as="image" />

            {/* DNS 프리페치 */}
            <link rel="dns-prefetch" href="//fonts.googleapis.com" />
            <link rel="dns-prefetch" href="//www.google-analytics.com" />
            <link rel="dns-prefetch" href="//vercel.live" />

            {/* 구조화된 데이터 */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData)
                }}
            />

            {/* 브레드크럼 스키마 */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema)
                }}
            />

            {/* 추가 메타 태그들 */}
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="format-detection" content="telephone=yes" />
            <meta name="HandheldFriendly" content="true" />
            <meta name="MobileOptimized" content="320" />

            {/* 카카오톡, 네이버 밴드 등 한국 플랫폼 최적화 */}
            <meta property="kakao:title" content="DS 건설기계 | 전북 군산 건설장비 수리 및 부품공급 전문" />
            <meta property="kakao:description" content="전북 군산 지역 덤프트럭, 포크레인 등 건설장비 출장수리 및 부품공급 전문업체" />
            <meta property="kakao:image" content="https://deasung.kr/logo/mainLogo.png" />

            {/* 네이버 블로그, 카페 공유 최적화 */}
            <meta name="NaverBot" content="All" />
            <meta name="DaumBot" content="All" />

            {/*구글검색태그*/}
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_CONVERSION_ID}`}
                strategy="afterInteractive"
            />
            <Script id="google-ads" strategy="afterInteractive">
                {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_CONVERSION_ID}');
          `}
            </Script>
            <Script id="google-ads-conversion" strategy="afterInteractive">
                {`
    function gtag_report_conversion(url) {
      var callback = function () {
        if (typeof(url) != 'undefined') {
          window.location = url;
        }
      };
      gtag('event', 'conversion', {
          'send_to': '${process.env.NEXT_PUBLIC_GOOGLE_CONVERSION_ID}/${process.env.NEXT_PUBLIC_GOOGLE_EVENT_ID}',
          'event_callback': callback
      });
      return false;
    }
  `}
            </Script>
        </head>
        <body className="antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
        </body>
        </html>
    );
}
