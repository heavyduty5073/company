import React, {memo} from "react";
import {Posts} from "@/utils/supabase/types";
import {extractFirstImage, getCompanyStyle} from "@/utils/utils";
import {categoryMap} from "@/lib/store/company";
import {FaArrowRight, FaTools} from "react-icons/fa";
import {motion} from "framer-motion";
import Link from "next/link";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {TiSpanner} from "react-icons/ti";
import Image from "next/image";

const RepairCard = memo(({
                             repairCase,
                             cardWidth,
                             isHovered,
                             onMouseEnter,
                             onMouseLeave
                         }: {
    repairCase: Posts;
    cardWidth: number;
    isHovered: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}) => {
    const imageUrl = extractFirstImage(repairCase.contents || '');
    const categoryStyle = categoryMap[repairCase.category] || {
        icon: <FaTools className="w-3 h-3 mr-1" />,
        name: repairCase.category || '기타',
        bgColor: 'bg-gray-500',
        textColor: 'text-white'
    };
    const companyStyle = getCompanyStyle(repairCase.company || '');

    return (
        <motion.div
            className="flex-shrink-0"
            style={{ width: `${cardWidth}px` }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            transition={{ duration: 0.3 }}
        >
            <Link href={`/repair/${repairCase.id}`} className="block h-full">
                <Card className={`h-full bg-gradient-to-b from-gray-800 to-gray-900 border transition-all duration-300 overflow-hidden ${
                    isHovered
                        ? 'border-cyan-400/60 shadow-[0_0_15px_rgba(34,211,238,0.3)] shadow-cyan-400/30'
                        : 'border-gray-700'
                }`}>
                    <CardHeader className="p-3 pb-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <Badge
                                className={`flex items-center text-xs ${categoryStyle.bgColor} ${categoryStyle.textColor} px-2 py-1 font-medium rounded-md transition-all duration-300 ${
                                    isHovered ? 'shadow-[0_0_8px_rgba(34,211,238,0.4)]' : ''
                                }`}
                            >
                                <TiSpanner className="w-5 h-5" />
                                <span className={`ml-1 text-fill-base ${isHovered ? 'text-fill-auto text-fill-fast' : ''}`}>
                                    {categoryStyle.name}
                                </span>
                            </Badge>
                            <Badge
                                className={`text-xs ${companyStyle.bgColor} ${companyStyle.textColor} px-2 py-1 font-medium rounded-md transition-all duration-300 ${
                                    isHovered ? 'shadow-[0_0_8px_rgba(34,211,238,0.4)]' : ''
                                }`}
                            >
                                <span className={`text-fill-base ${isHovered ? 'text-fill-auto text-fill-fast' : ''}`}>
                                    {repairCase.company || '기타 제조사'}
                                </span>
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="p-3 pt-2">
                        <h3 className={`text-base sm:text-lg font-bold text-white mb-3 line-clamp-1 transition-all duration-300 ${
                            isHovered ? 'text-fill-hover-fast text-shadow-[0_0_10px_rgba(34,211,238,0.5)]' : ''
                        }`}>
                            {repairCase.title}
                        </h3>

                        <div className={`relative w-full h-40 sm:h-48 lg:h-56 mb-3 overflow-hidden rounded-md bg-gray-700 transition-all duration-300 ${
                            isHovered ? 'shadow-[0_0_12px_rgba(34,211,238,0.3)] ring-1 ring-cyan-400/30' : ''
                        }`}>
                            {imageUrl ? (
                                <Image
                                    src={imageUrl}
                                    alt={repairCase.title || '정비 사례 이미지'}
                                    fill
                                    loading="lazy"
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                    className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bc"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <FaTools className="w-12 h-12 text-gray-500" />
                                </div>
                            )}
                            <div className={`absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent transition-opacity duration-300 ${
                                isHovered ? 'opacity-20' : 'opacity-40'
                            }`} />

                            {/* 호버 시 네온 글로우 오버레이 */}
                            {isHovered && (
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent"
                                    initial={{ opacity: 0, x: '-100%' }}
                                    animate={{ opacity: 1, x: '100%' }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    style={{
                                        background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.2), transparent)'
                                    }}
                                />
                            )}
                        </div>

                        <div className="h-12 overflow-hidden text-xs sm:text-sm text-gray-300">
                            {repairCase.contents ? (
                                <div
                                    className={`line-clamp-2 transition-all duration-500 ${isHovered ? 'text-white' : 'text-white/70'}`}
                                    dangerouslySetInnerHTML={{
                                        __html: repairCase.contents
                                            .replace(/<[^>]*>/g, ' ')
                                            .slice(0, 180) + '...'
                                    }}
                                />
                            ) : (
                                <p className={`text-fill-base ${isHovered ? 'text-fill-wave' : ''}`}>
                                    자세한 내용은 클릭하여 확인하세요.
                                </p>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="p-3 pt-0">
                        <div className="flex items-center justify-between w-full">
                            <span className={`text-xs text-gray-400 text-fill-base transition-all duration-300 ${
                                isHovered ? 'text-fill-hover' : ''
                            }`}>
                                {new Date(repairCase.created_at).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                            <motion.div
                                className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition-all duration-300 ${
                                    isHovered
                                        ? 'opacity-100 text-cyan-400 bg-cyan-400/10 shadow-[0_0_8px_rgba(34,211,238,0.3)]'
                                        : 'opacity-0 text-blue-400'
                                }`}
                                animate={{ x: isHovered ? 0 : -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                <span className="text-fill-base text-fill-auto">
                                    자세히 보기
                                </span>
                                <motion.div
                                    animate={{ rotate: isHovered ? 360 : 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <FaArrowRight size={10} />
                                </motion.div>
                            </motion.div>
                        </div>
                    </CardFooter>

                    {/* 전체 카드 네온 글로우 효과 */}
                    {isHovered && (
                        <motion.div
                            className="absolute inset-0 pointer-events-none rounded-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                boxShadow: 'inset 0 0 20px rgba(34, 211, 238, 0.15)',
                                background: 'radial-gradient(circle at center, rgba(34,211,238,0.05) 0%, transparent 70%)'
                            }}
                        />
                    )}
                </Card>
            </Link>
        </motion.div>
    );
});

RepairCard.displayName = 'RepairCard';

export default RepairCard;
