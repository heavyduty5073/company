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
                description: ''
            },
            {
                id: 102,
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
                title: '운영 장비',
                link: '/business/construction',
                description: '굴삭기, 로더, 크레인 등 운영장비'
            },
            {
                id: 202,
                title: '정비 서비스',
                link: '/business/repair',
                description: '전문 정비 서비스 안내'
            },
            {
                id: 203,
                title: '부품 공급',
                link: '/business/parts',
                description: '정품 부품 공급 서비스'
            },
            {
                id: 204,
                title: '출장 정비 서비스',
                link: '/business/trip',
                description: '전국 어디든 출장 정비 서비스'
            },

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
                link: '/support?type=faq',
                description: '자주 묻는 질문 안내'
            },
            {
                id: 302,
                title: '공지사항',
                link: '/support?type=notice',
                description: '회사 소식 및 공지'
            },
            {
                id: 303,
                title: '문의하기',
                link: '/support?type=inquiry',
                description: '견적 및 기술 문의'
            }
        ]
    },
    {
        id: 4,
        title: '정비사례',
        link: '/repair',
        type: 'link'
    },
];

export const truckList =['벤츠','볼보','스카니아','현대','대우','MAN']
export const workList=[
    {
        category:'벤츠'
    }
]