'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import {ProductWithInventory} from "@/utils/supabase/types";

interface ProductTableProps {
    products: ProductWithInventory[];
}

export default function EcountProductTable({ products }: ProductTableProps) {
    const [sortField, setSortField] = useState<keyof ProductWithInventory>('PROD_CD');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProdType, setSelectedProdType] = useState('');
    const [selectedStockFilter, setSelectedStockFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // 품목유형 매핑
    const prodTypeMap: { [key: string]: string } = {
        '1': '상품',
        '2': '제품',
        '3': '반제품',
        '4': '원재료',
        '5': '부재료',
        '6': '포장재료',
        '7': '저장품',
        '8': '부품'
    };

    // 품목유형 목록 추출
    const prodTypes = useMemo(() => {
        if (!products || products.length === 0) return [];
        const typeSet = new Set(products.map(p => p.PROD_TYPE).filter(Boolean));
        return Array.from(typeSet).sort();
    }, [products]);

    // 필터링 및 정렬된 제품 목록
    const filteredAndSortedProducts = useMemo(() => {
        if (!products || products.length === 0) return [];

        let filtered = products.filter(product => {
            const matchesSearch = (
                product.PROD_CD?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.PROD_DES?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.REMARKS?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.BAR_CODE?.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const matchesType = !selectedProdType || selectedProdType === 'all' || product.PROD_TYPE === selectedProdType;

            // 재고 필터
            let matchesStock = true;
            if (selectedStockFilter && selectedStockFilter !== 'all') {
                const qty = parseFloat(product.BAL_QTY || '0');
                switch (selectedStockFilter) {
                    case 'sufficient': // 충분 (5개 이상)
                        matchesStock = qty >= 5;
                        break;
                    case 'low': // 부족 (1-4개)
                        matchesStock = qty > 0 && qty < 5;
                        break;
                    case 'out': // 재고없음 (0개)
                        matchesStock = qty === 0;
                        break;
                }
            }

            return matchesSearch && matchesType && matchesStock;
        });

        return filtered.sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }

            return 0;
        });
    }, [products, searchTerm, selectedProdType, selectedStockFilter, sortField, sortDirection]);

    // 페이지네이션 계산
    const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

    // 페이지 번호 배열 생성
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const start = Math.max(1, currentPage - 2);
            const end = Math.min(totalPages, start + maxVisiblePages - 1);

            if (start > 1) {
                pages.push(1);
                if (start > 2) pages.push('...');
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < totalPages) {
                if (end < totalPages - 1) pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const handleSort = (field: keyof ProductWithInventory) => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage: string) => {
        setItemsPerPage(Number(newItemsPerPage));
        setCurrentPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleProdTypeChange = (type: string) => {
        setSelectedProdType(type);
        setCurrentPage(1);
    };

    const handleStockFilterChange = (filter: string) => {
        setSelectedStockFilter(filter);
        setCurrentPage(1);
    };

    const formatNumber = (value: string | number) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return isNaN(num) ? '0' : num.toLocaleString();
    };

    const formatStockQuantity = (balQty: string | number) => {
        const qty = typeof balQty === 'string' ? parseFloat(balQty) : balQty;
        if (isNaN(qty)) return <span className="text-gray-500">0</span>;


        // 5개 미만이면 강조 표시
        if (qty > 0 && qty < 5) {
            return (
                <span className="text-orange-600 font-bold">
                    {qty.toLocaleString()}
                </span>
            );
        }

        // 재고 없음
        if (qty === 0) {
            return (
                <span className="text-red-600 font-bold">
                    0
                </span>
            );
        }
        if(qty <0){
            return <span className={'font-semibold text-gray-500'}>{'-'}</span>
        }
        // 정상 재고
        return (
            <span className="text-green-600 font-semibold">
                {qty.toLocaleString()}
            </span>
        );
    };

    const getStockStatusBadge = (balQty: string | number) => {
        const qty = typeof balQty === 'string' ? parseFloat(balQty) : balQty;

        if (isNaN(qty) || qty === 0) {
            return { variant: 'destructive' as const, text: '재고없음', color: 'bg-red-500' };
        }

        if (qty > 0 && qty < 5) {
            return { variant: 'destructive' as const, text: '부족', color: 'bg-orange-500' };
        }

        return { variant: 'default' as const, text: '충분', color: 'bg-green-500' };
    };

    // 안전장치: products가 없거나 빈 배열인 경우
    if (!products || products.length === 0) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-lg font-medium mb-2">데이터가 없습니다</h3>
                    <p className="text-muted-foreground">품목 데이터를 불러오는 중이거나 데이터가 없습니다.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* 검색 및 필터 영역 */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        <div className="flex-1 w-full">
                            <Input
                                type="text"
                                placeholder="품목코드, 품목명, 비고로 검색..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <div className="w-full lg:w-48">
                            <Select value={selectedProdType || 'all'} onValueChange={handleProdTypeChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="모든 품목유형" />
                                </SelectTrigger>
                                <SelectContent className={'bg-white'}>
                                    <SelectItem value="all">모든 품목유형</SelectItem>
                                    {prodTypes.map(type => (
                                        <SelectItem key={type} value={type}>
                                            {prodTypeMap[type] || type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full lg:w-48">
                            <Select value={selectedStockFilter || 'all'} onValueChange={handleStockFilterChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="재고 상태" />
                                </SelectTrigger>
                                <SelectContent className={'bg-white'}>
                                    <SelectItem value="all">모든 재고상태</SelectItem>
                                    <SelectItem value="out">재고없음</SelectItem>
                                    <SelectItem value="low">재고부족 (1-4개)</SelectItem>
                                    <SelectItem value="sufficient">재고충분 (5개 이상)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full lg:w-32">
                            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className={'bg-white'}>
                                    <SelectItem value="10">10개씩</SelectItem>
                                    <SelectItem value="25">25개씩</SelectItem>
                                    <SelectItem value="50">50개씩</SelectItem>
                                    <SelectItem value="100">100개씩</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="text-sm text-muted-foreground whitespace-nowrap">
                            총 {filteredAndSortedProducts.length}개 품목
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 통계 요약 */}
            {filteredAndSortedProducts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-sm font-medium text-muted-foreground">총 품목수</div>
                            <div className="text-2xl font-bold">{filteredAndSortedProducts.length}개</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-sm font-medium text-muted-foreground">재고 충분 (5개 이상)</div>
                            <div className="text-2xl font-bold text-green-600">
                                {filteredAndSortedProducts.filter(p => {
                                    const qty = parseFloat(p.BAL_QTY || '0');
                                    return qty >= 5;
                                }).length}개
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-sm font-medium text-muted-foreground">재고 부족 (1-4개)</div>
                            <div className="text-2xl font-bold text-orange-600">
                                {filteredAndSortedProducts.filter(p => {
                                    const qty = parseFloat(p.BAL_QTY || '0');
                                    return qty > 0 && qty < 5;
                                }).length}개
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-sm font-medium text-muted-foreground">재고 없음</div>
                            <div className="text-2xl font-bold text-red-600">
                                {filteredAndSortedProducts.filter(p => {
                                    const qty = parseFloat(p.BAL_QTY || '0');
                                    return qty === 0;
                                }).length}개
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-sm font-medium text-muted-foreground">음수 재고</div>
                            <div className="text-2xl font-bold text-gray-600">
                                {filteredAndSortedProducts.filter(p => {
                                    const qty = parseFloat(p.BAL_QTY || '0');
                                    return qty < 0;
                                }).length}개
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* 테이블 */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b">
                                <th
                                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => handleSort('PROD_CD')}
                                >
                                    <div className="flex items-center">
                                        품목코드
                                        {sortField === 'PROD_CD' && (
                                            <span className="ml-1 text-primary">
                                                {sortDirection === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => handleSort('PROD_DES')}
                                >
                                    <div className="flex items-center">
                                        품목명
                                        {sortField === 'PROD_DES' && (
                                            <span className="ml-1 text-primary">
                                                {sortDirection === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => handleSort('PROD_TYPE')}
                                >
                                    <div className="flex items-center">
                                        품목유형
                                        {sortField === 'PROD_TYPE' && (
                                            <span className="ml-1 text-primary">
                                                {sortDirection === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th
                                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => handleSort('BAL_QTY')}
                                >
                                    <div className="flex items-center">
                                        현재재고
                                        {sortField === 'BAL_QTY' && (
                                            <span className="ml-1 text-primary">
                                                {sortDirection === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    재고상태
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    비고
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentProducts.map((product, index) => {
                                const stockBadge = getStockStatusBadge(product.BAL_QTY || 0);
                                return (
                                    <tr key={`${product.PROD_CD}-${index}`} className="border-b hover:bg-muted/50 transition-colors">
                                        <td className="p-4 align-middle">
                                            <div className="font-mono text-sm font-medium">{product.PROD_CD}</div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="font-medium max-w-xs">{product.PROD_DES}</div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Badge variant="outline" className="bg-blue-50">
                                                {prodTypeMap[product.PROD_TYPE] || product.PROD_TYPE}
                                            </Badge>
                                        </td>
                                        <td className="p-4 align-middle text-lg font-semibold">
                                            {formatStockQuantity(product.BAL_QTY || 0)}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Badge variant={stockBadge.variant} className={`text-white ${stockBadge.color}`}>
                                                {stockBadge.text}
                                            </Badge>
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground text-sm max-w-xs truncate">
                                            {product.REMARKS || '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                총 {filteredAndSortedProducts.length}개 중 {startIndex + 1}-{Math.min(endIndex, filteredAndSortedProducts.length)}개 표시
                            </div>
                            <div className="flex items-center space-x-2">
                                {/* 첫 페이지로 */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>

                                {/* 이전 페이지 */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                {/* 페이지 번호들 */}
                                {getPageNumbers().map((page, index) => (
                                    page === '...' ? (
                                        <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                                            ...
                                        </span>
                                    ) : (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePageChange(page as number)}
                                        >
                                            {page}
                                        </Button>
                                    )
                                ))}

                                {/* 다음 페이지 */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>

                                {/* 마지막 페이지로 */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {filteredAndSortedProducts.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-lg font-medium mb-2">검색 결과가 없습니다</h3>
                        <p className="text-muted-foreground">검색 조건을 변경하거나 필터를 초기화해보세요.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
