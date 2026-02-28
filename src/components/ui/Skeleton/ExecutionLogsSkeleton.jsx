import React from 'react';
import { SkeletonBlock, SkeletonText } from './index';

const ExecutionLogsSkeleton = () => {
    return (
        <div className="container-fluid py-4 px-4 overflow-hidden">
            {/* Header Skeleton */}
            <div className="row mb-4 align-items-center">
                <div className="col">
                    <SkeletonBlock width="320px" height="2.5rem" className="mb-2" />
                    <SkeletonBlock width="250px" height="1rem" />
                </div>
                <div className="col-auto">
                    <SkeletonBlock width="350px" height="3rem" borderRadius="100px" />
                </div>
            </div>

            {/* Terminal Skeleton */}
            <div className="card border-0 shadow-lg bg-dark rounded-4 overflow-hidden" style={{ minHeight: '700px' }}>
                <div className="card-header border-0 bg-black bg-opacity-40 py-3 px-4 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                        <SkeletonBlock width="120px" height="1rem" borderRadius="100px" />
                        <SkeletonBlock width="80px" height="1rem" borderRadius="100px" />
                    </div>
                    <SkeletonBlock width="100px" height="1.5rem" borderRadius="100px" />
                </div>

                <div className="card-body p-4 activity-terminal" style={{ height: '700px' }}>
                    <div className="d-flex flex-column gap-4 mt-2">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="d-flex gap-4 align-items-start">
                                <SkeletonBlock width="85px" height="1rem" className="opacity-25" />
                                <SkeletonBlock width="60px" height="1rem" className="opacity-25" />
                                <div className="flex-grow-1">
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <SkeletonBlock width="100px" height="0.75rem" className="opacity-50" />
                                        <div className="flex-grow-1 border-top border-white border-opacity-10"></div>
                                    </div>
                                    <SkeletonText lines={2} className="opacity-50" lastLineWidth={`${Math.floor(Math.random() * 40) + 40}%`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ExecutionLogsSkeleton);
