import Image from "next/image";
import { SiGooglecloudspanner } from "react-icons/si";
interface Service{
    id:number,
    title:string,
    description:string,
    imageUrl:string,
}
export default function ServiceSection({ services }:{services:Service[]}) {
    return (
        <section className="py-16 bg-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">주요 서비스</h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="h-58 bg-gray-300">

                                 <Image src={service.imageUrl} alt={service.title} width={1200} height={1200} className="w-full h-[400px] object-cover" />
                                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-800 py-3">
                                    {service.id === 1 && (
                                        <SiGooglecloudspanner className={'w-12 h-12'}/>
                                    )}
                                    {service.id === 2 && (
                                        <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                        </svg>
                                    )}
                                    {service.id === 3 && (
                                        <svg className="w-14 h-14" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                                <p className="text-gray-600">{service.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}