'use client'

import { User } from '@supabase/auth-js'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination'
import { useRouter, useSearchParams } from 'next/navigation'

export default function UserList({
                                      users,
                                      total,
                                      page,
                                      pageSize,
                                  }: {
    users: User[]
    total: number
    page: number
    pageSize: number
}) {
    const router = useRouter()
    const totalPages = Math.ceil(total / pageSize)

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(window.location.search)
        params.set('page', newPage.toString())
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>이메일</TableHead>
                        <TableHead>이름</TableHead>
                        <TableHead>역할</TableHead>
                        <TableHead>가입일</TableHead>
                        <TableHead>최근 로그인</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.user_metadata?.name || '미지정'}</TableCell>
                            <TableCell>
                                <Badge variant="outline">{user.user_metadata?.role || '없음'}</Badge>
                            </TableCell>
                            <TableCell>{user.created_at?.slice(0, 10) || '-'}</TableCell>
                            <TableCell>{user.last_sign_in_at?.slice(0, 10) || '-'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination */}
            <Pagination>
                <PaginationContent>
                    {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i}>
                            <PaginationLink
                                isActive={i + 1 === page}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                </PaginationContent>
            </Pagination>
        </div>
    )
}
