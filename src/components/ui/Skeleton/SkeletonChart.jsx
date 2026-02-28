import React from 'react';

const SkeletonChart = ({ height = '300px', className = '' }) => {
    return (
        <div className={`card border-0 shadow-sm p-4 ${className}`} style={{ borderRadius: '1rem', height }}>
            <div className="d-flex justify-content-between align-items-end h-100 gap-2">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={i}
                        className="skeleton"
                        style={{
                            width: '100%',
                            height: `${Math.floor(Math.random() * 60) + 20}%`,
                            borderRadius: '0.25rem 0.25rem 0 0'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default React.memo(SkeletonChart);
