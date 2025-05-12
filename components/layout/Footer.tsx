import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { IoLogoYoutube } from "react-icons/io";
function Footer() {
    return (
        <footer className="bg-gradient-to-r from-[#003247] to-black py-8 border-t text-white border-black">
            <div className="container mx-auto p-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                    {/* 왼쪽 섹션: 회사 정보 */}
                    <div className="space-y-6">
                        <div className="mb-4">
                            <Image
                                src="/logo/mainLogo.png"
                                alt="DS 건설기계 로고"
                                width={180}
                                height={60}
                                className="h-auto"
                            />
                        </div>

                        <div className="space-y-2 text-muted-foreground text-sm">
                            <p className="font-Rix text-lg text-foreground">DS 건설기계</p>
                            <div className="flex items-center gap-2">
                                <MapPin size={16} />
                                <p>전북특별자치도 군산시 해망로 663 선우플랜트</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={16} />
                                <p>대표번호: 031-123-4567</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={16} />
                                <p>이메일: info@dsconstruction.co.kr</p>
                            </div>
                            <p>사업자등록번호: 792-04-01412</p>
                        </div>

                        {/* 약관 링크 */}
                        <div className="pt-4 border-t border-border">
                            <ul className="flex flex-wrap gap-4 text-sm">
                                <li>
                                    <Link href="/company" className="text-foreground hover:text-primary transition-colors">
                                        회사소개
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy" className="text-foreground hover:text-primary transition-colors">
                                        개인정보처리방침
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="text-foreground hover:text-primary transition-colors">
                                        서비스이용약관
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 오른쪽 섹션: SNS 및 뉴스레터 */}
                    <div className="flex flex-col justify-between">
                        <div className="space-y-4">
                            <h3 className="font-medium text-lg">소셜 미디어</h3>
                            <div className="flex gap-4">
                                {/*<Link*/}
                                {/*    href="https://facebook.com"*/}
                                {/*    target="_blank"*/}
                                {/*    rel="noopener noreferrer"*/}
                                {/*    className="bg-secondary-foreground bg-opacity-10 p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"*/}
                                {/*>*/}
                                {/*    <Facebook size={24} />*/}
                                {/*</Link>*/}
                                {/*<Link*/}
                                {/*    href="https://instagram.com"*/}
                                {/*    target="_blank"*/}
                                {/*    rel="noopener noreferrer"*/}
                                {/*    className="bg-secondary-foreground bg-opacity-10 p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"*/}
                                {/*>*/}
                                {/*    <Instagram size={24} />*/}
                                {/*</Link>*/}
                                <Link
                                    href="https://www.youtube.com/@DS_Heavyduty"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-secondary-foreground bg-opacity-10 p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                    <IoLogoYoutube size={24} />
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-border text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} DS 건설기계. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;