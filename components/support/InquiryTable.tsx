"use client";

import React from 'react';
import Link from 'next/link';
import {Inquiry, InquiryWithUser} from '@/utils/supabase/types';
import { User } from '@supabase/supabase-js';
import {formatDate} from "@/utils/utils";

interface InquiryTableProps {
    inquiries: InquiryWithUser[];
    user: User | null;
}

const InquiryTable: React.FC<InquiryTableProps> = ({ inquiries, user }) => {
    // 현재 사용자가 관리자인지 확인
    const isAdmin = user?.user_metadata?.role === 'admin';

    return (
        <div className="overflow-x-auto">
            {/* 문의하기 버튼 (관리자가 아닌 경우만 표시) */}
            {!isAdmin && (
                <div className="my-4 flex justify-end">
                    <Link
                        href="/support/write?type=inquiry"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        문의하기
                    </Link>
                </div>
            )}

            <table className="min-w-full bg-white border border-black/50">
                <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">제목</th>
                    {/* 관리자에게만 작성자 열 표시 */}
                    {isAdmin && <th className="py-3 px-6 text-left">작성자</th>}
                    <th className="py-3 px-6 text-left">작성일</th>
                    <th className="py-3 px-6 text-right">상태</th>
                </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                {inquiries.length > 0 ? (
                    inquiries.map((inquiry:InquiryWithUser) => (
                        <tr key={inquiry.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-6">
                                <Link
                                    href={isAdmin
                                        ? `/admin/support/detail?id=${inquiry.id}&type=inquiry`
                                        : `/support/${inquiry.id}?type=inquiry`}
                                    className="hover:text-blue-500"
                                >
                                    {inquiry.title}
                                </Link>
                            </td>
                            {/* 관리자에게만 작성자 정보 표시 */}
                            {isAdmin && (
                                <td className="py-3 px-6">
                                    {inquiry?.user_email || '알 수 없음'}
                                </td>
                            )}
                            <td className="py-3 px-6">{formatDate(inquiry.created_at)}</td>
                            <td className="py-3 px-6 text-right">
                                {inquiry.answer ? (
                                    <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs">
                                        답변완료
                                    </span>
                                ) : (
                                    <span className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-xs">
                                        답변대기
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={isAdmin ? 4 : 3} className="py-6 text-center">
                            문의 내역이 없습니다.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default InquiryTable;