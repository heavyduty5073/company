'use client';

import type { Variants } from 'motion/react';
import { motion, useAnimation } from 'motion/react';

const variants: Variants = {
    normal: { pathLength: 1, opacity: 1, pathOffset: 0 },
    animate: {
        pathLength: [0, 1],
        opacity: [0, 1],
        pathOffset: [1, 0],
    },
};

const UnderlineIcon = ({width=28,height=28}) => {
    const controls = useAnimation();

    return (
        <div
            className="cursor-pointer select-none hover:bg-accent rounded-md transition-colors duration-200 flex items-center justify-center"
            onMouseEnter={() => controls.start('animate')}
            onMouseLeave={() => controls.start('normal')}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={width}
                height={height}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <motion.path
                    transition={{ duration: 0.3 }}
                    variants={variants}
                    animate={controls}
                    d="M6 4v6a6 6 0 0 0 12 0V4"
                />
                <motion.line
                    x1="4"
                    x2="20"
                    y1="20"
                    y2="20"
                    variants={variants}
                    transition={{
                        delay: 0.2,
                        duration: 0.4,
                    }}
                    animate={controls}
                />
            </svg>
        </div>
    );
};

export { UnderlineIcon };