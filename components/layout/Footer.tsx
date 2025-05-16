import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { IoLogoYoutube } from "react-icons/io";
import BusinessNumber from "@/components/layout/BusinessNumber";

function Footer() {
    return (
        <footer className="bg-gradient-to-r from-[#003247] to-black py-4 sm:py-6 md:py-8 border-t text-white border-black">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {/* 왼쪽 섹션: 회사 정보 */}
                    <div className="space-y-4 md:space-y-6">
                        <div className="mb-2 md:mb-4">
                            <Image
                                src="/logo/mainLogo.png"
                                alt="DS 건설기계 로고"
                                width={150}
                                height={50}
                                className="h-auto"
                            />
                        </div>

                        <div className="space-y-2 text-muted-foreground text-xs sm:text-sm">
                            <p className="font-Rix text-base sm:text-lg text-foreground">DS 건설기계 군산본점</p>
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="flex-shrink-0" />
                                <p className="break-words">전북특별자치도 군산시 해망로 663 선우플랜트</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={14} className="flex-shrink-0" />
                                <p>대표번호: 010-2036-5073</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={14} className="flex-shrink-0" />
                                <p className="break-all">이메일: heavyduty5073@gmail.com</p>
                            </div>
                            <BusinessNumber/>
                        </div>

                        {/* 약관 링크 */}
                        <div className="flex pt-3 md:pt-8">
                            <ul className="flex flex-wrap gap-3 md:gap-4 text-xs sm:text-sm">
                                <li>
                                    <Link href="/introduce/about" className="text-foreground hover:text-primary transition-colors underline">
                                        회사소개
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy/secure" className="text-foreground hover:text-primary transition-colors underline">
                                        개인정보처리방침
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy/terms" className="text-foreground hover:text-primary transition-colors underline">
                                        서비스이용약관
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-4 md:space-y-6">

                        <div className="space-y-2 text-muted-foreground text-xs sm:text-sm">
                            <p className="font-Rix text-base sm:text-lg text-foreground">DS 건설기계 김제점</p>
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="flex-shrink-0" />
                                <p className="break-words">전북 김제시 황토로 919 1동</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={14} className="flex-shrink-0" />
                                <p>연락처: 010-9590-1232</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={14} className="flex-shrink-0" />
                                <p className="break-all">이메일: areum1438@naver.com</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-muted-foreground text-xs sm:text-sm">
                            <p className="font-Rix text-base sm:text-lg text-foreground">DS 건설기계 익산점</p>
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="flex-shrink-0" />
                                <p className="break-words">주소</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={14} className="flex-shrink-0" />
                                <p>연락처: 031-123-4567</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={14} className="flex-shrink-0" />
                                <p className="break-all">이메일: heavyduty5073@gmail.com</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-muted-foreground text-xs sm:text-sm">
                            <p className="font-Rix text-base sm:text-lg text-foreground">DS 건설기계 광주점</p>
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="flex-shrink-0" />
                                <p className="break-words">주소</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={14} className="flex-shrink-0" />
                                <p>연락처: 031-123-4567</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={14} className="flex-shrink-0" />
                                <p className="break-all">이메일: heavyduty5073@gmail.com</p>
                            </div>
                        </div>

                    </div>
                    {/* 오른쪽 섹션: SNS 및 뉴스레터 */}
                    <div className="flex flex-col justify-between mt-6 md:mt-0">
                        <div className="space-y-3 md:space-y-4">
                            <h3 className="font-Rix text-base md:text-lg">소셜 미디어</h3>
                            <div className="flex gap-3 md:gap-4">
                                <Link
                                    href="https://www.youtube.com/@DS_Heavyduty"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-secondary-foreground bg-opacity-10 p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors text-red-500 rounded-xl"
                                    aria-label="유튜브 채널"
                                >
                                    <IoLogoYoutube size={22} />
                                </Link>
                                <Link href={'https://www.band.us/@dsce'} target={'_blank'} rel={'noopener noreferrer'} className={'flex justify-center items-center'}>
                                    <Image src={'/footer/band.svg'} alt={'band'} width={24} height={24}/>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 md:mt-8 pt-3 md:pt-4 border-t border-border text-center text-xs sm:text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} DS 건설기계. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;