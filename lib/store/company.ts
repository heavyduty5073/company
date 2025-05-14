export const companyOptions = {
    excavator: ['현대', '두산', '볼보', '얀마', '케타'],
    loader: ['현대', '두산', '볼보', '얀마', '케타'],
    truck: ['벤츠', '볼보', '스카니아', '현대', '대우', 'MAN']
};
// 회사 색상 매핑
export const companyColorMap: { [key: string]: { bgColor: string, textColor: string } } = {
    '두산': { bgColor: 'bg-orange-500', textColor: 'text-white' },
    '볼보': { bgColor: 'bg-gray-300', textColor: 'text-black' },
    '현대': { bgColor: 'bg-blue-500', textColor: 'text-white' },
    '대우': { bgColor: 'bg-red-500', textColor: 'text-white' },
    '얀마': { bgColor: 'bg-yellow-400', textColor: 'text-black' },
    '스카니아': { bgColor: 'bg-blue-800', textColor: 'text-white' },
    'default': { bgColor: 'bg-white border border-gray-200', textColor: 'text-black' }
};
export const categoryMap: { [key: string]: { name: string, bgColor: string, textColor: string } } = {
    excavator: { name: '굴삭기', bgColor: 'bg-blue-600', textColor: 'text-white' },
    loader: { name: '로더', bgColor: 'bg-green-600', textColor: 'text-white' },
    truck: { name: '대형트럭', bgColor: 'bg-red-600', textColor: 'text-white' },
};