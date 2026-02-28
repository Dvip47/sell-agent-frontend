import React from 'react';

const SkeletonText = ({ lines = 1, className = '', lastLineWidth = '70%' }) => {
    return (
        <div className={`d-flex flex-column gap-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="skeleton"
                    style={{
                        width: i === lines - 1 ? lastLineWidth : '100%',
                        height: '0.75rem',
                        borderRadius: '0.25rem'
                    }}
                />
            ))}
        </div>
    );
};

export default React.memo(SkeletonText);
