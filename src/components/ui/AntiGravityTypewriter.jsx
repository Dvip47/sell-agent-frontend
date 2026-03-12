import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * AntiGravityTypewriter - Precise character typing animation
 * with a gradient pulsing cursor inspired by antigravity.google.
 */
const AntiGravityTypewriter = ({
    textLines = [],
    delay = 0,
    speed = 0.05,
    onComplete = () => { },
    className = "",
    hTag = "h1"
}) => {
    const [displayedText, setDisplayedText] = useState([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const charIndexRef = useRef(0);

    useEffect(() => {
        if (currentLineIndex >= textLines.length) {
            setIsComplete(true);
            onComplete();
            return;
        }

        const currentLine = textLines[currentLineIndex];
        charIndexRef.current = 0;

        const typeInterval = setInterval(() => {
            if (charIndexRef.current <= currentLine.length) {
                const capturedIndex = charIndexRef.current;
                setDisplayedText(prev => {
                    const newArr = [...prev];
                    newArr[currentLineIndex] = currentLine.slice(0, capturedIndex);
                    return newArr;
                });
                charIndexRef.current++;
            } else {
                clearInterval(typeInterval);
                setTimeout(() => {
                    setCurrentLineIndex(prev => prev + 1);
                }, 500); // Pause between lines
            }
        }, speed * 1000);

        return () => clearInterval(typeInterval);
    }, [currentLineIndex, textLines, speed, onComplete]);

    const Tag = hTag;

    return (
        <div className={`ag-typewriter-container ${className}`}>
            {displayedText.map((line, idx) => (
                <div key={idx} className="ag-typewriter-line" style={{ display: 'flex', alignItems: 'baseline' }}>
                    <Tag
                        className={hTag === 'h1' ? 'awsmd-hero-text' : ''}
                        style={{
                            color: idx === 1 && hTag === 'h1' ? '#ccff00' : 'inherit',
                            marginBottom: idx === 0 && hTag === 'h1' ? '-0.1em' : '0',
                            fontWeight: hTag === 'p' ? 'inherit' : 800
                        }}
                    >
                        {line}
                    </Tag>
                    {idx === currentLineIndex && !isComplete && (
                        <motion.div
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="ag-typewriter-cursor"
                            style={{
                                width: '4px',
                                height: '1.2em',
                                background: 'linear-gradient(to bottom, #ccff00, #ff00ff, #00ffff)',
                                marginLeft: '8px',
                                borderRadius: '2px',
                                transform: 'translateY(10%)'
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default AntiGravityTypewriter;
