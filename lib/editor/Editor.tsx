'use client'
import React, {useState, useEffect, forwardRef, useImperativeHandle, useCallback, useRef} from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { Node } from '@tiptap/core';
import { mergeAttributes } from '@tiptap/core';
import useAlert from "@/lib/notiflix/useAlert";
import Sticker from './Sticker';
import { VideoIcon } from "@/utils/icons/Video";
import { SlPicture } from "react-icons/sl";
import { BoldIcon } from "@/utils/icons/Bold";
import { ItalicIcon } from "@/utils/icons/Italic";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { LuSticker } from "react-icons/lu";
import { HiStrikethrough } from "react-icons/hi2";
import { MdAttachFile } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import EmojiPicker from "@/lib/editor/EmojiPicker";
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import FontFamily from '@tiptap/extension-font-family';
import FontSize from '@/lib/editor/extentions/FontSize';
import {UnderlineIcon} from "@/utils/icons/Underline";
import { FaAlignCenter } from "react-icons/fa6";
import { FaAlignLeft } from "react-icons/fa6";
import { FaAlignRight } from "react-icons/fa6";
import VideoModal from "@/components/editor/VideoModal";
import {FONT_FAMILIES} from "@/lib/editor/fonts/Fonts";
import useLoading from "@/app/hooks/useLoading";

const Video = Node.create({
    name: 'video',
    group: 'block',
    selectable: true,
    draggable: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
        };
    },

    parseHTML() {
        return [{ tag: 'video' }];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'video',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                controls: 'true',
                class: 'w-full aspect-video rounded-lg',
            }),
        ];
    },
});

interface EditorProps {
    name: string;
    placeholder?: string;
    defaultValue?: string;
    readOnly?: boolean;
    required?: boolean;
}

export interface EditorRef {
    setContent: (content: string) => void;
}

interface AttachmentFile {
    name: string;
    url: string;
    size: number;
    type: string;
}

const Editor = forwardRef<EditorRef, EditorProps>(({
                                                       name,
                                                       placeholder = '텍스트를 입력해주세요.',
                                                       defaultValue = '',
                                                       readOnly = false,
                                                       required = false,
                                                   }, ref) => {
    const [content, setContent] = useState(defaultValue || '');
    const [showSticker, setShowSticker] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [stickerLink, setStickerLink] = useState("");
    const [imageLinks, setImageLinks] = useState<string[]>([]);
    const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
    const {isLoading,setLoading} = useLoading()
    const { notify } = useAlert();
    const contentRef = useRef(defaultValue || '');

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
            Underline,
            FontFamily,
            FontSize,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto',
                },
            }),
            Youtube.configure({
                HTMLAttributes: {
                    class: 'w-full aspect-video rounded-lg',
                },
            }),
            Video.configure({
                HTMLAttributes: {},
            }),
        ],
        content: defaultValue,
        editorProps: {
            attributes: {
                class: 'prose prose-sm focus:outline-none min-h-screen border border-black max-w-full h-full p-2 overflow-visible',
            },
        },
        onUpdate: ({ editor }) => {
            const newContent = editor.getHTML();
            handleChange(newContent);
        },
    });

    const handleChange = useCallback((newContent: string) => {
        // HTML 컨텐츠를 그대로 유지
        contentRef.current = newContent;
        setContent(newContent);

        // hidden input 값 업데이트
        const hiddenInput = document.getElementById(name) as HTMLInputElement;

        if (hiddenInput) {
            hiddenInput.value = newContent;
        }
    }, [name]);

    const handleVideoSubmit = useCallback((url: string) => {
        if (editor && url) {
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                editor.chain().focus().setYoutubeVideo({
                    src: url
                }).run();
            } else {
                editor.chain().focus().insertContent(`
                <video controls class="w-full aspect-video rounded-lg">
                    <source src="${url}" type="video/mp4">
                </video>
            `).run();
            }
        }
    }, [editor]);

    useEffect(() => {
        const attachmentsInput = document.getElementById('attachments') as HTMLInputElement;
        if (attachmentsInput) {
            attachmentsInput.value = JSON.stringify(attachments);
        }
    }, [attachments]);

    useImperativeHandle(ref, () => ({
        setContent: (newContent: string) => {
            if (editor) {
                editor.commands.setContent(newContent);
                handleChange(newContent);
            }
        }
    }));

    const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && editor) {
            try {
                setLoading(true)

                const formData = new FormData();
                formData.append('files[0]', file);

                const response = await fetch('/api/upload/?action=fileUpload', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();

                if (result.success && result.data) {
                    setImageLinks(prev => [...prev, result.data]);
                    editor.chain().focus().setImage({ src: result.data }).run();
                } else {
                    notify.failure('업로드 할수 없는 형식입니다.');
                }
            } catch (error) {
                notify.failure('이미지 업로드에 실패했습니다.');
            }finally {
                setLoading(false)
                e.target.value = '';
            }

        }
    }, [editor]);

    const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 파일 크기 제한 (예: 10MB)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                notify.failure('파일 크기는 10MB를 초과할 수 없습니다.');
                e.target.value = '';
                return;
            }

            // 허용된 파일 타입 체크
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.hancom.hwp',
                'application/x-hwp',
                'text/plain',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'application/zip',
                'application/x-zip-compressed',
                'image/jpeg',
                'image/png',
                'image/gif'
            ];

            // 파일 확장자로도 체크 (한글파일의 경우 MIME 타입이 정확하지 않을 수 있음)
            const fileName = file.name.toLowerCase();
            const allowedExtensions = ['.pdf', '.doc', '.docx', '.hwp', '.txt', '.xls', '.xlsx', '.ppt', '.pptx', '.zip', '.jpg', '.jpeg', '.png', '.gif'];
            const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

            if (!allowedTypes.includes(file.type) && !hasValidExtension) {
                notify.failure('지원하지 않는 파일 형식입니다. (PDF, 워드, 한글, 엑셀, 파워포인트, 텍스트, 이미지, ZIP 파일만 가능)');
                e.target.value = '';
                return;
            }

            try {
                setLoading(true);

                const formData = new FormData();
                formData.append('files[0]', file);

                const response = await fetch('/api/upload/?action=fileUpload', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();

                if (result.success && result.data) {
                    const newAttachment: AttachmentFile = {
                        name: file.name,
                        url: result.data,
                        size: file.size,
                        type: file.type
                    };

                    setAttachments(prev => [...prev, newAttachment]);
                    notify.success('파일이 업로드되었습니다.');
                } else {
                    notify.failure('업로드 할 수 없는 형식입니다. 서버에서 해당 파일 타입을 지원하지 않습니다.');
                    console.error('Upload failed:', result);
                }
            } catch (error) {
                notify.failure('파일 업로드에 실패했습니다.');
                console.error('Upload error:', error);
            } finally {
                setLoading(false);
                e.target.value = '';
            }
        }
    }, []);

    const removeAttachment = useCallback((index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    }, []);

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const insertEmoji = (emoji: string) => {
        if (editor) {
            editor.chain().focus().insertContent(emoji).run();
        }
    };

    useEffect(() => {
        if (stickerLink && editor) {
            editor.chain().focus().setImage({ src: stickerLink }).run();
            setStickerLink("");
        }
    }, [stickerLink, editor]);

    // 툴바 부분 수정
    const renderToolbar = () => (
        <div className="border-b border-gray-200 p-1 rounded w-full min-w-[100vw]">
            {/* 첫 번째 줄 - 미디어 도구 */}
            <div className="flex w-full mb-2">
                <label className="rounded hover:bg-white/10 cursor-pointer p-1 mr-1">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                    <SlPicture className="w-5 h-5"/>
                </label>
                <label className="rounded hover:bg-white/10 cursor-pointer p-1 mr-1" title="첨부파일">
                    <input
                        type="file"
                        accept="*/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <MdAttachFile className="w-5 h-5"/>
                </label>
                <button
                    type="button"
                    onClick={() => setShowVideoModal(true)}
                    className="rounded hover:bg-white/10 p-1 mr-1"
                    title="동영상"
                >
                    <VideoIcon width={20} height={20}/>
                </button>
                <button
                    type="button"
                    onClick={() => setShowSticker(true)}
                    className="rounded hover:bg-white/10 p-1 mr-1"
                    title="이모티콘"
                >
                    <LuSticker className="w-5 h-5"/>
                </button>
                <button
                    type="button"
                    onClick={() => setShowEmoji(true)}
                    className="rounded hover:bg-white/10 p-1"
                    title="이모지"
                >
                    <MdOutlineEmojiEmotions className="w-5 h-5"/>
                </button>
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`rounded hover:bg-white/10 p-1 mr-1 ${editor?.isActive('bold') ? 'bg-white/20' : ''}`}
                >
                    <BoldIcon width={20} height={20}/>
                </button>
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleUnderline().run()}
                    className={`rounded hover:bg-white/10 p-1 mr-1 ${editor?.isActive('underline') ? 'bg-white/20' : ''}`}
                >
                    <UnderlineIcon width={20} height={20}/>
                </button>
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`rounded hover:bg-white/10 p-1 mr-1 ${editor?.isActive('italic') ? 'bg-white/20' : ''}`}
                >
                    <ItalicIcon width={20} height={20}/>
                </button>
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                    className={`rounded hover:bg-white/10 p-1 ${editor?.isActive('strike') ? 'bg-white/20' : ''}`}
                >
                    <HiStrikethrough className="w-5 h-5"/>
                </button>
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                    className={`rounded hover:bg-white/10 p-1 mr-1 ${editor?.isActive({textAlign: 'left'}) ? 'bg-white/20' : ''}`}
                >
                    <FaAlignLeft className="w-4 h-4"/>
                </button>
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                    className={`rounded hover:bg-white/10 p-1 mr-1 ${editor?.isActive({textAlign: 'center'}) ? 'bg-white/20' : ''}`}
                >
                    <FaAlignCenter className="w-4 h-4"/>
                </button>
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                    className={`rounded hover:bg-white/10 p-1 mr-1 ${editor?.isActive({textAlign: 'right'}) ? 'bg-white/20' : ''}`}
                >
                    <FaAlignRight className="w-4 h-4"/>
                </button>
                <input
                    type="color"
                    className="w-7 h-7 rounded cursor-pointer"
                    onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}
                />
            </div>
            {/*두번째 줄*/}
            <div className="flex w-full mb-2">
                <select
                    className="border border-gray-300 rounded px-1 py-1 text-sm w-full"
                    onChange={(e) => editor?.chain().focus().setFontFamily(e.target.value).run()}
                >
                    {FONT_FAMILIES.map(font => (
                        <option key={font.value} value={font.value}>
                            {font.label}
                        </option>
                    ))}
                </select>

                <select
                    className="border border-gray-300 rounded px-1 py-1 text-sm w-full"
                    onChange={(e) => editor?.chain().focus().setFontSize(e.target.value).run()}
                >
                    {[12, 14, 16, 18, 20, 24, 28, 32].map(size => (
                        <option key={size} value={`${size}px`}>{size}px</option>
                    ))}
                </select>
            </div>
        </div>
    );

    // 첨부파일 목록 렌더링
    const renderAttachments = () => {
        if (attachments.length === 0) return null;

        return (
            <div className="border-t border-gray-200 p-2">
                <h4 className="text-sm font-medium mb-2">첨부파일 ({attachments.length})</h4>
                <div className="space-y-2">
                    {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div className="flex items-center space-x-2">
                                <MdAttachFile className="w-4 h-4 text-gray-500" />
                                <div>
                                    <span className="text-sm font-medium">{file.name}</span>
                                    <span className="text-xs text-gray-500 ml-2">({formatFileSize(file.size)})</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeAttachment(index)}
                                className="text-red-500 hover:text-red-700 p-1"
                                title="삭제"
                            >
                                <IoClose className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="rounded relative w-full border border-gray-300">
            <input
                type="hidden"
                id={name}
                name={name}
                value={content}
                required={required}
            />
            <input
                type="hidden"
                id="attachments"
                name="attachments"
                value={JSON.stringify(attachments)}
            />

            {!readOnly && renderToolbar()}

            <div className="w-full h-auto lg:h-full overflow-y-auto">
                <EditorContent editor={editor} className="w-full h-full"/>
            </div>

            {!readOnly && renderAttachments()}

            <Sticker
                show={showSticker}
                setShow={setShowSticker}
                setStickerLink={setStickerLink}
            />
            <EmojiPicker
                show={showEmoji}
                setShow={setShowEmoji}
                onEmojiSelect={insertEmoji}
            />
            <VideoModal
                show={showVideoModal}
                onClose={() => setShowVideoModal(false)}
                onSubmit={handleVideoSubmit}
            />
        </div>
    );
});

Editor.displayName = 'Editor';

export default Editor;
