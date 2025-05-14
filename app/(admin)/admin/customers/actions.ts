'use server'

import { createClient } from '@/utils/supabase/server'
import { ERROR_CODES } from '@/utils/ErrorMessage'
import {AdminClient} from "@/utils/supabase/admin";

/**
 * 유저 목록 조회 (auth.admin.listUsers 사용)
 */
export async function getUsers(page: number = 1, pageSize: number = 20) {
    try {
        const supabase = await createClient()
        const adminSupabase = AdminClient()
        // 인증 및 관리자 확인
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return {
                code: ERROR_CODES.AUTH_ERROR,
                message: '로그인이 필요합니다.',
            }
        }

        if (user.user_metadata?.role !== 'admin') {
            return {
                code: ERROR_CODES.UNAUTHORIZED,
                message: '관리자 권한이 필요합니다.',
            }
        }

        // 전체 유저 리스트 조회
        const { data, error } = await adminSupabase.auth.admin.listUsers()

        if (error || !data || !data.users) {
            console.error('Error fetching user list:', error)
            return {
                code: ERROR_CODES.DB_ERROR,
                message: '유저 목록 조회 중 오류가 발생했습니다.',
            }
        }

        const total = data.users.length
        const totalPages = Math.ceil(total / pageSize)

        // 유효성 보정
        if (page < 1) page = 1
        if (pageSize < 1 || pageSize > 100) pageSize = 20

        // 페이지네이션 처리
        const from = (page - 1) * pageSize
        const to = from + pageSize

        const pagedUsers = data.users.slice(from, to)

        return {
            code: ERROR_CODES.SUCCESS,
            data: pagedUsers,
            pagination: {
                total,
                page,
                pageSize,
                totalPages,
            },
        }
    } catch (error) {
        console.error('Unexpected error in getUsers:', error)
        return {
            code: ERROR_CODES.SERVER_ERROR,
            message: '서버 오류가 발생했습니다.',
        }
    }
}

/**
 * 유저 상세 정보 조회 (auth.admin.getUserById 사용)
 */
export async function getUserDetail(userId: string) {
    try {
        const supabase = await createClient()
        const adminSupabase = AdminClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return {
                code: ERROR_CODES.AUTH_ERROR,
                message: '로그인이 필요합니다.',
            }
        }

        if (user.user_metadata?.role !== 'admin') {
            return {
                code: ERROR_CODES.UNAUTHORIZED,
                message: '관리자 권한이 필요합니다.',
            }
        }

        // 단일 유저 조회
        const { data, error } = await adminSupabase.auth.admin.getUserById(userId)

        if (error || !data) {
            console.error('Error fetching user detail:', error)
            return {
                code: ERROR_CODES.DB_ERROR,
                message: '유저 상세 정보 조회 중 오류가 발생했습니다.',
            }
        }

        return {
            code: ERROR_CODES.SUCCESS,
            data,
        }
    } catch (error) {
        console.error('Unexpected error in getUserDetail:', error)
        return {
            code: ERROR_CODES.SERVER_ERROR,
            message: '서버 오류가 발생했습니다.',
        }
    }
}

/**
 * 유저 역할 변경 (user_metadata.role 업데이트)
 */
export async function changeUserRole(userId: string, role: string) {
    try {
        const supabase = await createClient()
        const adminSupabase = AdminClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
            return {
                code: ERROR_CODES.AUTH_ERROR,
                message: '로그인이 필요합니다.',
            }
        }

        if (user.user_metadata?.role !== 'admin') {
            return {
                code: ERROR_CODES.UNAUTHORIZED,
                message: '관리자 권한이 필요합니다.',
            }
        }

        if (user.id === userId) {
            return {
                code: ERROR_CODES.VALIDATION_ERROR,
                message: '본인의 역할은 변경할 수 없습니다.',
            }
        }

        const { error } = await adminSupabase.auth.admin.updateUserById(userId, {
            user_metadata: { role },
        })

        if (error) {
            console.error('Error updating user role:', error)
            return {
                code: ERROR_CODES.DB_ERROR,
                message: '유저 역할 변경 중 오류가 발생했습니다.',
            }
        }

        return {
            code: ERROR_CODES.SUCCESS,
            message: '유저 역할이 성공적으로 변경되었습니다.',
        }
    } catch (error) {
        console.error('Unexpected error in changeUserRole:', error)
        return {
            code: ERROR_CODES.SERVER_ERROR,
            message: '서버 오류가 발생했습니다.',
        }
    }
}
