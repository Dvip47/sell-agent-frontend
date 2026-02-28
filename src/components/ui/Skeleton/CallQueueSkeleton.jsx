import React from 'react';
import { SkeletonBlock, SkeletonTableRow } from './index';

const CallQueueSkeleton = () => {
    return (
        <div className="call-queue-page d-flex flex-column h-100 bg-white">
            {/* Action Bar Skeleton */}
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between flex-shrink-0">
                <div>
                    <SkeletonBlock width="250px" height="1.8rem" className="mb-1" />
                    <SkeletonBlock width="150px" height="0.9rem" />
                </div>
                <SkeletonBlock width="120px" height="2.5rem" borderRadius="100px" />
            </div>

            {/* Table Skeleton */}
            <div className="flex-grow-1 overflow-auto">
                <table className="table modern-table table-hover align-middle mb-0">
                    <thead className="sticky-top bg-light bg-opacity-50 z-1 border-bottom">
                        <tr>
                            <th className="px-4 py-3 border-0" style={{ width: '50px' }}><SkeletonBlock width="20px" height="0.75rem" /></th>
                            <th className="px-4 py-3 border-0"><SkeletonBlock width="120px" height="0.75rem" /></th>
                            <th className="px-4 py-3 border-0"><SkeletonBlock width="100px" height="0.75rem" /></th>
                            <th className="px-4 py-3 border-0"><SkeletonBlock width="100px" height="0.75rem" /></th>
                            <th className="px-4 py-3 border-0"><SkeletonBlock width="80px" height="0.75rem" /></th>
                            <th className="px-4 py-3 border-0"><SkeletonBlock width="60px" height="0.75rem" /></th>
                            <th className="px-4 py-3 border-0 text-end pe-4"><SkeletonBlock width="80px" height="0.75rem" className="ms-auto" /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 10 }).map((_, i) => (
                            <SkeletonTableRow key={i} columns={7} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default React.memo(CallQueueSkeleton);
