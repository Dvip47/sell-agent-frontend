import React from 'react';

const SkeletonAvatar = ({ size = '36px', className = '' }) => {
    return (
        <div
            className={`skeleton rounded-circle ${className}`}
            style={{ width: size, height: size }}
        />
    );
};

export default React.memo(SkeletonAvatar);
