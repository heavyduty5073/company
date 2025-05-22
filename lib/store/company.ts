import {CompanyData} from "@/utils/supabase/types";

export const companyOptions = {
    excavator: ['현대', '두산', '볼보', '얀마', '케타'],
    loader: ['현대', '두산', '볼보', '얀마', '케타'],
    truck: ['벤츠', '볼보', '스카니아', '현대', '대우', 'MAN']
};
// 회사 색상 매핑
export const companyColorMap: { [key: string]: { bgColor: string, textColor: string } } = {
    '두산': { bgColor: 'bg-purple-500', textColor: 'text-white' },
    '볼보': { bgColor: 'bg-gray-300', textColor: 'text-black' },
    '현대': { bgColor: 'bg-blue-500', textColor: 'text-white' },
    '대우': { bgColor: 'bg-red-500', textColor: 'text-white' },
    '얀마': { bgColor: 'bg-yellow-400', textColor: 'text-black' },
    '스카니아': { bgColor: 'bg-blue-', textColor: 'text-white' },
    'default': { bgColor: 'bg-white border border-gray-200', textColor: 'text-black' }
};
export const categoryMap: { [key: string]: { name: string, bgColor: string, textColor: string } } = {
    excavator: { name: '굴삭기', bgColor: 'bg-blue-600', textColor: 'text-white' },
    loader: { name: '로더', bgColor: 'bg-green-500', textColor: 'text-white' },
    truck: { name: '대형트럭', bgColor: 'bg-red-600', textColor: 'text-white' },
};
export const companyData: CompanyData = {
    name: "건설기계 전문기업",
    establishedYear: "2019",
    vision: "최고의 건설기계 정비 및 부품 공급 업체",
    mission: "고객에게 최상의 품질과 서비스를 제공하여 건설 산업의 발전에 기여합니다",
    services: [
        {
            id: 1,
            title: "건설기계 수리 및 정비",
            description: "전문 기술자에 의한 신속하고 정확한 정비 서비스를 제공합니다.",
            imageUrl: "/introduce/homeImg5.jpg"
        },
        {
            id: 2,
            title: "건설기계 부품판매",
            description: "정품 및 고품질 호환 부품을 경쟁력 있는 가격으로 제공합니다.",
            imageUrl: "/introduce/parts1.jpg"
        },
        {
            id: 3,
            title: "기술 컨설팅",
            description: "건설기계 관련 전문적인 기술 자문을 제공합니다.",
            imageUrl: "/introduce/talktotalk.jpg"
        }
    ],
    videoUrl: "/videos/company-intro.mp4",
    videoDetails: [
        {
            title: "회사 연혁",
            content: "2019년 설립 이후 지속적인 성장과 혁신을 통해 건설기계 업계의 선도적인 위치를 확립해 왔습니다."
        },
        {
            title: "전문 기술력",
            content: "숙련된 기술자와 최신 장비를 갖추고 모든 종류의 건설기계에 대한 정비 서비스를 제공합니다."
        },
        {
            title: "품질 보증",
            content: "모든 정비 서비스와 부품에 대한 품질을 보증하며, 고객 만족을 최우선으로 합니다."
        }
    ]
};