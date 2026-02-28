import React from 'react';

const SkeletonBadge = ({ width = '60px', height = '20px', className = '' }) => {
    return (
        <div
            className={`skeleton rounded-pill ${className}`}
            style={{ width, height }}
        />
    );
};

export default React.memo(SkeletonBadge);
