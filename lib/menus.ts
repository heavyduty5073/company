export interface SubMenuItem {
    id: number;
    title: string;
    link: string;
    description?: string;
}

export interface MenuItem {
    id: number;
    title: string;
    link: string;
    type: 'dropdown' | 'link';
    subMenus?: SubMenuItem[];
}

export const menus: MenuItem[] = [
    {
        id: 1,
        title: '기업소개',
        link: '/introduce',
        type: 'dropdown',
        subMenus: [
            {
                id: 101,
                title: '회사 소개',
                link: '/introduce/about',
                description: 'DS 건설기계의 역사와 비전'
            },
            {
                id: 102,
                title: 'CEO 인사말',
                link: '/introduce/ceo',
                description: '경영진 소개 및 인사말'
            },
            {
                id: 103,
                title: '조직도',
                link: '/introduce/organization',
                description: '회사 조직 구성 안내'
            },
            {
                id: 104,
                title: '오시는 길',
                link: '/home#kakaomap',
                description: '회사 위치 및 약도'
            }
        ]
    },
    {
        id: 2,
        title: '사업부문/운영장비',
        link: '/business',
        type: 'dropdown',
        subMenus: [
            {
                id: 201,
                title: '건설 장비',
                link: '/business/construction',
                description: '굴삭기, 로더, 크레인 등 건설현장 장비'
            },
            {
                id: 202,
                title: '산업용 장비',
                link: '/business/industrial',
                description: '지게차, 집게차 등 산업용 중장비'
            },
            {
                id: 203,
                title: '특수 장비',
                link: '/business/special',
                description: '특수 목적 건설기계 장비'
            },
            {
                id: 204,
                title: '정비 서비스',
                link: '/business/maintenance',
                description: '전문 정비 서비스 안내'
            },
            {
                id: 205,
                title: '부품 공급',
                link: '/business/parts',
                description: '정품 부품 공급 서비스'
            }
        ]
    },
    {
        id: 3,
        title: '고객지원',
        link: '/support',
        type: 'dropdown',
        subMenus: [
            {
                id: 301,
                title: 'FAQ',
                link: '/support/faq',
                description: '자주 묻는 질문 안내'
            },
            {
                id: 302,
                title: '공지사항',
                link: '/support/notice',
                description: '회사 소식 및 공지'
            },
            {
                id: 303,
                title: '문의하기',
                link: '/support/inquiry',
                description: '견적 및 기술 문의'
            }
        ]
    },
    {
        id: 4,
        title: '정비사례',
        link: '/maintenance',
        type: 'link'
    },
];

export const truckList =['벤츠','볼보','스카니아','현대','대우','MAN']
export const workList=[
    {
        category:'벤츠'
    }
]