import React, { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

/**
 * AntiGravityCursor - Direct inspired by antigravity.google
 * A large, smooth, reactive cursor bubble.
 */
const AntiGravityCursor = ({ isHovered = false, text = '' }) => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Spring configuration for that "liquid" smooth lag/inertia
    const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
    const springX = useSpring(cursorX, springConfig);
    const springY = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, [cursorX, cursorY]);

    return (
        <motion.div
            className="ag-cursor-wrapper"
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                translateX: springX,
                translateY: springY,
                pointerEvents: 'none',
                zIndex: 9999,
            }}
        >
            <motion.div
                className="ag-cursor-main"
                animate={{
                    width: isHovered ? 120 : 24,
                    height: isHovered ? 120 : 24,
                    backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.1)' : '#ccff00',
                    border: isHovered ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                    backdropFilter: isHovered ? 'blur(10px)' : 'none',
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                style={{
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'translate(-50%, -50%)', // Anchor to center of mouse
                }}
            >
                {isHovered && text && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ag-cursor-text"
                        style={{
                            color: '#fff',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            textAlign: 'center',
                            pointerEvents: 'none'
                        }}
                    >
                        {text}
                    </motion.span>
                )}
            </motion.div>
        </motion.div>
    );
};

export default AntiGravityCursor;
