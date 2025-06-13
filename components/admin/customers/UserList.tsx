'use client'

import { User } from '@supabase/auth-js'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useCallback, useMemo, useTransition } from "react"
import FormContainer from "@/components/ui/form"
import { changeUserRole } from "@/app/(admin)/admin/customers/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface UserListProps {
    users: User[]
    total: number
    page: number
    pageSize: number
}

// 역할 설정을 상수로 분리 (메모리 최적화)
const ROLES = {
    admin: { label: '관리자', color: 'bg-green-500 hover:bg-green-600' },
    manager: { label: '직원', color: 'bg-blue-500 hover:bg-blue-600' },
    user: { label: '유저', color: 'bg-yellow-500 hover:bg-yellow-600' },
} as const

export default function UserList({ users, total, page, pageSize }: UserListProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({})

    // 총 페이지 수 메모이제이션
    const totalPages = useMemo(() => Math.ceil(total / pageSize), [total, pageSize])

    // 페이지 변경 핸들러 최적화
    const handlePageChange = useCallback((newPage: number) => {
        startTransition(() => {
            const params = new URLSearchParams(window.location.search)
            params.set('page', newPage.toString())
            router.push(`?${params.toString()}`)
        })
    }, [router])

    // 역할 선택 핸들러 최적화
    const handleRoleSelect = useCallback((userId: string, role: string) => {
        setSelectedRoles(prev => ({
            ...prev,
            [userId]: role
        }))
    }, [])

    // 폼 결과 핸들러 최적화
    const handleFormResult = useCallback((result: any) => {
        if (result.code === 0) {
            setSelectedRoles({})
            startTransition(() => {
                router.refresh()
            })
        }
    }, [router])

    // 역할 정보 가져오기 함수 최적화
    const getRoleInfo = useCallback((role: string) => {
        return ROLES[role as keyof typeof ROLES] || {
            label: '없음',
            color: 'bg-gray-500 hover:bg-gray-600'
        }
    }, [])

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>이메일</TableHead>
                        <TableHead>이름</TableHead>
                        <TableHead>현재 역할</TableHead>
                        <TableHead>권한 변경</TableHead>
                        <TableHead>가입일</TableHead>
                        <TableHead>최근 로그인</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => {
                        const currentRole = user.user_metadata?.role || 'user'
                        const selectedRole = selectedRoles[user.id]
                        const roleInfo = getRoleInfo(currentRole)

                        return (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.email}</TableCell>
                                <TableCell>{user.user_metadata?.name || '미지정'}</TableCell>
                                <TableCell>
                                    <Badge
                                        className={`${roleInfo.color} text-white`}
                                        variant="outline"
                                    >
                                        {roleInfo.label}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <FormContainer
                                        action={changeUserRole}
                                        onResult={handleFormResult}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="hidden"
                                                name="userId"
                                                value={user.id}
                                            />

                                            <Select
                                                name="role"
                                                value={selectedRole || ''}
                                                onValueChange={(role) => handleRoleSelect(user.id, role)}
                                                required
                                            >
                                                <SelectTrigger className="w-32">
                                                    <SelectValue placeholder="권한선택" />
                                                </SelectTrigger>
                                                <SelectContent className="border border-black bg-white">
                                                    {Object.entries(ROLES).map(([key, value]) => (
                                                        <SelectItem key={key} value={key}>
                                                            {value.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <Button
                                                type="submit"
                                                size="sm"
                                                disabled={!selectedRole || selectedRole === currentRole || isPending}
                                                className="px-3 py-1 text-xs"
                                            >
                                                {isPending ? '변경중...' : '변경'}
                                            </Button>
                                        </div>
                                    </FormContainer>
                                </TableCell>
                                <TableCell>{user.created_at?.slice(0, 10) || '-'}</TableCell>
                                <TableCell>{user.last_sign_in_at?.slice(0, 10) || '-'}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>

            {/* 최적화된 페이지네이션 */}
            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <PaginationItem key={pageNum}>
                                <PaginationLink
                                    isActive={pageNum === page}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={isPending ? 'opacity-50 pointer-events-none' : ''}
                                >
                                    {pageNum}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    )
}
