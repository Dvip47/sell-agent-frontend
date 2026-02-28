import React from 'react';

const SkeletonTableRow = ({ columns = 6 }) => {
    return (
        <tr className="skeleton-row border-bottom" style={{ borderBottom: '1px solid #f0f0f0' }}>
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="px-4 py-4">
                    <div
                        className="skeleton"
                        style={{
                            width: i === 0 ? '24px' : '100%',
                            height: '0.875rem',
                            borderRadius: '0.25rem'
                        }}
                    />
                </td>
            ))}
        </tr>
    );
};

export default React.memo(SkeletonTableRow);
