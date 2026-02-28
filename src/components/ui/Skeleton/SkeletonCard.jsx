import React from 'react';

const SkeletonCard = ({ height = '150px', className = '' }) => {
    return (
        <div className={`card border-0 shadow-sm p-4 h-100 ${className}`} style={{ borderRadius: '1rem' }}>
            <div className="d-flex flex-column gap-3 h-100">
                <div className="skeleton" style={{ width: '40%', height: '0.75rem', borderRadius: '0.25rem' }} />
                <div className="skeleton" style={{ width: '60%', height: '1.5rem', borderRadius: '0.5rem', marginTop: 'auto' }} />
                <div className="skeleton" style={{ width: '100%', height: '4px', borderRadius: '1rem' }} />
            </div>
        </div>
    );
};

export default React.memo(SkeletonCard);
