export default function CompanyOverview({ name, establishedYear, vision, mission }:{name:string; establishedYear:string; vision:string; mission:string}) {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-12">{name}</h1>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-Paperlogy mb-4">회사 소개</h2>
                        <p className="text-gray-700 mb-4 font-Paperlogy text-md md:text-lg">
                            당사는 {establishedYear}년에 설립된 건설기계 전문 기업으로,
                            건설기계 수리 및 정비와 부품판매를 주요 사업으로 하고 있습니다.
                            전문 기술진과 풍부한 경험을 바탕으로 고객에게 최상의 서비스를 제공합니다.
                        </p>
                        <p className="text-gray-700 font-Paperlogy text-md md:text-lg">
                            최신 장비와 기술을 활용하여 신속하고 정확한 정비 서비스를 제공하며,
                            다양한 건설기계 부품을 합리적인 가격에 공급하고 있습니다.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-Paperlogy mb-4">비전 및 미션</h2>
                        <div className="mb-4">
                            <h3 className="text-xl font-Paperlogy text-blue-700 mb-2">비전</h3>
                            <p className="text-gray-700 font-semibold">{vision}</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-Paperlogy text-blue-700 mb-2">미션</h3>
                            <p className="text-gray-700 font-semibold">{mission}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}