import React from 'react';

const SkeletonBlock = ({ className = '', width = '100%', height = '1rem', borderRadius = '0.5rem' }) => {
    return (
        <div
            className={`skeleton ${className}`}
            style={{
                width,
                height,
                borderRadius
            }}
        />
    );
};

export default React.memo(SkeletonBlock);
