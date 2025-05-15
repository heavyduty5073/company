"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';

interface NoticeSearchProps {
    type: string;
}

const NoticeSearch: React.FC<NoticeSearchProps> = ({ type }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`${pathname}?type=${type}&search=${encodeURIComponent(searchTerm)}&page=1`);
        } else {
            router.push(`${pathname}?type=${type}&page=1`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="flex gap-2 mb-2">
            <div className="relative flex-grow">
                <input
                    type="text"
                    placeholder="검색어를 입력하세요..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute top-1/2 transform -translate-y-1/2 right-3 h-5 w-5 text-gray-400" />
            </div>
            <Button className={'border border-black w-20 h-10'} type="submit">검색</Button>
        </form>
    );
};

export default NoticeSearch;