'use client'

import { User } from '@supabase/auth-js'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import FormContainer from "@/components/ui/form"
import { changeUserRole } from "@/app/(admin)/admin/customers/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
    const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({})

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(window.location.search)
        params.set('page', newPage.toString())
        router.push(`?${params.toString()}`)
    }

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-green-500 hover:bg-green-600'
            case 'manager':
                return 'bg-blue-500 hover:bg-blue-600'
            case 'user':
                return 'bg-yellow-500 hover:bg-yellow-600'
            default:
                return 'bg-gray-500 hover:bg-gray-600'
        }
    }

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'admin':
                return '관리자'
            case 'manager':
                return '직원'
            case 'user':
                return '유저'
            default:
                return '없음'
        }
    }

    const handleRoleSelect = (userId: string, role: string) => {
        setSelectedRoles(prev => ({
            ...prev,
            [userId]: role
        }))
    }

    const handleFormResult = (result: any) => {
        if (result.code === 0) { // SUCCESS
            // 성공 시 선택된 역할 초기화
            setSelectedRoles({})
            // 페이지 새로고침으로 최신 데이터 가져오기
            router.refresh()
        }
    }

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

                        return (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.email}</TableCell>
                                <TableCell>{user.user_metadata?.name || '미지정'}</TableCell>
                                <TableCell>
                                    <Badge
                                        className={`${getRoleBadgeColor(currentRole)} text-white`}
                                        variant="outline"
                                    >
                                        {getRoleLabel(currentRole)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <FormContainer
                                        action={changeUserRole}
                                        onResult={handleFormResult}
                                    >
                                        <div className="flex items-center gap-2">
                                            {/* Hidden input for userId */}
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
                                                <SelectContent className={'border border-black bg-white'}>
                                                    <SelectItem value="user">
                                                        유저
                                                    </SelectItem>
                                                    <SelectItem value="manager">
                                                        직원
                                                    </SelectItem>
                                                    <SelectItem value="admin">
                                                        관리자
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Button
                                                type="submit"
                                                size="sm"
                                                disabled={!selectedRole || selectedRole === currentRole}
                                                className="px-3 py-1 text-xs"
                                            >
                                                변경
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
