import crypto from "crypto";
import {AdminClient} from "@/utils/supabase/admin";
import {createClient} from "@/utils/supabase/server";
import {NextRequest, NextResponse} from "next/server";
import {States} from "@/utils/supabase/types";

// 허용되는 파일 타입들
const ALLOWED_MIME_TYPES = [
    // 이미지
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',

    // 문서
    'application/pdf',
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.hancom.hwp', // .hwp
    'application/x-hwp', // .hwp (다른 MIME 타입)

    // 스프레드시트
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx

    // 프레젠테이션
    'application/vnd.ms-powerpoint', // .ppt
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx

    // 텍스트
    'text/plain', // .txt
    'text/csv', // .csv

    // 압축 파일
    'application/zip',
    'application/x-zip-compressed',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
];

// 허용되는 파일 확장자들 (MIME 타입이 정확하지 않은 경우를 위해)
const ALLOWED_EXTENSIONS = [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
    '.pdf', '.doc', '.docx', '.hwp',
    '.xls', '.xlsx', '.ppt', '.pptx',
    '.txt', '.csv', '.zip', '.rar', '.7z'
];

export async function POST(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action !== 'fileUpload') {
        return NextResponse.json(
            { success: false, error: 'Invalid action' },
            { status: 400 }
        );
    }

    const formData = await request.formData();
    let file = formData.get('files[0]') as File | null;

    if (!file) {
        file = formData.get('file') as File | null;
    }

    if (!file) {
        return NextResponse.json(
            { success: false, error: 'No file uploaded' },
            { status: 400 }
        );
    }

    // 파일 타입 검증
    const isValidMimeType = ALLOWED_MIME_TYPES.includes(file.type);
    const fileName = file.name.toLowerCase();
    const isValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));

    if (!isValidMimeType && !isValidExtension) {
        return NextResponse.json(
            {
                success: false,
                error: '지원하지 않는 파일 형식입니다. (이미지, PDF, 워드, 한글, 엑셀, 파워포인트, 텍스트, 압축 파일만 가능)'
            },
            { status: 400 }
        );
    }

    // 파일 크기 제한 (50MB로 증가 - 문서 파일들이 이미지보다 클 수 있음)
    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
            { success: false, error: '파일 크기는 50MB 이하여야 합니다.' },
            { status: 400 }
        );
    }

    try {
        const result = await uploadFile(file);
        if (result.success) {
            return NextResponse.json({ success: true, data: result.data });
        } else {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            );
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error
            ? error.message
            : 'Unknown error occurred'
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

async function uploadFile(file: File): Promise<States> {
    const supabase = AdminClient();
    const supabaseClient = await createClient()
    const { data : { user }} = await supabaseClient.auth.getUser()

    try {
        if (!user) {
            return { success: false, data: '', error: '사용자 인증 실패: 사용자 정보를 찾을 수 없습니다.' };
        }

        // 파일 확장자 추출
        const originalName = file.name;
        const fileExtension = originalName.substring(originalName.lastIndexOf('.'));

        // 고유한 파일명 생성 (원본 파일명 정보 포함)
        const timestamp = Date.now();
        const randomId = crypto.randomUUID();
        const fileName = `${timestamp}_${randomId}${fileExtension}`;

        // 파일 타입에 따라 다른 스토리지 버킷이나 경로 사용 가능
        const isImage = file.type.startsWith('image/');
        const bucketPath = isImage ? `images/${fileName}` : `files/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('store')
            .upload(bucketPath, file, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return { success: false, data: '', error: '파일 업로드 실패: ' + uploadError.message };
        }

        // 업로드된 파일의 공개 URL 가져오기
        const { data: { publicUrl } } = supabase.storage
            .from('store')
            .getPublicUrl(bucketPath);

        return { success: true, data: publicUrl, error: '' };
    } catch(error: unknown) {
        console.error('File upload error:', error);
        const errorMessage = error instanceof Error
            ? error.message
            : 'Unknown error occurred';
        return { success: false, data: '', error: errorMessage };
    }
}
