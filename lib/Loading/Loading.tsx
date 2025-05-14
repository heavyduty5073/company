'use client'

import Image from 'next/image'

export default function GlobalLoader() {
    return (
        <div className="global-loader-container">
            <div className="global-loader-content">
                <div className="global-loader-image-container">
                    <Image
                        src="/logo/mainLogo.png"
                        alt="로딩 이미지"
                        width={140}
                        height={140}
                        priority
                        className="global-loader-image"
                    />
                </div>
            </div>
        </div>
    )
}
