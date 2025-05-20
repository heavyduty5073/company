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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* 왼쪽: 로고 및 회사 정보 */}
                    <div className="flex flex-col items-center md:items-start space-y-4">
                        {/* 로고 */}
                        <div className="flex justify-center md:justify-start">
                            <Image
                                src="/logo/mainLogo.png"
                                alt="DS 건설기계 로고"
                                width={120}
                                height={80}
                                className="h-auto"
                            />
                        </div>

                        {/* 사업자등록번호 */}
                        <div className="text-xs text-center md:text-left">
                            <BusinessNumber />
                        </div>

                        {/* 정책 링크 */}
                        <div className="flex flex-wrap gap-x-2 justify-center md:justify-start text-xs mt-2">
                            <Link href="/introduce/about" className="text-foreground hover:text-primary transition-colors underline">
                                회사소개
                            </Link>
                            <span className="text-gray-500">|</span>
                            <Link href="/privacy/secure" className="text-foreground hover:text-primary transition-colors underline">
                                개인정보처리방침
                            </Link>
                            <span className="text-gray-500">|</span>
                            <Link href="/privacy/terms" className="text-foreground hover:text-primary transition-colors underline">
                                서비스이용약관
                            </Link>
                        </div>

                        {/* 소셜 미디어 링크 */}
                        <div className="space-y-2 w-full">
                            <h3 className="font-Rix text-sm text-center md:text-left">소셜 미디어</h3>
                            <div className="flex gap-3 justify-center md:justify-start">
                                <Link
                                    href="https://www.youtube.com/@DS_Heavyduty"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-secondary-foreground bg-opacity-10 p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors text-red-500 rounded-xl"
                                    aria-label="유튜브 채널"
                                >
                                    <IoLogoYoutube size={22} />
                                </Link>
                                <Link
                                    href={'https://www.band.us/@dsce'}
                                    target={'_blank'}
                                    rel={'noopener noreferrer'}
                                    className={'flex justify-center items-center bg-secondary-foreground bg-opacity-10 p-2 rounded-full hover:bg-primary transition-colors rounded-xl'}
                                >
                                    <Image src={'/footer/band.svg'} alt={'band'} width={22} height={22}/>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* 중앙: 군산본점 정보 */}
                    <div className="space-y-3">
                        <p className="font-Rix text-base sm:text-lg text-foreground font-bold text-center md:text-left">DS 건설기계 군산본점</p>
                        <div className="flex items-start gap-2">
                            <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                            <p className="break-words text-sm">전북특별자치도 군산시 해망로 663 선우플랜트</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={16} className="flex-shrink-0" />
                            <p className="text-sm">대표번호: 010-2036-5073</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail size={16} className="flex-shrink-0" />
                            <p className="break-all text-sm">이메일: heavyduty5073@gmail.com</p>
                        </div>
                    </div>

                    {/* 오른쪽: 김제점 정보 */}
                    <div className="space-y-3">
                        <p className="font-Rix text-base sm:text-lg text-foreground font-bold text-center md:text-left">DS 건설기계 김제점</p>
                        <div className="flex items-start gap-2">
                            <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                            <p className="break-words text-sm">전북 김제시 황토로 919 1동</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={16} className="flex-shrink-0" />
                            <p className="text-sm">연락처: 010-9590-1232</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail size={16} className="flex-shrink-0" />
                            <p className="break-all text-sm">이메일: areum1438@naver.com</p>
                        </div>
                    </div>
                </div>

                {/* 저작권 정보 */}
                <div className="mt-6 md:mt-8 pt-3 md:pt-4 border-t border-border text-center text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} DS 건설기계. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;