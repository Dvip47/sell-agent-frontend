import React from 'react';
import { SkeletonBlock, SkeletonTableRow } from './index';

const LeadsPageSkeleton = () => {
    return (
        <div className="container-fluid py-4 px-4 h-100 d-flex flex-column">
            {/* Header Skeleton */}
            <div className="d-flex align-items-center justify-content-between mb-4 flex-shrink-0">
                <div>
                    <SkeletonBlock width="250px" height="2.5rem" className="mb-2" />
                    <SkeletonBlock width="180px" height="1rem" borderRadius="100px" />
                </div>
                <SkeletonBlock width="180px" height="2.5rem" borderRadius="100px" />
            </div>

            {/* Toolbar Skeleton */}
            <div className="row g-3 mb-4 flex-shrink-0 align-items-center">
                <div className="col-md-5">
                    <SkeletonBlock width="100%" height="3rem" borderRadius="1rem" />
                </div>
                <div className="col-md-7 d-flex justify-content-end gap-2">
                    <SkeletonBlock width="100px" height="2.5rem" borderRadius="1rem" />
                    <SkeletonBlock width="50px" height="2.5rem" borderRadius="1rem" />
                </div>
            </div>

            {/* Table Skeleton */}
            <div className="flex-grow-1 overflow-hidden bg-white border rounded-4 shadow-sm position-relative d-flex flex-column">
                <div className="table-responsive">
                    <table className="table modern-table table-hover align-middle mb-0">
                        <thead className="sticky-top bg-white border-bottom z-1">
                            <tr>
                                <th className="px-4 py-3 border-0" style={{ width: '60px' }}><SkeletonBlock width="20px" height="0.75rem" /></th>
                                <th className="px-4 py-3 border-0" style={{ width: '30%' }}><SkeletonBlock width="100px" height="0.75rem" /></th>
                                <th className="px-4 py-3 border-0" style={{ width: '15%' }}><SkeletonBlock width="60px" height="0.75rem" /></th>
                                <th className="px-4 py-3 border-0" style={{ width: '15%' }}><SkeletonBlock width="80px" height="0.75rem" /></th>
                                <th className="px-4 py-3 border-0" style={{ width: '10%' }}><SkeletonBlock width="50px" height="0.75rem" /></th>
                                <th className="px-4 py-3 border-0" style={{ width: '10%' }}><SkeletonBlock width="60px" height="0.75rem" /></th>
                                <th className="px-4 py-3 border-0 text-end pe-4"><SkeletonBlock width="70px" height="0.75rem" className="ms-auto" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <SkeletonTableRow key={i} columns={7} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default React.memo(LeadsPageSkeleton);
