'use client'
import React from 'react';
import { Download, FileText, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import {parseAttachments} from "@/utils/utils";

// 첨부파일 다운로드 컴포넌트
function AttachmentDownload({ attachments }: { attachments: any }) {
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleDownload = async (file: any) => {
        try {
            const response = await fetch(file.url);

            // 응답이 성공적이지 않으면 에러 처리
            if (!response.ok) {
                throw new Error(`파일 다운로드 실패: ${response.statusText}`);
            }

            const blob = await response.blob();

            // 다운로드 링크 생성
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = file.name || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('파일 다운로드 실패:', error);
            alert('파일 다운로드에 실패했습니다.');
        }
    };

    // attachments를 안전하게 파싱
    const parsedAttachments = parseAttachments(attachments);

    if (parsedAttachments.length === 0) {
        return null;
    }

    return (
        <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
                <Paperclip className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold">첨부파일 ({parsedAttachments.length})</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                    {parsedAttachments.map((file: any, index: number) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-white rounded-md border hover:shadow-sm transition-shadow"
                        >
                            <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-blue-500" />
                                <div>
                                    <p className="font-medium text-gray-900">{file.name || '파일명 없음'}</p>
                                    <p className="text-sm text-gray-500">
                                        {file.size ? formatFileSize(file.size) : '크기 정보 없음'}
                                        {file.type && ` • ${file.type}`}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(file)}
                                className="flex items-center gap-2"
                                disabled={!file.url}
                            >
                                <Download className="h-4 w-4" />
                                다운로드
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AttachmentDownload;
