import React, {memo} from "react";
import Image from "next/image";
import { HiMiniXMark } from "react-icons/hi2";
type InquiryType = '부품문의' | '출장문의' | '기술문의';
type ChatStep = 'greeting' | 'inquiry-type' | 'form' | 'success';

interface InquiryData {
    type: InquiryType | null;
    name: string;
    contact: string;
    equipment: string;
}

export const BubbleMessage = memo(({ onClose }: { onClose: () => void }) => (
    <div className="absolute bottom-24 right-0 mb-2 animate-fade-in">
        <div className="relative bg-white rounded-lg shadow-lg px-4 py-3 w-72 md:w-80">
            <p className="text-sm text-gray-800 font-medium pr-4 font-jalnan">
                안녕하세요! 궁금한 것이 있으시면 언제든 물어보세요 👋
            </p>
            {/* 말풍선 꼬리 */}
            <div className="absolute bottom-0 right-4 transform translate-y-full">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
            </div>
            {/* 닫기 버튼 */}
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-lg leading-none w-5 h-5 flex items-center justify-center"
                aria-label="말풍선 닫기"
            >
                <HiMiniXMark className={'w-5 h-5'}/>
            </button>
        </div>
    </div>
));

BubbleMessage.displayName = 'BubbleMessage';

// 문의 말풍선 컴포넌트
export const InquiryBubble = memo(({
                                       step,
                                       inquiryData,
                                       onClose,
                                       onInquiryTypeSelect,
                                       onInputChange,
                                       onSubmit,
                                       isSubmitting
                                   }: {
    step: ChatStep;
    inquiryData: InquiryData;
    onClose: () => void;
    onInquiryTypeSelect: (type: InquiryType) => void;
    onInputChange: (field: keyof InquiryData, value: string) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}) => {
    const renderContent = () => {
        switch (step) {
            case 'inquiry-type':
                return (
                    <div className="pr-4">
                        <p className="text-sm text-gray-800 font-jalnan mb-3">
                            어떤 문의를 도와드릴까요?
                        </p>
                        <div className="space-y-2">
                            {(['부품문의', '출장문의', '기술문의'] as InquiryType[]).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => onInquiryTypeSelect(type)}
                                    className="w-full text-left font-bold px-3 py-2 text-sm bg-gray-50 hover:bg-amber-50 rounded-md transition-colors"
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 'form':
                return (
                    <div className="pr-4">
                        <p className="text-sm text-gray-800 font-jalnan mb-3">
                            {inquiryData.type} 정보를 입력해주세요
                        </p>
                        <div className="space-y-3">
                            <div>
                                <label className="block font-bold text-xs text-gray-600 mb-1">
                                    성함 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={inquiryData.name}
                                    onChange={(e) => onInputChange('name', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-amber-500"
                                    placeholder="이름을 입력해주세요"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-xs text-gray-600 mb-1">
                                    연락처 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={inquiryData.contact}
                                    onChange={(e) => onInputChange('contact', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-amber-500"
                                    placeholder="전화번호를 입력해주세요"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">
                                    장비명 (선택)
                                </label>
                                <input
                                    type="text"
                                    value={inquiryData.equipment}
                                    onChange={(e) => onInputChange('equipment', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-amber-500"
                                    placeholder="장비명을 입력해주세요"
                                />
                            </div>
                            <button
                                onClick={onSubmit}
                                disabled={isSubmitting}
                                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white text-sm py-2 rounded transition-colors"
                            >
                                {isSubmitting ? '접수 중...' : '문의 접수'}
                            </button>
                        </div>
                    </div>
                );

            case 'success':
                return (
                    <div className="pr-4 text-center">
                        <p className="text-sm text-gray-800 font-medium mb-2">
                            ✅ 문의가 접수되었습니다!
                        </p>
                        <p className="text-xs text-gray-600">
                            빠른 시일 내에 연락드리겠습니다.
                        </p>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="absolute bottom-24 right-0 mb-2 animate-fade-in">
            <div className="relative border-2 border-amber-500 bg-white rounded-lg shadow-lg px-4 py-3 w-80 md:w-96 max-h-96 overflow-y-auto">
                {renderContent()}

                {/* 말풍선 꼬리 */}
                <div className="absolute bottom-0 right-4 transform translate-y-full">
                    <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
                </div>

                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-700 hover:text-gray-800 text-lg leading-none w-5 h-5 flex items-center justify-center"
                    aria-label="말풍선 닫기"
                >
                    <HiMiniXMark className={'w-6 h-6'}/>
                </button>
            </div>
        </div>
    );
});

InquiryBubble.displayName = 'InquiryBubble';

// 챗봇 버튼 컴포넌트 분리 및 메모이제이션
export const ChatbotButton = memo(({ onClick }: { onClick: () => void }) => (
    <button
        className="flex justify-center items-center bg-amber-500 rounded-md w-20 h-20 cursor-pointer hover:bg-amber-600 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
        onClick={onClick}
        aria-label="챗봇 열기"
    >
        <Image
            src="/home/chatbot_remove.png"
            alt="chatbot"
            width={100}
            height={100}
            className="animate-bounce-subtle"
            priority={false}
            loading="lazy"
        />
    </button>
));

ChatbotButton.displayName = 'ChatbotButton';
