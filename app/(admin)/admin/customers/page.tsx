import React, { Suspense } from 'react';
import { getUsers } from "@/app/(admin)/admin/customers/actions";
import UserList from "@/components/admin/customers/UserList";
import UserListSkeleton from "@/components/ui/skeletons/admin/UserListSkeleton";

// 메인 컴포넌트 (캐싱을 위해 별도 분리)
async function UserManagementPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const { page } = await searchParams;
    const pageNumber = parseInt(page || '1', 10)
    const pageSize = 20

    const result = await getUsers(pageNumber, pageSize)

    if (result.code !== 0 || !result.data) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">유저 목록</h1>
                <p className="text-red-500">유저 데이터를 불러오는 데 실패했습니다.</p>
            </div>
        )
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">유저 목록</h1>
            <UserList
                users={result.data}
                total={result.pagination.total}
                page={result.pagination.page}
                pageSize={result.pagination.pageSize}
            />
        </div>
    )
}

// Suspense로 감싸진 최종 컴포넌트
export default function Page({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    return (
        <Suspense fallback={<UserListSkeleton />}>
            <UserManagementPage searchParams={searchParams} />
        </Suspense>
    )
}
