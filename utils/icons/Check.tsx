'use client';

import type { Variants } from 'motion/react';
import { motion, useAnimation } from 'motion/react';

const pathVariants: Variants = {
    normal: {
        opacity: 1,
        pathLength: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            opacity: { duration: 0.1 },
        },
    },
    animate: {
        opacity: [0, 1],
        pathLength: [0, 1],
        scale: [0.5, 1],
        transition: {
            duration: 0.4,
            opacity: { duration: 0.1 },
        },
    },
};

const CheckIcon = ({width=28,height=28}) => {
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
                    variants={pathVariants}
                    initial="normal"
                    animate={controls}
                    d="M4 12 9 17L20 6"
                />
            </svg>
        </div>
    );
};

export { CheckIcon };