'use client'
import React from 'react';

function BusinessNumber() {

    return (
        <div className={'flex flex-row items-center gap-1'}>
            <span>사업자등록번호:</span>
        <a
            href="https://www.cretop.com"
            target="_blank"
            rel="noopener noreferrer"
            className={'hover:underline'}
        >
            792-04-01412
        </a>

        </div>
    );
}

export default BusinessNumber;